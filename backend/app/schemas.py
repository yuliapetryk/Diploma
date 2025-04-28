from datetime import datetime

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

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    sex: str
    created_at: datetime

    class Config:
        orm_mode = True


class MoodLogCreate(BaseModel):
    text: str


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
