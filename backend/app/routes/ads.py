from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.ad import AdCreate, AdResponse
from app.services.ad_service import AdService

router = APIRouter(prefix="/ads", tags=["Ads"])


@router.get("", response_model=List[AdResponse])
def get_ads(
    type: Optional[str] = Query(None, description="Filter by ad type ('image', 'video', 'avatar')"),
    search: Optional[str] = Query(None, description="Search term"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AdService(db)
    return service.get_user_ads(current_user.id, type, search)


@router.post("", response_model=AdResponse, status_code=status.HTTP_201_CREATED)
def create_ad(
    ad_in: AdCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AdService(db)
    return service.create_ad(current_user.id, ad_in)


@router.delete("/{ad_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ad(
    ad_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = AdService(db)
    service.delete_ad(ad_id, current_user.id)
    return None
