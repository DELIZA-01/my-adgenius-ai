from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.imagekit_service import ImageKitService
from app.repositories.product_asset_repository import ProductAssetRepository
from app.schemas.product_asset import (
    ImageKitAuthResponse,
    ProductAssetResponse,
    ProductAssetCreate,
    AssetDeleteResponse,
)

router = APIRouter(prefix="/images", tags=["Cloud Upload"])

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit


@router.get("/upload-auth", response_model=ImageKitAuthResponse)
def get_upload_auth(current_user: User = Depends(get_current_user)):
    """
    Returns ImageKit security authentication signature and token for frontend direct uploads.
    Private key is never exposed.
    """
    ik_service = ImageKitService()
    auth_data = ik_service.generate_upload_authentication()
    return ImageKitAuthResponse(**auth_data)


@router.post("/upload", response_model=ProductAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Secure backend proxy upload to ImageKit cloud.
    Validates file format, corruption, file size, and stores metadata in DB.
    """
    # 1. Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file.content_type}'. Only JPG, JPEG, PNG, and WEBP images are allowed."
        )

    # 2. Read content & validate file size / corruption
    contents = await file.read()
    file_size = len(contents)
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty or corrupted."
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        max_mb = MAX_FILE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {max_mb}MB."
        )

    # 3. Upload to ImageKit cloud
    ik_service = ImageKitService()
    upload_result = ik_service.upload_image(contents, file.filename or "product.jpg")

    # 4. Save metadata to DB
    asset_repo = ProductAssetRepository(db)
    asset_in = ProductAssetCreate(
        file_id=upload_result["file_id"],
        file_name=upload_result["file_name"],
        file_path=upload_result["file_path"],
        url=upload_result["url"],
        thumbnail_url=upload_result["thumbnail_url"],
        file_size=file_size,
        mime_type=file.content_type,
    )
    db_asset = asset_repo.create(current_user.id, asset_in)
    return db_asset


@router.delete("/{file_id:path}", response_model=AssetDeleteResponse)
def delete_image(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes asset from ImageKit cloud & DB metadata.
    Enforces user authorization check (user A cannot delete user B's asset).
    """
    asset_repo = ProductAssetRepository(db)
    asset = asset_repo.get_by_file_id(file_id, current_user.id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found or you do not have permission to delete this file."
        )

    # Delete from Cloud
    ik_service = ImageKitService()
    ik_service.delete_image(file_id)

    # Delete from DB
    asset_repo.delete(file_id, current_user.id)

    return AssetDeleteResponse(
        success=True,
        message=f"Asset {file_id} deleted successfully."
    )
