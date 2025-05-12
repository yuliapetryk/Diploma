from datetime import datetime
from uuid import uuid4

from fastapi import Depends, APIRouter, Request
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.db_models import DiaryEntry, User
from app.model import predict_emotions

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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

    if not user_id:
        return {"error": "User ID is required."}

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": f"User with ID {user_id} does not exist."}

    result = predict_emotions(text, db, language)

    for emotion_data in result:
        diary_entry = DiaryEntry(
            id=str(uuid4()),
            text=text,
            emotion=emotion_data["emotion"],
            date=datetime.now(),
            user_id=user_id
        )
        db.add(diary_entry)

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