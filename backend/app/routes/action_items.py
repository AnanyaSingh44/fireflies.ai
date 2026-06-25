from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.models import ActionItem, Meeting
from app.schemas.action_item import (
    ActionItemResponse,
    CreateActionItemRequest,
    UpdateActionItemRequest,
)

router = APIRouter(
    prefix="/action-items",
    tags=["Action Items"]
)


@router.get(
    "/",
    response_model=list[ActionItemResponse]
)
def get_action_items(
    db: Session = Depends(get_db)
):
    return db.query(ActionItem).all()


@router.get(
    "/{action_item_id}",
    response_model=ActionItemResponse
)
def get_action_item(
    action_item_id: int,
    db: Session = Depends(get_db)
):
    action_item = (
        db.query(ActionItem)
        .filter(ActionItem.id == action_item_id)
        .first()
    )

    if action_item is None:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    return action_item


@router.post(
    "/",
    response_model=ActionItemResponse
)
def create_action_item(
    data: CreateActionItemRequest,
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

    action_item = ActionItem(
        meeting_id=data.meeting_id,
        task=data.task,
        completed=data.completed
    )

    db.add(action_item)
    db.commit()
    db.refresh(action_item)

    return action_item


@router.put(
    "/{action_item_id}",
    response_model=ActionItemResponse
)
def update_action_item(
    action_item_id: int,
    data: UpdateActionItemRequest,
    db: Session = Depends(get_db)
):
    action_item = (
        db.query(ActionItem)
        .filter(ActionItem.id == action_item_id)
        .first()
    )

    if action_item is None:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    if data.task is not None:
        action_item.task = data.task

    if data.completed is not None:
        action_item.completed = data.completed

    db.commit()
    db.refresh(action_item)

    return action_item


@router.delete(
    "/{action_item_id}"
)
def delete_action_item(
    action_item_id: int,
    db: Session = Depends(get_db)
):
    action_item = (
        db.query(ActionItem)
        .filter(ActionItem.id == action_item_id)
        .first()
    )

    if action_item is None:
        raise HTTPException(
            status_code=404,
            detail="Action item not found"
        )

    db.delete(action_item)
    db.commit()

    return {
        "message": "Action item deleted successfully"
    }