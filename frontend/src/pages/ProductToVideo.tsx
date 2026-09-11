import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video as VideoIcon,
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
import { ProductImageUploader, UploadedAsset } from '../components/common/ProductImageUploader';

const motionStyles = [
  'Product Showcase',
  'Cinematic',
  'Slow Motion',
  'Dynamic',
  'Luxury Commercial',
];

const cameraMovements = ['Zoom In', 'Orbit', 'Pan', 'Tracking', 'Static'];

const durations = [
  { label: '5 sec', value: 5 },
  { label: '10 sec', value: 10 },
  { label: '15 sec', value: 15 },
];

export const ProductToVideo: React.FC = () => {
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(
    location.state?.passedImage
      ? {
          id: 0,
          file_id: 'passed_video_img',
          file_name: 'Product Visual Reference',
          url: location.state.passedImage,
        }
      : null
  );

  const [description, setDescription] = useState(location.state?.passedDescription || '');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(5);
  const [motionStyle, setMotionStyle] = useState('Product Showcase');
  const [cameraMovement, setCameraMovement] = useState('Zoom In');
  const [visualStyle, setVisualStyle] = useState('Cinematic');

  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedAd, setGeneratedAd] = useState<Ad | null>(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const stepsList = [
    'Preparing Scene',
    'Generating Motion',
    'Rendering Video',
    'Optimizing',
    'Saving'
  ];

  // Button disabled state until valid product image uploaded, description entered, aspect ratio selected
  const isFormValid = Boolean(uploadedAsset && description.trim().length > 0 && aspectRatio);

  const handleGenerateVideo = async () => {
    if (!isFormValid) {
      setError('Please upload a product image asset, enter a video description, and select an aspect ratio.');
      return;
    }
    setError('');
    setGenerating(true);
    setGenerationStep(1);

    try {
      setTimeout(() => setGenerationStep(2), 1000);
      setTimeout(() => setGenerationStep(3), 2000);
      setTimeout(() => setGenerationStep(4), 3000);

      const res = await apiClient.post<GenerationResponse>('/generate/video', {
        description,
        product_image_url: uploadedAsset?.url,
        aspect_ratio: aspectRatio,
        duration,
        motion_style: motionStyle,
        camera_movement: cameraMovement,
        visual_style: visualStyle,
      });

      setGeneratedAd(res.data.ad);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Video generation failed. Please try again.');
    } finally {
      setGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#272735] pb-6">
        <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
          Product To Video
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Create high-converting 4K cinematic commercial video advertisements
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center space-x-3 text-[#EF4444] text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-6 space-y-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 shadow-xl">
          {/* Reusable ImageKit Cloud Upload Component */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Product Image Asset (ImageKit Cloud)
            </label>
            <ProductImageUploader
              value={uploadedAsset}
              onChange={(asset) => {
                setUploadedAsset(asset);
                if (asset) setError('');
              }}
              onError={(msg) => setError(msg)}
            />
          </div>

          {/* Video Scene Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Video Scene Description & Camera Prompt
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cinematic slow motion zoom of luxury watch with water splash highlights in dark neon studio..."
              className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition"
            />
          </div>

          {/* Duration & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Video Duration
              </label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                      duration === d.value
                        ? 'bg-[#6366F1]/20 border-[#6366F1] text-[#6366F1]'
                        : 'bg-[#12121A] border-[#272735] text-[#94A3B8] hover:bg-[#181824]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Vertical Reel</option>
                <option value="1:1">1:1 Square</option>
              </select>
            </div>
          </div>

          {/* Motion Style & Camera Movement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Motion Style
              </label>
              <select
                value={motionStyle}
                onChange={(e) => setMotionStyle(e.target.value)}
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
              >
                {motionStyles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Camera Movement
              </label>
              <select
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value)}
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
              >
                {cameraMovements.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {!isFormValid && (
            <div className="p-3 bg-[#12121A] border border-[#272735] rounded-xl text-[11px] text-[#64748B] space-y-1">
              <p className="font-semibold text-[#94A3B8]">Requirements to generate video:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={uploadedAsset ? 'text-[#22C55E]' : 'text-[#64748B]'}>
                  Upload product image asset
                </li>
                <li className={description.trim() ? 'text-[#22C55E]' : 'text-[#64748B]'}>
                  Enter video scene description
                </li>
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={!isFormValid || generating}
            className="w-full bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#EC4899] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold py-3.5 rounded-xl shadow-lg shadow-[#6366F1]/25 transition flex items-center justify-center space-x-2"
          >
            <VideoIcon className="w-4 h-4" />
            <span>{generating ? 'Rendering Motion Video...' : '🎬 Generate Video'}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-2">
              Cost: 15 Credits (Balance: {user?.credits ?? 0})
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: Video Player & Progress Canvas */}
        <div className="lg:col-span-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 flex flex-col justify-between min-h-[500px] shadow-xl">
          <div className="flex-1 flex flex-col justify-center items-center">
            {generating ? (
              <div className="text-center space-y-6 max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#6366F1]/20 border border-[#6366F1]/40 flex items-center justify-center text-[#6366F1] animate-pulse">
                  <Play className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">
                    AI Video Motion Synthesis
                  </h3>
                  <p className="text-xs text-[#6366F1] font-semibold">
                    {stepsList[generationStep] || 'Rendering Video...'}
                  </p>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-[#272735]">
                  <motion.div
                    className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] h-full"
                    initial={{ width: '5%' }}
                    animate={{ width: `${(generationStep + 1) * 20}%` }}
                    transition={{ duration: 0.8 }}
                  />
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
                  <span>Motion: <strong className="text-[#F8FAFC]">{motionStyle}</strong></span>
                  <span>Duration: <strong className="text-[#F8FAFC]">{generatedAd.duration}s</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 p-8 border border-dashed border-[#272735] rounded-2xl">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#12121A] text-[#64748B] flex items-center justify-center">
                  <VideoIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  Cinematic video canvas ready.
                </p>
                <p className="text-xs text-[#64748B] max-w-xs">
                  Upload your product photo on the left and set motion parameters to render a video ad.
                </p>
              </div>
            )}
          </div>

          {generatedAd && !generating && (
            <div className="pt-6 border-t border-[#272735] space-y-3">
              {savedSuccess && (
                <div className="p-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Video ad saved to My Ads library!</span>
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
                  onClick={handleGenerateVideo}
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={() => setSavedSuccess(true)}
                  className="flex items-center justify-center space-x-1.5 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white py-2.5 rounded-xl text-xs font-medium transition"
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
