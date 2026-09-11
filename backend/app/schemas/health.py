from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="ok", example="ok")
    app_name: str = Field(..., example="AdGenius AI")
    version: str = Field(default="1.0.0", example="1.0.0")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
