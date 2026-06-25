import re 
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.db.deps import get_db
from app.models.models import Meeting, Participant, TranscriptSegment 
from app.schemas.meeting import (
    CreateMeetingRequest,
    MeetingDetailResponse,
    MeetingListResponse,
    UpdateMeetingRequest,
)

router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"],
)


@router.get(
    "/",
    response_model=list[MeetingListResponse]
)
def get_meetings(
    sort: str = "recent",
    date_filter: str = "all",
    db: Session = Depends(get_db),
):
    query = (
        db.query(Meeting)
        .options(joinedload(Meeting.participants))
    )

    now = datetime.utcnow()

    if date_filter == "today":
        start = datetime(now.year, now.month, now.day)
        query = query.filter(Meeting.date >= start)

    elif date_filter == "week":
        query = query.filter(
            Meeting.date >= now - timedelta(days=7)
        )

    elif date_filter == "month":
        query = query.filter(
            Meeting.date >= now - timedelta(days=30)
        )

    if sort == "recent":
        query = query.order_by(Meeting.date.desc())
    else:
        query = query.order_by(Meeting.date.asc())

    return query.all()


@router.get(
    "/search",
    response_model=list[MeetingListResponse]
)
def search_meetings(
    q: str,
    db: Session = Depends(get_db),
):
    return (
        db.query(Meeting)
        .options(joinedload(Meeting.participants))
        .outerjoin(Meeting.participants)
        .filter(
            or_(
                Meeting.title.ilike(f"%{q}%"),
                Meeting.summary.ilike(f"%{q}%"),
                Participant.name.ilike(f"%{q}%"),
            )
        )
        .distinct()
        .order_by(Meeting.date.desc())
        .all()
    )


@router.get(
    "/{meeting_id}",
    response_model=MeetingDetailResponse
)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .options(
            joinedload(Meeting.participants),
            joinedload(Meeting.transcripts),
            joinedload(Meeting.action_items),
            joinedload(Meeting.topics),
        )
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    return meeting


@router.post(
    "/",
    response_model=MeetingDetailResponse
)
def create_meeting(
    data: CreateMeetingRequest,
    db: Session = Depends(get_db),
):
    # 1. Create the base meeting instance
    meeting = Meeting(
        title=data.title,
        duration=data.duration,
        summary=data.summary,
        media_url=data.media_url,
        date=datetime.utcnow(),
    )

    # 2. Map and attach participants
    participants = []
    for name in data.participant_names:
        participant = Participant(name=name)
        participants.append(participant)
    meeting.participants = participants

    # 3. Step 3 — Auto-Split Transcript Parser
    # Extracts groups: Speaker Name followed by their respective dialogue blocks
    pattern = r"(?:^|\n)([A-Za-z\s0-9_-]+):\s*\n*(.*?)(?=\n[A-Za-z\s0-9_-]+:|$)"
    segments = re.findall(pattern, data.transcript, re.DOTALL)

    transcripts = []
    if segments:
        total_segments = len(segments)
        # Distribute lengths evenly across total duration (converted to float seconds)
        time_per_segment = float(data.duration) / total_segments if total_segments > 0 else 0.0

        for index, (speaker, text) in enumerate(segments):
            clean_speaker = speaker.strip()
            clean_text = text.strip()
            
            start_time = float(index) * time_per_segment
            end_time = start_time + time_per_segment
            
            # Clamp the final segment's end time to match the total meeting duration boundary precisely
            if index == total_segments - 1:
                end_time = float(data.duration)

            # FIXED: Correctly referenced 'TranscriptSegment' model class mapped to relationship context
            transcript_segment = TranscriptSegment(
                speaker=clean_speaker,
                text=clean_text,
                start_time=start_time,
                end_time=end_time
            )
            transcripts.append(transcript_segment)

    meeting.transcripts = transcripts

    # 4. Save entire object layout atomically
    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


@router.put(
    "/{meeting_id}",
    response_model=MeetingDetailResponse
)
def update_meeting(
    meeting_id: int,
    data: UpdateMeetingRequest,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    if data.title is not None:
        meeting.title = data.title

    if data.duration is not None:
        meeting.duration = data.duration

    if data.summary is not None:
        meeting.summary = data.summary

    if data.media_url is not None:
        meeting.media_url = data.media_url

    db.commit()
    db.refresh(meeting)

    return meeting


@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    db.delete(meeting)
    db.commit()

    return {
        "message": "Meeting deleted successfully"
    }