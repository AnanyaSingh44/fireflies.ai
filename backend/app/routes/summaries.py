from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.models import Meeting
from app.schemas.meeting import (
    UpdateSummaryRequest,
    MeetingDetailResponse
)

router = APIRouter(
    tags=["Summaries"]
)


@router.patch(
    "/meetings/{meeting_id}/summary",
    response_model=MeetingDetailResponse
)
def update_summary(
    meeting_id: int,
    data: UpdateSummaryRequest,
    db: Session = Depends(get_db)
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    meeting.summary = data.summary

    db.commit()
    db.refresh(meeting)

    return meeting