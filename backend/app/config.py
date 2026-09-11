import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AdGenius AI Backend"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    DATABASE_URL: str = "sqlite:///./adgenius.db"

    SECRET_KEY: str = "super-secret-jwt-key-change-this-in-production-32bytesmin!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ImageKit Integration Settings
    IMAGEKIT_PUBLIC_KEY: str = "public_default_key"
    IMAGEKIT_PRIVATE_KEY: str = "private_default_key"
    IMAGEKIT_URL_ENDPOINT: str = "https://ik.imagekit.io/adgenius"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                return json.loads(v)
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
