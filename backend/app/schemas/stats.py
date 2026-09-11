from pydantic import BaseModel


class StatsResponse(BaseModel):
    images_created: int
    videos_created: int
    avatar_ads: int
    total_ads: int
    credits_remaining: int
