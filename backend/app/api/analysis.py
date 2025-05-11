from fastapi import FastAPI, Depends, APIRouter, Request
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.model import predict_emotions

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
async def analyze_text(request: Request, db: Session = Depends(get_db)):

    body = await request.json()
    text = body.get("text")
    language = body.get("language", "uk")

    if not text:
        return {"error": "Text is required."}

    result = predict_emotions(text, db, language)
    return {"emotions": result}