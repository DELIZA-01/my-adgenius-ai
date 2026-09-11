import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FolderKanban,
  Image,
  Video,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  Zap,
  Award
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Stats } from '../types';

const creativeCards = [
  {
    title: 'AI Product Image',
    desc: 'Generate studio-quality promotional product photos & social graphics.',
    path: '/product-to-image',
    icon: Image,
    cta: 'Create Image Ad',
    gradient: 'from-[#7C3AED] to-[#A855F7]',
    previewImg: 'https://static-lib.s3.us-east-1.amazonaws.com/cms/ai_product_launch_video_generator5_8057c3160c.webp'
    // 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AI Product Video',
    desc: 'Transform product concepts into 4K cinematic motion video ads.',
    path: '/product-to-video',
    icon: Video,
    cta: 'Generate Video Ad',
    gradient: 'from-[#6366F1] to-[#7C3AED]',
    previewImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4AN2fOd5K_UbGHAXFX5LAzUJlHq9bWm-xUd7osUjRWEW0fNNCArTXhu4&s=10'
    // 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQt0OYd6mCSwMH0A6X0QHLNwbNRYbp61sXx3Aor6_nzjH7n_N5immbIMWP&s=10'
    // 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AI Avatar Ad',
    desc: 'Generate high-converting UGC presenter & spokesperson video ads.',
    path: '/ai-avatar',
    icon: UserCheck,
    cta: 'Build Avatar Ad',
    gradient: 'from-[#EC4899] to-[#A855F7]',
    previewImg: 'https://images.insmind.com/market-operations/market/side/756c365cfb044dd38df66064dfa0740f/1782892786289.jpg'
    // 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ openCreateModal?: () => void }>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Stats>('/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      {/* Premium Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#290235] to-[#080808] border border-[#272735] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
        {/* Subtle animated gradient glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#7C3AED]/15 border border-[#7C3AED]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A855F7]">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen AI Advertising Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
              Turn Your Products Into <br />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] bg-clip-text text-transparent">
                Scroll-Stopping Ads.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl leading-relaxed">
              Create stunning product images, cinematic videos, and AI avatar advertisements in minutes.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => outletContext?.openCreateModal?.()}
                className="flex items-center space-x-2.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-heading font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-[#7C3AED]/25 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5" />
                <span>✨ Create New Ad</span>
              </button>

              <button
                onClick={() => navigate('/my-ads')}
                className="flex items-center space-x-2 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] font-medium px-6 py-3.5 rounded-xl border border-[#272735] transition"
              >
                <FolderKanban className="w-4 h-4 text-[#94A3B8]" />
                <span>Explore My Ads</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Display with Floating Glass Elements */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-[#272735] shadow-2xl group">
              <img
                src="https://www.visionstory.ai/imgs/tool/ai-video-generator/product-demos.webp"
                // "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="AI Product Visual"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent opacity-80" />

              {/* Floating Glass Card Overlay 1 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 bg-[#0D0D12]/80 backdrop-blur-md border border-[#272735] p-3 rounded-xl flex items-center space-x-3 shadow-xl"
              >
                <div className="p-2 rounded-lg bg-[#7C3AED]/20 text-[#A855F7]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F8FAFC]">AI Render Complete</p>
                  <p className="text-[9px] text-[#22C55E]">High Resolution 4K</p>
                </div>
              </motion.div>

              {/* Floating Glass Card Overlay 2 */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-4 right-4 bg-[#0D0D12]/80 backdrop-blur-md border border-[#272735] p-3 rounded-xl flex items-center space-x-3 shadow-xl"
              >
                <div className="p-2 rounded-lg bg-[#EC4899]/20 text-[#EC4899]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F8FAFC]">Conversion Boost</p>
                  <p className="text-[9px] text-[#A855F7]">+340% Click-Through</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">
          AI Generation Engines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creativeCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(card.path)}
                className="bg-[#12121A] hover:bg-[#181824] border border-[#272735] hover:border-[#7C3AED]/50 rounded-16 p-5 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-4">
                  {/* Card Visual Preview */}
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img
                      src={card.previewImg}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-transparent opacity-90" />
                    <div className={`absolute top-3 left-3 p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#F8FAFC] group-hover:text-[#A855F7] transition">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* CTA Footer */}
                <div className="pt-4 mt-4 border-t border-[#272735] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A855F7] group-hover:underline">
                    {card.cta}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[#7C3AED]/10 text-[#A855F7] group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Real Statistics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">
            Account Performance & Stats
          </h2>
          <span className="text-xs text-[#64748B]">Real-time Database Metrics</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12121A] border border-[#272735] p-5 rounded-16 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">Images Created</span>
              <div className="p-2 rounded-lg bg-[#7C3AED]/15 text-[#A855F7]">
                <Image className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F8FAFC]">
              {loading ? '...' : stats?.images_created ?? 0}
            </p>
          </div>

          <div className="bg-[#12121A] border border-[#272735] p-5 rounded-16 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">Videos Created</span>
              <div className="p-2 rounded-lg bg-[#6366F1]/15 text-[#6366F1]">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F8FAFC]">
              {loading ? '...' : stats?.videos_created ?? 0}
            </p>
          </div>

          <div className="bg-[#12121A] border border-[#272735] p-5 rounded-16 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">Avatar Ads</span>
              <div className="p-2 rounded-lg bg-[#EC4899]/15 text-[#EC4899]">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F8FAFC]">
              {loading ? '...' : stats?.avatar_ads ?? 0}
            </p>
          </div>

          <div className="bg-[#12121A] border border-[#272735] p-5 rounded-16 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">Total Ads Library</span>
              <div className="p-2 rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F8FAFC]">
              {loading ? '...' : stats?.total_ads ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
