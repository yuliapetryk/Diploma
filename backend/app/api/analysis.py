from datetime import datetime
from uuid import uuid4

from fastapi import Depends, APIRouter, Request, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.db_models import DiaryEntry, User, WritingExerciseEntry
from app.model import predict_emotions
from app.schemas import WritingExerciseCreate, WritingExerciseEntrySchema
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from uuid import uuid4
from datetime import datetime
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/analyze")
async def analyze_text(
        request: Request,
        db: Session = Depends(get_db),
):
    body = await request.json()
    text = body.get("text")
    language = body.get("language", "uk")
    user_id = body.get("user_id")

    if not text:
        return {"error": "Text is required."}
    result = predict_emotions(text, db, language)

    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            for emotion_data in result:
                entry = DiaryEntry(
                    id=str(uuid4()),
                    text=text,
                    emotion=emotion_data["emotion"],
                    date=datetime.now(),
                    user_id=user_id
                )
                db.add(entry)
            db.commit()

    return {"emotions": result}

@router.get("/diary/{user_id}")
def get_diary_entries(user_id: str, db: Session = Depends(get_db)):
    diary_entries = db.query(DiaryEntry).filter(DiaryEntry.user_id == user_id).all()

    result = []
    for entry in diary_entries:
        result.append({
            "date": entry.date.strftime("%Y-%m-%d %H:%M:%S"),
            "emotion": entry.emotion,
            "text": entry.text
        })

    return {"entries": result}

@router.post("/diary/write_exercise")
async def create_writing_exercise(
        entry: WritingExerciseCreate,
        db: Session = Depends(get_db)
):
    new_entry = WritingExerciseEntry(
        id=uuid4(),
        text=entry.text,
        date=datetime.utcnow(),
        user_id=entry.user_id
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return {"message": "Entry created successfully", "entry": new_entry}


@router.get(
    "/diary/write_exercises/{user_id}",
    response_model=List[WritingExerciseEntrySchema]
)
def get_writing_exercises(
        user_id: str,
        db: Session = Depends(get_db),
):
    entries = (
        db.query(WritingExerciseEntry)
        .filter(WritingExerciseEntry.user_id == user_id)
        .order_by(desc(WritingExerciseEntry.date))
        .all()
    )
    return entries