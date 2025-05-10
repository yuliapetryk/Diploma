from enum import Enum

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    sex = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    auth_provider = Column(String, default="local")
    reset_token = Column(String, nullable=True)

    mood_logs = relationship("MoodLog", back_populates="user")


class TipType(str, Enum):
    TIP = "tip"
    WRITING_EXERCISE = "writing_exercise"


class Tip(Base):
    __tablename__ = "tips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(ENUM(TipType, name="tip_type"), nullable=False)
    emotion_id = Column(UUID(as_uuid=True), ForeignKey('emotions.id'), nullable=False)
    language = Column(String, nullable=False, default='en')
    emotion = relationship("Emotion", back_populates="tips")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BreathingExercise(Base):
    __tablename__ = "breathing_exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    inhale_duration = Column(Integer, default=4)
    hold_duration = Column(Integer, default=4)
    exhale_duration = Column(Integer, default=4)
    cycles = Column(Integer, default=3)
    emotion_id = Column(UUID(as_uuid=True), ForeignKey('emotions.id'), nullable=False)
    language = Column(String, nullable=False, default='en')
    emotion = relationship("Emotion", back_populates="breathing_exercises")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)

    # Relationships to new tables
    tips = relationship("Tip", back_populates="emotion", cascade="all, delete-orphan")
    breathing_exercises = relationship("BreathingExercise", back_populates="emotion", cascade="all, delete-orphan")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    emotions_detected = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mood_logs")
    mood_log_tips = relationship("MoodLogTip", back_populates="mood_log")


class MoodLogTip(Base):
    __tablename__ = "mood_log_tips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mood_log_id = Column(UUID(as_uuid=True), ForeignKey("mood_logs.id"), nullable=False)
    tip_id = Column(UUID(as_uuid=True), ForeignKey("tips.id"), nullable=False)

    mood_log = relationship("MoodLog", back_populates="mood_log_tips")
    tip = relationship("Tip")
