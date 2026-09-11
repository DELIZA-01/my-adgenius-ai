from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.ad import Ad
from app.schemas.ad import AdCreate


class AdRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, ad_id: int, user_id: int) -> Optional[Ad]:
        return self.db.query(Ad).filter(Ad.id == ad_id, Ad.user_id == user_id).first()

    def get_all_by_user(
        self,
        user_id: int,
        type_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Ad]:
        query = self.db.query(Ad).filter(Ad.user_id == user_id)
        if type_filter and type_filter.lower() != "all":
            query = query.filter(Ad.type == type_filter.lower())
        if search:
            query = query.filter(Ad.title.ilike(f"%{search}%"))
        return query.order_by(Ad.created_at.desc()).all()

    def create(self, user_id: int, ad_in: AdCreate) -> Ad:
        db_ad = Ad(
            user_id=user_id,
            title=ad_in.title,
            type=ad_in.type,
            media_url=ad_in.media_url,
            thumbnail_url=ad_in.thumbnail_url or ad_in.media_url,
            prompt=ad_in.prompt,
            aspect_ratio=ad_in.aspect_ratio,
            style=ad_in.style,
            duration=ad_in.duration,
            status="completed",
        )
        self.db.add(db_ad)
        self.db.commit()
        self.db.refresh(db_ad)
        return db_ad

    def delete(self, ad_id: int, user_id: int) -> bool:
        ad = self.get_by_id(ad_id, user_id)
        if not ad:
            return False
        self.db.delete(ad)
        self.db.commit()
        return True

    def count_by_user_and_type(self, user_id: int) -> dict:
        total = self.db.query(Ad).filter(Ad.user_id == user_id).count()
        images = self.db.query(Ad).filter(Ad.user_id == user_id, Ad.type == "image").count()
        videos = self.db.query(Ad).filter(Ad.user_id == user_id, Ad.type == "video").count()
        avatars = self.db.query(Ad).filter(Ad.user_id == user_id, Ad.type == "avatar").count()
        return {
            "total_ads": total,
            "images_created": images,
            "videos_created": videos,
            "avatar_ads": avatars,
        }
