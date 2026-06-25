from pydantic import BaseModel


class TranscriptPasteRequest(BaseModel):
    meeting_id: int
    transcript: str
    
