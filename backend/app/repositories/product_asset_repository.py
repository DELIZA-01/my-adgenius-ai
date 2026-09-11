from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.product_asset import ProductAsset
from app.schemas.product_asset import ProductAssetCreate


class ProductAssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_file_id(self, file_id: str, user_id: int) -> Optional[ProductAsset]:
        return self.db.query(ProductAsset).filter(
            ProductAsset.file_id == file_id,
            ProductAsset.user_id == user_id
        ).first()

    def create(self, user_id: int, asset_in: ProductAssetCreate) -> ProductAsset:
        existing = self.db.query(ProductAsset).filter(
            ProductAsset.file_id == asset_in.file_id,
            ProductAsset.user_id == user_id
        ).first()
        if existing:
            return existing

        db_asset = ProductAsset(
            user_id=user_id,
            file_id=asset_in.file_id,
            file_name=asset_in.file_name,
            file_path=asset_in.file_path,
            url=asset_in.url,
            thumbnail_url=asset_in.thumbnail_url or asset_in.url,
            file_size=asset_in.file_size,
            mime_type=asset_in.mime_type,
        )
        self.db.add(db_asset)
        self.db.commit()
        self.db.refresh(db_asset)
        return db_asset

    def delete(self, file_id: str, user_id: int) -> bool:
        asset = self.get_by_file_id(file_id, user_id)
        if not asset:
            return False
        self.db.delete(asset)
        self.db.commit()
        return True

    def get_user_assets(self, user_id: int) -> List[ProductAsset]:
        return self.db.query(ProductAsset).filter(ProductAsset.user_id == user_id).order_by(ProductAsset.created_at.desc()).all()
