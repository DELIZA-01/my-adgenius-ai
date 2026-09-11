from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AdCreate(BaseModel):
    title: str
    type: str  # 'image', 'video', 'avatar'
    media_url: str
    thumbnail_url: Optional[str] = None
    prompt: Optional[str] = None
    aspect_ratio: Optional[str] = None
    style: Optional[str] = None
    duration: Optional[int] = None


class AdResponse(BaseModel):
    id: int
    user_id: int
    title: str
    type: str
    media_url: str
    thumbnail_url: Optional[str] = None
    prompt: Optional[str] = None
    aspect_ratio: Optional[str] = None
    style: Optional[str] = None
    duration: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
