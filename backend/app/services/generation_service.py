import random
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.repositories.ad_repository import AdRepository
from app.schemas.generation import (
    GenerateImageRequest,
    GenerateVideoRequest,
    GenerateAvatarRequest,
    GenerateScriptRequest,
    GenerateScriptResponse,
    GenerationResponse,
)
from app.schemas.ad import AdCreate, AdResponse


# Sample high quality royalty-free placeholder assets for rendered deliverables
SAMPLE_PRODUCT_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80"
]

SAMPLE_VIDEO_URLS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
]


class GenerationService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.ad_repo = AdRepository(db)

    def generate_image(self, user_id: int, req: GenerateImageRequest) -> GenerationResponse:
        cost = 5
        user = self.user_repo.get_by_id(user_id)
        if not user or user.credits < cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient credits. Requires {cost} credits, but you have {user.credits if user else 0}."
            )
        
        self.user_repo.deduct_credits(user, cost)

        image_url = random.choice(SAMPLE_PRODUCT_IMAGES)
        title = f"{req.style} Ad: {req.description[:30]}..." if len(req.description) > 30 else f"{req.style} Ad: {req.description}"

        ad_in = AdCreate(
            title=title,
            type="image",
            media_url=image_url,
            thumbnail_url=image_url,
            prompt=req.description,
            aspect_ratio=req.aspect_ratio,
            style=req.style,
        )

        db_ad = self.ad_repo.create(user_id, ad_in)
        return GenerationResponse(
            success=True,
            ad=AdResponse.from_orm(db_ad),
            credits_remaining=user.credits
        )

    def generate_video(self, user_id: int, req: GenerateVideoRequest) -> GenerationResponse:
        cost = 15
        user = self.user_repo.get_by_id(user_id)
        if not user or user.credits < cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient credits. Requires {cost} credits, but you have {user.credits if user else 0}."
            )
        
        self.user_repo.deduct_credits(user, cost)

        video_url = random.choice(SAMPLE_VIDEO_URLS)
        thumb_url = req.product_image_url or SAMPLE_PRODUCT_IMAGES[0]
        title = f"{req.motion_style} Video: {req.description[:30]}"

        ad_in = AdCreate(
            title=title,
            type="video",
            media_url=video_url,
            thumbnail_url=thumb_url,
            prompt=req.description,
            aspect_ratio=req.aspect_ratio,
            style=req.visual_style,
            duration=req.duration,
        )

        db_ad = self.ad_repo.create(user_id, ad_in)
        return GenerationResponse(
            success=True,
            ad=AdResponse.from_orm(db_ad),
            credits_remaining=user.credits
        )

    def generate_avatar(self, user_id: int, req: GenerateAvatarRequest) -> GenerationResponse:
        cost = 20
        user = self.user_repo.get_by_id(user_id)
        if not user or user.credits < cost:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient credits. Requires {cost} credits, but you have {user.credits if user else 0}."
            )
        
        self.user_repo.deduct_credits(user, cost)

        video_url = random.choice(SAMPLE_VIDEO_URLS)
        thumb_url = req.product_image_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
        title = f"AI Presenter ({req.language}): {req.script[:25]}..."

        ad_in = AdCreate(
            title=title,
            type="avatar",
            media_url=video_url,
            thumbnail_url=thumb_url,
            prompt=req.script,
            aspect_ratio=req.aspect_ratio,
            style=f"Voice: {req.voice}",
            duration=req.duration,
        )

        db_ad = self.ad_repo.create(user_id, ad_in)
        return GenerationResponse(
            success=True,
            ad=AdResponse.from_orm(db_ad),
            credits_remaining=user.credits
        )

    def generate_script(self, req: GenerateScriptRequest) -> GenerateScriptResponse:
        script = (
            f"🚀 Looking to upgrade your routine? Meet {req.product_name}!\n\n"
            f"✨ {req.product_description}\n\n"
            f"Engineered specifically for {req.target_audience}, it delivers unmatched quality and performance. "
            f"Order now and transform your everyday experience today!"
        )
        return GenerateScriptResponse(script=script)
