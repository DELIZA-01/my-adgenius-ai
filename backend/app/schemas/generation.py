from typing import Optional
from pydantic import BaseModel
from app.schemas.ad import AdResponse


class GenerateImageRequest(BaseModel):
    description: str
    aspect_ratio: str = "1:1"
    style: str = "Studio"
    negative_prompt: Optional[str] = None
    product_image_url: Optional[str] = None


class GenerateVideoRequest(BaseModel):
    description: str
    product_image_url: Optional[str] = None
    aspect_ratio: str = "16:9"
    duration: int = 5
    motion_style: str = "Product Showcase"
    camera_movement: str = "Zoom In"
    visual_style: str = "Cinematic"


class GenerateAvatarRequest(BaseModel):
    avatar_id: str
    script: str
    voice: str = "Professional Male"
    language: str = "English"
    aspect_ratio: str = "9:16"
    duration: int = 15
    product_image_url: Optional[str] = None


class GenerateScriptRequest(BaseModel):
    product_name: str
    product_description: str
    target_audience: Optional[str] = "General Audience"
    tone: Optional[str] = "Engaging & High-Converting"


class GenerateScriptResponse(BaseModel):
    script: str


class GenerationResponse(BaseModel):
    success: bool
    ad: AdResponse
    credits_remaining: int
