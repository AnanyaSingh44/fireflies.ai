from pydantic import BaseModel, ConfigDict


class TopicCreateRequest(BaseModel):
    title: str
    summary: str | None = None
    start_time: float
    end_time: float


class TopicResponse(BaseModel):
    id: int
    meeting_id: int
    title: str
    summary: str | None = None
    start_time: float
    end_time: float

    model_config = ConfigDict(
        from_attributes=True
    )