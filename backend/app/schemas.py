from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    sex: str


from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleLogin(BaseModel):
    email: EmailStr
    name: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    sex: str
    created_at: datetime
    reset_token: Optional[str] = None

    class Config:
        orm_mode = True


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class MoodLogCreate(BaseModel):
    text: str


class ChangePassword(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str


class ChangeName(BaseModel):
    email: EmailStr
    new_name: str


class MoodLogOut(BaseModel):
    id: str
    text: str
    emotions_detected: dict
    created_at: datetime

    class Config:
        orm_mode = True


class TipOut(BaseModel):
    id: str
    emotion: str
    tip_text: str

    class Config:
        orm_mode = True

class WritingExerciseCreate(BaseModel):
    text: str
    user_id: UUID

class WritingExerciseEntrySchema(BaseModel):
    id: UUID
    text: str
    date: datetime
    user_id: UUID

    class Config:
        orm_mode = True

class TextInput(BaseModel):
    text: str
