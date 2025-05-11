from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

from app.db_models import Tip, BreathingExercise, Emotion

MODEL_NAME = "./model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "optimism", "pride", "realization", "relief",
    "remorse", "sadness", "surprise", "neutral"
]

from sqlalchemy.orm import Session

def predict_emotions(text: str, db: Session, language: str = 'uk'):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1).squeeze()

    scores = {LABELS[i]: probs[i].item() for i in range(len(LABELS))}
    sorted_emotions = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    print("\n🔹 Detected Emotion Scores:")
    for emotion, score in sorted_emotions:
        print(f"{emotion}: {score:.4f}")

    top_emotions = [emotion for emotion, _ in sorted_emotions[:3]]
    emotions = db.query(Emotion).filter(Emotion.name.in_(top_emotions)).all()
    emotions.sort(key=lambda x: top_emotions.index(x.name))

    results = []
    for emotion in emotions:
        tips = db.query(Tip).filter(
            Tip.emotion_id == emotion.id,
            Tip.language == language
        ).all()

        if tips:
            tips_data = [{
                "id": str(t.id),
                "title": t.title,
                "description": t.description,
                "type": t.type.value
            } for t in tips]
            results.append({
                "emotion": emotion.name,
                "type": "tips",
                "data": tips_data
            })

        if not tips:
            breathing_exercises = db.query(BreathingExercise).filter(
                BreathingExercise.emotion_id == emotion.id,
                BreathingExercise.language == language
            ).all()

            if breathing_exercises:
                breathing_data = [{
                    "id": str(b.id),
                    "title": b.title,
                    "description": b.description,
                    "inhale_duration": b.inhale_duration,
                    "hold_duration": b.hold_duration,
                    "exhale_duration": b.exhale_duration,
                    "cycles": b.cycles
                } for b in breathing_exercises]

                results.append({
                    "emotion": emotion.name,
                    "type": "breathing_exercises",
                    "data": breathing_data
                })

    results.sort(key=lambda x: top_emotions.index(x["emotion"]))

    print("\n Final Sorted Results:")
    for item in results:
        print(f"{item['emotion']}: {item['type']} - {len(item['data'])} items")

    return results
