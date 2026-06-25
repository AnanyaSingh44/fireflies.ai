from datetime import datetime
import sys
from pathlib import Path

# Make the backend root importable when running this file directly.
BACKEND_ROOT = Path(__file__).resolve().parents[2]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.append(str(BACKEND_ROOT))

from app.db.database import SessionLocal, engine, Base
from app.models.models import (
    Meeting,
    Participant,
    Topic,
    ActionItem,
    TranscriptSegment,
)


def seed_data() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        existing_meeting = db.query(Meeting).first()
        if existing_meeting:
            print("Seed data already exists.")
            return

        meeting = Meeting(
            title="Sprint Planning",
            date=datetime.now(),
            duration=3600,
            media_url="/sample.mp3",
            summary="""
Discussed API architecture, database schema,
authentication flow, and deployment strategy.
""",
        )

        john = Participant(
            name="John Doe",
            email="john@example.com",
        )

        sarah = Participant(
            name="Sarah Smith",
            email="sarah@example.com",
        )

        meeting.participants.extend([john, sarah])

        topic_auth = Topic(
            title="Authentication",
            summary="Discussion around JWT authentication and authorization.",
            start_time=0,
            end_time=300,
        )

        topic_db = Topic(
            title="Database Design",
            summary="Reviewed meeting, participant and transcript schemas.",
            start_time=300,
            end_time=900,
        )

        action_doc = ActionItem(
            task="Create API documentation",
            completed=False,
        )

        action_deploy = ActionItem(
            task="Deploy backend service",
            completed=False,
        )

        transcript_1 = TranscriptSegment(
            speaker="John Doe",
            text="Let's begin sprint planning and discuss the backend architecture.",
            start_time=0,
            end_time=15,
        )

        transcript_2 = TranscriptSegment(
            speaker="Sarah Smith",
            text="Authentication and authorization should be prioritized first.",
            start_time=16,
            end_time=35,
        )

        transcript_3 = TranscriptSegment(
            speaker="John Doe",
            text="After authentication we can finalize the database schema.",
            start_time=36,
            end_time=55,
        )

        meeting.topics.extend([topic_auth, topic_db])
        meeting.action_items.extend([action_doc, action_deploy])
        meeting.transcripts.extend(
            [transcript_1, transcript_2, transcript_3]
        )

        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        print(
            f"Seed data inserted successfully. Meeting ID: {meeting.id}"
        )

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()