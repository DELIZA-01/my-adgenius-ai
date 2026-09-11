import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Search,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  UserCheck,
  X,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Ad } from '../types';

export const MyAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'avatar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [previewAd, setPreviewAd] = useState<Ad | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const typeParam = activeTab === 'all' ? undefined : activeTab;
      const res = await apiClient.get<Ad[]>('/ads', {
        params: {
          type: typeParam,
          search: searchQuery || undefined,
        },
      });
      let fetched = res.data;
      if (sortBy === 'newest') {
        fetched = fetched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else {
        fetched = fetched.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      setAds(fetched);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, sortBy]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this ad asset from your library?')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((item) => item.id !== id));
      if (previewAd?.id === id) setPreviewAd(null);
    } catch (err) {
      alert('Failed to delete ad asset.');
    } finally {
      setDeletingId(null);
    }
  };

  const getBadgeIcon = (type: string) => {
    if (type === 'image') return <ImageIcon className="w-3 h-3 text-[#A855F7]" />;
    if (type === 'video') return <VideoIcon className="w-3 h-3 text-[#6366F1]" />;
    return <UserCheck className="w-3 h-3 text-[#EC4899]" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#272735] pb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
            My Ads Library
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Your complete AI advertising creative repository
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 bg-[#12121A] border border-[#272735] p-1 rounded-xl">
          {(['all', 'image', 'video', 'avatar'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {tab === 'all' ? 'All Ads' : tab === 'image' ? 'Images' : tab === 'video' ? 'Videos' : 'Avatars'}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar: Search, Sort, View Mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D12] border border-[#272735] p-4 rounded-16">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ads by title or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12121A] border border-[#272735] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-[#12121A] border border-[#272735] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>

          <div className="flex items-center space-x-1 bg-[#12121A] border border-[#272735] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid' ? 'bg-[#272735] text-[#F8FAFC]' : 'text-[#64748B]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'list' ? 'bg-[#272735] text-[#F8FAFC]' : 'text-[#64748B]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ads Gallery */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <Sparkles className="w-8 h-8 mx-auto text-[#7C3AED] animate-spin" />
          <p className="text-xs text-[#94A3B8]">Loading your creative assets from database...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-[#0D0D12] border border-[#272735] p-12 rounded-16 text-center space-y-3 max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-xl bg-[#12121A] text-[#64748B] mx-auto flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">No Ad Creatives Found</h3>
          <p className="text-xs text-[#94A3B8]">
            You haven't generated any ads matching this filter yet. Create your first AI ad using Product To Image, Video, or AI Avatar!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121A] hover:bg-[#181824] border border-[#272735] hover:border-[#7C3AED]/40 rounded-16 overflow-hidden transition group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                {/* Thumbnail Preview */}
                <div className="h-48 bg-black relative overflow-hidden flex items-center justify-center">
                  {ad.type === 'image' ? (
                    <img src={ad.media_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <video src={ad.media_url} className="w-full h-full object-cover" />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 bg-[#0D0D12]/90 backdrop-blur border border-[#272735] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#F8FAFC] flex items-center space-x-1.5 uppercase">
                    {getBadgeIcon(ad.type)}
                    <span>{ad.type}</span>
                  </div>

                  {/* Hover Overlay Menu */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setPreviewAd(ad)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={ad.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      disabled={deletingId === ad.id}
                      className="p-2.5 bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white rounded-full backdrop-blur transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-1">
                  <h4 className="font-heading font-bold text-sm text-[#F8FAFC] truncate">
                    {ad.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">
                    {ad.prompt || 'AI generated creative'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-[10px] text-[#64748B] border-t border-[#272735]">
                <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                <span className="text-[#22C55E] capitalize font-medium">{ad.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-[#12121A] border border-[#272735] hover:border-[#7C3AED]/40 p-4 rounded-xl flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src={ad.thumbnail_url || ad.media_url} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-heading font-bold text-sm text-[#F8FAFC]">{ad.title}</h4>
                    <span className="text-[9px] bg-[#181824] border border-[#272735] px-2 py-0.5 rounded-full text-[#A855F7] uppercase font-bold">
                      {ad.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{ad.prompt}</p>
                  <p className="text-[10px] text-[#64748B] mt-1">{new Date(ad.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewAd(ad)}
                  className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#181824] rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={ad.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#181824] rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewAd(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#0D0D12] border border-[#272735] rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#272735] pb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">{previewAd.title}</h3>
                  <p className="text-xs text-[#94A3B8]">Created on {new Date(previewAd.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setPreviewAd(null)}
                  className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#181824]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[500px] overflow-hidden rounded-xl bg-black border border-[#272735] flex items-center justify-center">
                {previewAd.type === 'image' ? (
                  <img src={previewAd.media_url} alt={previewAd.title} className="max-h-[480px] w-auto object-contain" />
                ) : (
                  <video src={previewAd.media_url} controls autoPlay className="max-h-[480px] w-full object-contain" />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[#94A3B8] max-w-md truncate">Prompt: {previewAd.prompt}</p>
                <a
                  href={previewAd.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
