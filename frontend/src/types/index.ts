export interface User {
  id: number;
  email: string;
  full_name?: string;
  credits: number;
  avatar_url?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Ad {
  id: number;
  user_id: number;
  title: string;
  type: 'image' | 'video' | 'avatar';
  media_url: string;
  thumbnail_url?: string;
  prompt?: string;
  aspect_ratio?: string;
  style?: string;
  duration?: number;
  status: string;
  created_at: string;
}

export interface Stats {
  images_created: number;
  videos_created: number;
  avatar_ads: number;
  total_ads: number;
  credits_remaining: number;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
  timestamp: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface GenerationResponse {
  success: boolean;
  ad: Ad;
  credits_remaining: number;
}
