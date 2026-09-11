from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.ad_repository import AdRepository
from app.repositories.user_repository import UserRepository
from app.schemas.ad import AdCreate, AdResponse
from app.schemas.stats import StatsResponse
from app.models.ad import Ad


class AdService:
    def __init__(self, db: Session):
        self.ad_repo = AdRepository(db)
        self.user_repo = UserRepository(db)

    def get_user_ads(self, user_id: int, type_filter: Optional[str] = None, search: Optional[str] = None) -> List[Ad]:
        return self.ad_repo.get_all_by_user(user_id, type_filter, search)

    def create_ad(self, user_id: int, ad_in: AdCreate) -> Ad:
        return self.ad_repo.create(user_id, ad_in)

    def delete_ad(self, ad_id: int, user_id: int) -> bool:
        deleted = self.ad_repo.delete(ad_id, user_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ad not found or unauthorized.")
        return True

    def get_user_stats(self, user_id: int) -> StatsResponse:
        user = self.user_repo.get_by_id(user_id)
        counts = self.ad_repo.count_by_user_and_type(user_id)
        return StatsResponse(
            images_created=counts["images_created"],
            videos_created=counts["videos_created"],
            avatar_ads=counts["avatar_ads"],
            total_ads=counts["total_ads"],
            credits_remaining=user.credits if user else 0,
        )
