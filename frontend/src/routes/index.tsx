import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Dashboard } from '../pages/Dashboard';
import { CreativeStudio } from '../pages/CreativeStudio';
import { ProductToImage } from '../pages/ProductToImage';
import { ProductToVideo } from '../pages/ProductToVideo';
import { AIAvatar } from '../pages/AIAvatar';
import { MyAds } from '../pages/MyAds';
import { Pricing } from '../pages/Pricing';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creative-studio" element={<CreativeStudio />} />
        <Route path="/product-to-image" element={<ProductToImage />} />
        <Route path="/product-to-video" element={<ProductToVideo />} />
        <Route path="/ai-avatar" element={<AIAvatar />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
