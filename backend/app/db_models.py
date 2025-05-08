from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
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
    
    mood_logs = relationship("MoodLog", back_populates="user")


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    emotions_detected = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mood_logs")
    mood_log_tips = relationship("MoodLogTip", back_populates="mood_log")


class Tip(Base):
    __tablename__ = "tips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    emotion = Column(String, nullable=False)
    tip_text = Column(Text, nullable=False)
    language = Column(String, default="uk")


class MoodLogTip(Base):
    __tablename__ = "mood_log_tips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mood_log_id = Column(UUID(as_uuid=True), ForeignKey("mood_logs.id"), nullable=False)
    tip_id = Column(UUID(as_uuid=True), ForeignKey("tips.id"), nullable=False)

    mood_log = relationship("MoodLog", back_populates="mood_log_tips")
    tip = relationship("Tip")
