import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database import SessionLocal
from app.db_models import User
from app.schemas import UserCreate, UserOut, UserLogin, PasswordResetRequest, PasswordResetConfirm
from app.crud import users as crud_users
from app.core import security
from pydantic import BaseModel

from app.utils import send_reset_email


class GoogleLogin(BaseModel):
    email: str
    name: str


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register_user(user_create: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_users.get_user_by_email(db, email=user_create.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = security.hash_password(user_create.password)

    user = crud_users.create_user(
        db=db,
        email=user_create.email,
        password_hash=hashed_password,
        name=user_create.name,
        sex=user_create.sex,
    )

    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "message": "User registered successfully"
    }


@router.get("/check-email")
def check_email(email: str, db: Session = Depends(get_db)):
    existing_user = crud_users.get_user_by_email(db, email=email)
    if existing_user:
        return {
            "exists": True,
            "provider": existing_user.auth_provider or "local"
        }
    return {"exists": False}


@router.post("/login")
def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    db_user = crud_users.get_user_by_email(db, email=user_login.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not security.verify_password(user_login.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "id": str(db_user.id),
        "name": db_user.name,
        "email": db_user.email
    }


@router.post("/google-login")
def google_login(user_data: GoogleLogin, db: Session = Depends(get_db)):
    user = crud_users.get_user_by_email(db, user_data.email)
    if not user:
        user = crud_users.create_user(
            db=db,
            email=user_data.email,
            name=user_data.name,
            auth_provider="google"
        )
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
    }

@router.post("/forgot-password")
def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.commit()
    send_reset_email(user.email, reset_token)

    return {"message": "Password reset link has been sent to your email"}

@router.post("/reset-password")
def reset_password(request: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == request.token).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid token")

    hashed_password = get_password_hash(request.new_password)

    user.password_hash = hashed_password
    user.reset_token = None
    db.commit()

    return {"message": "Password has been successfully reset"}