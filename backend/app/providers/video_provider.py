from abc import abstractmethod
from typing import Any, Dict
from app.providers.base_provider import BaseAIProvider


class VideoGenerationProvider(BaseAIProvider):
    @abstractmethod
    def generate_video(self, prompt: str, duration_seconds: int = 5) -> Dict[str, Any]:
        """Contract for AI Video generation (e.g. Runway / Pika / Sora)"""
        pass
