from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.models import TranscriptSegment, Meeting


from app.schemas.transcript import (
    TranscriptResponse,
    CreateTranscriptRequest,
    UpdateTranscriptRequest,
    TranscriptImportRequest,
    BulkTranscriptRequest
)

router = APIRouter(
    prefix="/transcripts",
    tags=["Transcripts"]
)


@router.get(
    "/",
    response_model=list[TranscriptResponse]
)
def get_transcripts(
    db: Session = Depends(get_db)
):
    return db.query(TranscriptSegment).all()
@router.get(
    "/{meeting_id}/search",
    response_model=list[TranscriptResponse]
)
def search_transcripts(
    meeting_id: int,
    q: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(TranscriptSegment)
        .filter(
            TranscriptSegment.meeting_id == meeting_id
        )
        .filter(
            TranscriptSegment.text.ilike(
                f"%{q}%"
            )
        )
        .order_by(
            TranscriptSegment.start_time.asc()
        )
        .all()
    ) 
  

@router.get(
    "/{transcript_id}",
    response_model=TranscriptResponse
)
def get_transcript(
    transcript_id: int,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.id == transcript_id)
        .first()
    )

    if transcript is None:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    return transcript
@router.get(
    "/meeting/{meeting_id}",
    response_model=list[TranscriptResponse]
)
def get_meeting_transcripts(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(TranscriptSegment)
        .filter(
            TranscriptSegment.meeting_id == meeting_id
        )
        .order_by(
            TranscriptSegment.start_time.asc()
        )
        .all()
    )

@router.post(
    "/",
    response_model=TranscriptResponse
)
def create_transcript(
    data: CreateTranscriptRequest,
    db: Session = Depends(get_db)
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == data.meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    transcript = TranscriptSegment(
        meeting_id=data.meeting_id,
        speaker=data.speaker,
        text=data.text,
        start_time=data.start_time,
        end_time=data.end_time
    )

    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return transcript


@router.put(
    "/{transcript_id}",
    response_model=TranscriptResponse
)
def update_transcript(
    transcript_id: int,
    data: UpdateTranscriptRequest,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.id == transcript_id)
        .first()
    )

    if transcript is None:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    if data.speaker is not None:
        transcript.speaker = data.speaker

    if data.text is not None:
        transcript.text = data.text
        
    if data.start_time is not None:
        transcript.start_time = data.start_time

    if data.end_time is not None:
        transcript.end_time = data.end_time

    db.commit()
    db.refresh(transcript)

    return transcript


@router.delete(
    "/{transcript_id}"
)
def delete_transcript(
    transcript_id: int,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.id == transcript_id)
        .first()
    )

    if transcript is None:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    db.delete(transcript)
    db.commit()

    return {
        "message": "Transcript deleted successfully"
    }

  
@router.post("/bulk")
def create_bulk_transcripts(
    data: BulkTranscriptRequest,
    db: Session = Depends(get_db)
):
    transcripts = []

    for item in data.transcripts:
        transcript = TranscriptSegment(
            meeting_id=item.meeting_id,
            speaker=item.speaker,
            text=item.text,
            start_time=item.start_time,
            end_time=item.end_time
        )

        transcripts.append(transcript)

    db.add_all(transcripts)
    db.commit()

    return {
        "message": f"{len(transcripts)} transcripts created"
    }