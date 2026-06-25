from pydantic import BaseModel, ConfigDict


class TranscriptResponse(BaseModel):
    id: int
    meeting_id: int
    speaker: str
    text: str
    start_time: float
    end_time: float

    model_config = ConfigDict(
        from_attributes=True
    )


class CreateTranscriptRequest(BaseModel):
    meeting_id: int
    speaker: str
    text: str
    start_time: float
    end_time: float
    
    
class BulkTranscriptRequest(BaseModel):
    transcripts: list[CreateTranscriptRequest]
class UpdateTranscriptRequest(BaseModel):
    speaker: str | None = None
    text: str | None = None
    start_time: float | None = None
    end_time: float | None = None   
from pydantic import BaseModel


class TranscriptImportItem(BaseModel):
    speaker: str
    text: str
    start_time: float
    end_time: float


class TranscriptImportRequest(BaseModel):
    meeting_id: int
    transcripts: list[TranscriptImportItem]