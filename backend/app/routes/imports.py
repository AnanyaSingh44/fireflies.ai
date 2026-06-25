from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.deps import get_db
from app.models.models import TranscriptSegment

router = APIRouter(
    prefix="/imports",
    tags=["Imports"]
)
from app.schemas.transcript import (
    TranscriptImportRequest,
    
)


class TranscriptPasteRequest(BaseModel):
    meeting_id: int
    transcript: str


@router.post("/transcripts/paste")
def paste_transcript(
    data: TranscriptPasteRequest,
    db: Session = Depends(get_db)
):
    lines = data.transcript.split("\n")

    transcripts = []

    current_time = 0

    for line in lines:
        if ":" not in line:
            continue

        speaker, text = line.split(":", 1)

        segment = TranscriptSegment(
            meeting_id=data.meeting_id,
            speaker=speaker.strip(),
            text=text.strip(),
            start_time=current_time,
            end_time=current_time + 5
        )

        current_time += 5

        transcripts.append(segment)

    db.add_all(transcripts)
    db.commit()

    return {
        "segments_created": len(transcripts)
    }
    
@router.post("/transcripts/import")
def import_transcripts(
    data: TranscriptImportRequest,
    db: Session = Depends(get_db)
):
    transcripts = []

    for item in data.transcripts:
        segment = TranscriptSegment(
            meeting_id=data.meeting_id,
            speaker=item.speaker,
            text=item.text,
            start_time=item.start_time,
            end_time=item.end_time
        )

        transcripts.append(segment)

    db.add_all(transcripts)
    db.commit()

    return {
        "segments_created": len(transcripts)
    }