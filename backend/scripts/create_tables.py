import uuid
from datetime import datetime
from app.database import engine, Base, create_db, SessionLocal
from app.db_models import Emotion, Tip, BreathingExercise, User, DiaryEntry, WritingExerciseEntry
import json
from sqlalchemy.orm import Session
from uuid import uuid4
import bcrypt

# Paths to JSON data
EMOTIONS_JSON_PATH = "db_fill/emotions.json"
TIPS_JSON_PATH = "db_fill/tips.json"
BREATHING_JSON_PATH = "db_fill/breathing_exercises.json"
DIARY_JSON_PATH = "db_fill/diary_entries.json"
USERS_JSON_PATH = "db_fill/users.json"
WRITING_ENTRIES_JSON_PATH = "db_fill/writing_exercise_notes.json"

# Load JSON data from file
def load_json_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f" Error: File '{file_path}' not found.")
        return []


# Seed Emotions
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
        print(f" {len(emotions)} emotions added to the database.")
    except Exception as e:
        db.rollback()
        print(" Failed to add emotions:", e)
    finally:
        db.close()


# Seed Users
def seed_users():
    db: Session = SessionLocal()
    users = load_json_data(USERS_JSON_PATH)

    try:
        for user_data in users:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                if not all(k in user_data for k in ("password", "sex")):
                    print(f" Skipping user '{user_data['email']}', missing fields.")
                    continue

                hashed_password = bcrypt.hashpw(user_data["password"].encode("utf-8"), bcrypt.gensalt())
                new_user = User(
                    id=uuid.UUID(user_data["id"]),
                    email=user_data["email"],
                    name=user_data["name"],
                    password_hash=hashed_password.decode("utf-8"),
                    sex=user_data["sex"]
                )
                db.add(new_user)

        db.commit()
        print(f" {len(users)} users added to the database.")
    except Exception as e:
        db.rollback()
        print(" Failed to add users:", e)
    finally:
        db.close()


# Seed Tips
def seed_tips():
    db: Session = SessionLocal()
    tips = load_json_data(TIPS_JSON_PATH)

    try:
        for tip_data in tips:
            emotion = db.query(Emotion).filter(Emotion.name.ilike(tip_data["emotion"])).first()
            if not emotion:
                print(f" Emotion '{tip_data['emotion']}' not found. Skipping.")
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
        print(f" {len(tips)} tips added to the database.")
    except Exception as e:
        db.rollback()
        print(" Failed to add tips:", e)
    finally:
        db.close()


# Seed Breathing Exercises
def seed_breathing_exercises():
    db: Session = SessionLocal()
    exercises = load_json_data(BREATHING_JSON_PATH)

    try:
        for exercise_data in exercises:
            emotion = db.query(Emotion).filter(Emotion.name.ilike(exercise_data["emotion"])).first()
            if not emotion:
                print(f" Emotion '{exercise_data['emotion']}' not found. Skipping.")
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
        print(f" {len(exercises)} breathing exercises added to the database.")
    except Exception as e:
        db.rollback()
        print(" Failed to add breathing exercises:", e)
    finally:
        db.close()


# Seed Diary Entries
def seed_diary_entries():
    db: Session = SessionLocal()
    diary_entries = load_json_data(DIARY_JSON_PATH)

    try:
        for entry_data in diary_entries:
            user = db.query(User).filter(User.id == uuid.UUID(entry_data["user_id"])).first()
            if not user:
                print(f" User with ID '{entry_data['user_id']}' not found. Skipping.")
                continue

            existing = db.query(DiaryEntry).filter(
                DiaryEntry.text == entry_data["text"],
                DiaryEntry.date == datetime.strptime(entry_data["date"], "%Y-%m-%dT%H:%M:%S")
            ).first()

            if not existing:
                new_entry = DiaryEntry(
                    id=str(uuid4()),
                    text=entry_data["text"],
                    emotion=entry_data["emotion"],
                    date=datetime.strptime(entry_data["date"], "%Y-%m-%dT%H:%M:%S"),
                    user_id=user.id
                )
                db.add(new_entry)

        db.commit()
        print(f" {len(diary_entries)} diary entries added to the database.")
    except Exception as e:
        db.rollback()
        print(" Failed to add diary entries:", e)
    finally:
        db.close()

def seed_writing_entries():
    db: Session = SessionLocal()
    entries = load_json_data(WRITING_ENTRIES_JSON_PATH)

    try:
        for entry_data in entries:
            existing = db.query(WritingExerciseEntry).filter(WritingExerciseEntry.id == entry_data["id"]).first()
            if not existing:
                new_entry = WritingExerciseEntry(
                    id=entry_data["id"],
                    text=entry_data["text"],
                    date=entry_data["date"],
                    user_id=entry_data["user_id"]
                )
                db.add(new_entry)

        db.commit()
        print(f"{len(entries)} writing entries added to the database.")
    except Exception as e:
        db.rollback()
        print("Failed to add writing entries:", e)
    finally:
        db.close()

if __name__ == "__main__":
    print(" Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print(" All tables dropped successfully!")

    print(" Creating tables...")
    create_db()
    Base.metadata.create_all(bind=engine)
    print(" All tables created successfully!")

    print(" Seeding data...")
    seed_users()
    seed_emotions()
    seed_tips()
    seed_breathing_exercises()
    seed_diary_entries()
    seed_writing_entries()
    print(" All data seeded successfully!")
