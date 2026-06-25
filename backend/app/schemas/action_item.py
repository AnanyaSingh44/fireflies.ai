from pydantic import BaseModel, ConfigDict


class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    task: str
    completed: bool

    model_config = ConfigDict(
        from_attributes=True
    )


class CreateActionItemRequest(BaseModel):
    meeting_id: int
    task: str
    completed: bool = False


class UpdateActionItemRequest(BaseModel):
    task: str | None = None
    completed: bool | None = None