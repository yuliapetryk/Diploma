from app.database import engine, Base, create_db, SessionLocal
from app.db_models import Emotion, Tip, BreathingExercise
import json
from sqlalchemy.orm import Session
from uuid import uuid4

EMOTIONS_JSON_PATH = "db_fill/emotions.json"
TIPS_JSON_PATH = "db_fill/tips.json"
BREATHING_JSON_PATH = "db_fill/breathing_exercises.json"

def load_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def seed_emotions():
    db: Session = SessionLocal()
    emotions = load_json_data(EMOTIONS_JSON_PATH)

    try:
        for emotion in emotions:
            existing = db.query(Emotion).filter(Emotion.name == emotion).first()
            if not existing:
                new_emotion = Emotion(id=uuid4(), name=emotion)
                db.add(new_emotion)
        db.commit()
        print(f"{len(emotions)} emotions added to the database.")
    except Exception as e:
        db.rollback()
        print("Failed to add emotions:", e)
    finally:
        db.close()


def seed_tips():
    db: Session = SessionLocal()
    tips = load_json_data(TIPS_JSON_PATH)

    try:
        for tip_data in tips:
            emotion = db.query(Emotion).filter(Emotion.name.ilike(tip_data["emotion"])).first()
            if not emotion:
                print(f"Emotion '{tip_data['emotion']}' not found. Skipping.")
                continue

            existing = db.query(Tip).filter(
                Tip.title == tip_data["title"],
                Tip.emotion_id == emotion.id,
                Tip.language == tip_data["language"]
            ).first()

            if not existing:
                new_tip = Tip(
                    id=uuid4(),
                    title=tip_data["title"],
                    description=tip_data["description"],
                    type=tip_data["type"],
                    emotion_id=emotion.id,
                    language=tip_data["language"]
                )
                db.add(new_tip)

        db.commit()
        print(f"{len(tips)} tips added to the database.")
    except Exception as e:
        db.rollback()
        print("Failed to add tips:", e)
    finally:
        db.close()


def seed_breathing_exercises():
    db: Session = SessionLocal()
    exercises = load_json_data(BREATHING_JSON_PATH)

    try:
        for exercise_data in exercises:
            emotion = db.query(Emotion).filter(Emotion.name.ilike(exercise_data["emotion"])).first()
            if not emotion:
                print(f"Emotion '{exercise_data['emotion']}' not found. Skipping.")
                continue

            language = exercise_data.get("language", "en")

            existing = db.query(BreathingExercise).filter(
                BreathingExercise.title == exercise_data["title"],
                BreathingExercise.emotion_id == emotion.id,
                BreathingExercise.language == language
            ).first()

            if not existing:
                new_exercise = BreathingExercise(
                    id=uuid4(),
                    title=exercise_data["title"],
                    description=exercise_data["description"],
                    inhale_duration=exercise_data.get("inhale_duration", 4),
                    hold_duration=exercise_data.get("hold_duration", 4),
                    exhale_duration=exercise_data.get("exhale_duration", 4),
                    cycles=exercise_data.get("cycles", 3),
                    emotion_id=emotion.id,
                    language=language
                )
                db.add(new_exercise)

        db.commit()
        print(f"{len(exercises)} breathing exercises added to the database.")
    except Exception as e:
        db.rollback()
        print("Failed to add breathing exercises:", e)
    finally:
        db.close()

if __name__ == "__main__":
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped successfully!")

    print("Creating tables...")
    create_db()
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully!")

    print("Seeding emotions...")
    seed_emotions()
    print("Seeding emotions completed successfully!")

    print("Seeding tips...")
    seed_tips()
    print("Seeding tips completed successfully!")

    print("Seeding breathing exercises...")
    seed_breathing_exercises()
    print("Seeding breathing exercises completed successfully!")
