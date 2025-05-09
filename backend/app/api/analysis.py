from fastapi import APIRouter

from app.database import SessionLocal
from app.model import predict_emotions
from app.schemas import TextInput

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
async def analyze(input: TextInput):
    print("Received:", input.text)

    results = predict_emotions(input.text)

    print("Response:", results)

    return {"result": results}
