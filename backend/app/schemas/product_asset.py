from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ImageKitAuthResponse(BaseModel):
    token: str
    expire: int
    signature: str
    public_key: str
    url_endpoint: str


class ProductAssetCreate(BaseModel):
    file_id: str
    file_name: str
    file_path: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None


class ProductAssetResponse(BaseModel):
    id: int
    user_id: int
    file_id: str
    file_name: str
    file_path: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AssetDeleteResponse(BaseModel):
    success: bool
    message: str
