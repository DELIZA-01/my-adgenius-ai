from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.router import api_router
from app.database.session import engine
from app.database.base import Base
from app.utils.logger import logger

# Create tables in DB (for dev/sqlite)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for AdGenius AI platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.on_event("startup")
def startup_event():
    logger.info(f"Starting up {settings.APP_NAME} on {settings.HOST}:{settings.PORT}")


@app.on_event("shutdown")
def shutdown_event():
    logger.info(f"Shutting down {settings.APP_NAME}")
