from typing import Optional

from sqlalchemy.orm import Session
from app.db_models import User
import uuid
from datetime import datetime


def create_user(
        db: Session,
        email: str,
        name: str,
        password_hash: Optional[str] = None,
        sex: Optional[str] = None
):
    new_user = User(
        id=uuid.uuid4(),
        email=email,
        password_hash=password_hash,
        name=name,
        sex=sex,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
