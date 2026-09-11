from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.generation import (
    GenerateImageRequest,
    GenerateVideoRequest,
    GenerateAvatarRequest,
    GenerateScriptRequest,
    GenerateScriptResponse,
    GenerationResponse,
)
from app.services.generation_service import GenerationService

router = APIRouter(prefix="/generate", tags=["Generation"])


@router.post("/image", response_model=GenerationResponse)
def generate_image(
    req: GenerateImageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GenerationService(db)
    return service.generate_image(current_user.id, req)


@router.post("/video", response_model=GenerationResponse)
def generate_video(
    req: GenerateVideoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GenerationService(db)
    return service.generate_video(current_user.id, req)


@router.post("/avatar", response_model=GenerationResponse)
def generate_avatar(
    req: GenerateAvatarRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GenerationService(db)
    return service.generate_avatar(current_user.id, req)


@router.post("/script", response_model=GenerateScriptResponse)
def generate_script(
    req: GenerateScriptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = GenerationService(db)
    return service.generate_script(req)
