from abc import abstractmethod
from typing import Any, Dict
from app.providers.base_provider import BaseAIProvider


class ImageGenerationProvider(BaseAIProvider):
    @abstractmethod
    def generate_image(self, prompt: str, aspect_ratio: str = "1:1") -> Dict[str, Any]:
        """Contract for AI Image generation (e.g. Midjourney / Stable Diffusion / DALL-E)"""
        pass
