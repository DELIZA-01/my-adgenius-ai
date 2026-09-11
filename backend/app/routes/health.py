from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
def get_health():
    """
    Health Check Endpoint.
    Returns status ok and app information.
    """
    return HealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version="1.0.0"
    )
