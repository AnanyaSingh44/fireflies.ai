from datetime import datetime
from pydantic import BaseModel, ConfigDict



class ParticipantMiniResponse(BaseModel):
    id: int
    name: str
    email: str | None = None

    model_config = ConfigDict(from_attributes=True)

class MeetingListResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration: int

    participants: list[ParticipantMiniResponse] = []

    model_config = ConfigDict(from_attributes=True)

class TopicMiniResponse(BaseModel):
    id: int
    title: str
    summary: str | None = None
    start_time: float
    end_time: float

    model_config = ConfigDict(from_attributes=True)


class ActionItemMiniResponse(BaseModel):
    id: int
    task: str
    completed: bool

    model_config = ConfigDict(from_attributes=True)


class TranscriptMiniResponse(BaseModel):
    id: int
    speaker: str
    text: str
    start_time: float
    end_time: float

    model_config = ConfigDict(from_attributes=True)

class ParticipantResponse(BaseModel):
    id: int
    name: str
    email: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MeetingDetailResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration: int
    media_url: str | None = None
    summary: str | None = None

    participants: list[ParticipantResponse] = []
    topics: list[TopicMiniResponse] = []
    action_items: list[ActionItemMiniResponse] = []
    transcripts: list[TranscriptMiniResponse] = []

    model_config = ConfigDict(from_attributes=True)



class CreateMeetingRequest(BaseModel):
    title: str
    duration: int
    media_url: str | None = None
    summary: str | None = None
    participant_names: list[str]
    transcript: str  

class UpdateMeetingRequest(BaseModel):
    title: str | None = None
    duration: int | None = None
    summary: str | None = None
    media_url: str | None = None
    
class UpdateSummaryRequest(BaseModel):
    summary: str
    
