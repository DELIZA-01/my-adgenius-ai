from fastapi import APIRouter
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.ads import router as ads_router
from app.routes.stats import router as stats_router
from app.routes.generation import router as generation_router
from app.routes.images import router as images_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(ads_router)
api_router.include_router(stats_router)
api_router.include_router(generation_router)
api_router.include_router(images_router)
