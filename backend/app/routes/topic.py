from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.models import Meeting, Topic
from app.schemas.topic import (
    TopicCreateRequest,
    TopicResponse
)

router = APIRouter(
    prefix="/topics",
    tags=["Topics"]
)


@router.post(
    "/{meeting_id}",
    response_model=TopicResponse
)
def create_topic(
    meeting_id: int,
    data: TopicCreateRequest,
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

    topic = Topic(
        meeting_id=meeting_id,
        title=data.title,
        summary=data.summary,
        start_time=data.start_time,
        end_time=data.end_time
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic


@router.get(
    "/{meeting_id}",
    response_model=list[TopicResponse]
)
def get_topics(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Topic)
        .filter(
            Topic.meeting_id == meeting_id
        )
        .order_by(
            Topic.start_time.asc()
        )
        .all()
    )