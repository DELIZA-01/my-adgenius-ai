from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseAIProvider(ABC):
    """
    Abstract Base Class for AI generation providers.
    Provides standard interface contracts for real AI integrations.
    """
    
    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> None:
        """Initialize provider credentials and API client configurations."""
        pass
