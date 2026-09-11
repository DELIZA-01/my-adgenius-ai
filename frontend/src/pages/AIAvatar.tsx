import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Upload,
  Sparkles,
  Play,
  Download,
  RotateCcw,
  FolderPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { GenerationResponse, Ad } from '../types';

const avatars = [
  { id: 'sophia', name: 'Sophia', role: 'E-commerce Creator', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'alex', name: 'Alex', role: 'Tech Presenter', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'marcus', name: 'Marcus', role: 'Fitness & Lifestyle', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'elena', name: 'Elena', role: 'Beauty & Skincare', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
];

const voices = ['Professional Female', 'Energetic Male', 'Warm Conversational', 'Corporate Executive'];
const languages = ['English', 'Hindi', 'Hinglish'];

export const AIAvatar: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [selectedAvatar, setSelectedAvatar] = useState('sophia');
  const [productImg, setProductImg] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Professional Female');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(15);

  const [generatingScript, setGeneratingScript] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<Ad | null>(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProductImg(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerateScript = async () => {
    if (!productName.trim()) {
      setError('Please enter your product name to generate a script.');
      return;
    }
    setError('');
    setGeneratingScript(true);
    try {
      const res = await apiClient.post('/generate/script', {
        product_name: productName,
        product_description: script || 'High performance quality product',
      });
      setScript(res.data.script);
    } catch (err: any) {
      setError('Failed to generate script.');
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!script.trim()) {
      setError('Please enter or generate a video script.');
      return;
    }
    setError('');
    setGeneratingVideo(true);

    try {
      const res = await apiClient.post<GenerationResponse>('/generate/avatar', {
        avatar_id: selectedAvatar,
        script,
        voice: selectedVoice,
        language: selectedLanguage,
        aspect_ratio: aspectRatio,
        duration,
        product_image_url: productImg,
      });

      setGeneratedAd(res.data.ad);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Avatar video generation failed.');
    } finally {
      setGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#272735] pb-6">
        <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
          AI Avatar Presenter Workspace
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Create UGC presenter video ads with real AI spokespersons in English, Hindi & Hinglish
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center space-x-3 text-[#EF4444] text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Avatar & Script Selection */}
        <div className="lg:col-span-6 space-y-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 shadow-xl">
          {/* Avatar Selection Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Select AI Presenter Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {avatars.map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition text-center space-y-1 ${
                    selectedAvatar === av.id
                      ? 'bg-[#EC4899]/15 border-[#EC4899] ring-1 ring-[#EC4899]'
                      : 'bg-[#12121A] border-[#272735] hover:bg-[#181824]'
                  }`}
                >
                  <img src={av.img} alt={av.name} className="w-full h-24 rounded-lg object-cover" />
                  <p className="text-xs font-bold text-[#F8FAFC]">{av.name}</p>
                  <p className="text-[9px] text-[#64748B] truncate">{av.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info & Script Generation */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. UltraGlow Serum"
                  className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-2.5 text-xs text-[#F8FAFC] focus:border-[#EC4899] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Product Photo (Optional)
                </label>
                <label className="block bg-[#12121A] border border-[#272735] hover:bg-[#181824] rounded-xl p-2 text-center text-xs text-[#A855F7] cursor-pointer truncate">
                  {productImg ? 'Photo Loaded ✓' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Ad Script (UGC Dialogue)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateScript}
                  disabled={generatingScript}
                  className="text-xs text-[#EC4899] hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{generatingScript ? 'Writing...' : '✨ Generate AI Script'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write your video script or click Generate AI Script..."
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#EC4899] transition"
              />
            </div>
          </div>

          {/* Voice & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Voice Accent & Tone
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#EC4899]"
              >
                {voices.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Language
              </label>
              <div className="flex gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-medium border transition ${
                      selectedLanguage === lang
                        ? 'bg-[#EC4899]/20 border-[#EC4899] text-[#EC4899]'
                        : 'bg-[#12121A] border-[#272735] text-[#94A3B8] hover:bg-[#181824]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAvatar}
            disabled={generatingVideo}
            className="w-full bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#7C3AED] hover:opacity-95 disabled:opacity-50 text-white font-heading font-bold py-3.5 rounded-xl shadow-lg shadow-[#EC4899]/25 transition flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{generatingVideo ? 'Synthesizing Avatar Video...' : '🎥 Generate Avatar Ad'}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-2">
              Cost: 20 Credits (Balance: {user?.credits ?? 0})
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: Video Canvas */}
        <div className="lg:col-span-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 flex flex-col justify-between min-h-[500px] shadow-xl">
          <div className="flex-1 flex flex-col justify-center items-center">
            {generatingVideo ? (
              <div className="text-center space-y-6 max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EC4899]/20 border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] animate-pulse">
                  <Play className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">
                    AI Avatar Lip-Sync & Voice Render
                  </h3>
                  <p className="text-xs text-[#EC4899]">
                    Rendering spokesperson animation in {selectedLanguage}...
                  </p>
                </div>
              </div>
            ) : generatedAd ? (
              <div className="w-full space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#272735] bg-black max-h-[420px] flex items-center justify-center">
                  <video
                    src={generatedAd.media_url}
                    controls
                    autoPlay
                    loop
                    className="max-h-[420px] w-full rounded-2xl object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Avatar: <strong className="text-[#F8FAFC]">{selectedAvatar.toUpperCase()}</strong></span>
                  <span>Language: <strong className="text-[#F8FAFC]">{selectedLanguage}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 p-8 border border-dashed border-[#272735] rounded-2xl">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#12121A] text-[#64748B] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  AI Presenter video preview.
                </p>
                <p className="text-xs text-[#64748B] max-w-xs">
                  Choose your avatar spokesperson and script to generate your UGC presenter ad.
                </p>
              </div>
            )}
          </div>

          {generatedAd && !generatingVideo && (
            <div className="pt-6 border-t border-[#272735] space-y-3">
              {savedSuccess && (
                <div className="p-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Avatar ad saved to My Ads library!</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <a
                  href={generatedAd.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </a>

                <button
                  onClick={handleGenerateAvatar}
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={() => setSavedSuccess(true)}
                  className="flex items-center justify-center space-x-1.5 bg-[#EC4899] hover:bg-[#EC4899]/90 text-white py-2.5 rounded-xl text-xs font-medium transition"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Save to My Ads</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
