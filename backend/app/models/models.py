from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
    ForeignKey,
    Float,
    Boolean,
    Table
)
from sqlalchemy.orm import relationship
from app.db.database import Base

# Junction Table for Many-to-Many relationship between Meetings and Participants
meeting_participants = Table(
    "meeting_participants",
    Base.metadata,
    Column("meeting_id", Integer, ForeignKey("meetings.id", ondelete="CASCADE"), primary_key=True),
    Column("participant_id", Integer, ForeignKey("participants.id", ondelete="CASCADE"), primary_key=True)
)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)  # in seconds
    media_url = Column(String, nullable=True)   # Placeholder for audio/video file [cite: 25]
    summary = Column(Text, nullable=True)        # AI summary text [cite: 28]

    # Many-to-Many relationship 
    participants = relationship(
        "Participant",
        secondary=meeting_participants,
        back_populates="meetings"
    )

    # One-to-Many relationships [cite: 24, 29, 30]
    transcripts = relationship(
        "TranscriptSegment",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )

    action_items = relationship(
        "ActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )

    topics = relationship(
        "Topic",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)

    # Back-populate the M:M relationship
    meetings = relationship(
        "Meeting",
        secondary=meeting_participants,
        back_populates="participants"
    )


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    speaker = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    start_time = Column(Float, nullable=False)  # Crucial for timestamp syncing [cite: 24, 26]
    end_time = Column(Float, nullable=False)

    meeting = relationship("Meeting", back_populates="transcripts")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    task = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)  # [cite: 36]

    meeting = relationship("Meeting", back_populates="action_items")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    title = Column(String, nullable=False)      # e.g., "Intro", "Pricing Discussion" 
    summary = Column(Text, nullable=True)        # Brief bullet point or note for this topic
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)    # Added for clean UI segmentation

    meeting = relationship("Meeting", back_populates="topics")