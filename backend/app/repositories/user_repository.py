from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.password import get_password_hash


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            credits=100,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user: User, user_in: UserUpdate) -> User:
        if user_in.full_name is not None:
            user.full_name = user_in.full_name
        if user_in.avatar_url is not None:
            user.avatar_url = user_in.avatar_url
        if user_in.password:
            user.hashed_password = get_password_hash(user_in.password)
        self.db.commit()
        self.db.refresh(user)
        return user

    def deduct_credits(self, user: User, amount: int) -> bool:
        if user.credits < amount:
            return False
        user.credits -= amount
        self.db.commit()
        self.db.refresh(user)
        return True
