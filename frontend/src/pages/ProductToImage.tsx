import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Download,
  RotateCcw,
  FolderPlus,
  Video,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { GenerationResponse, Ad } from '../types';
import { ProductImageUploader, UploadedAsset } from '../components/common/ProductImageUploader';

const stylesList = [
  'Luxury',
  'Cinematic',
  'Minimal',
  'Studio',
  'Lifestyle',
  'E-commerce',
  'Social Media',
];

const aspectRatios = [
  { label: '1:1 Square', value: '1:1' },
  { label: '16:9 Landscape', value: '16:9' },
  { label: '9:16 Story/Reel', value: '9:16' },
];

export const ProductToImage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(
    location.state?.passedImage
      ? {
          id: 0,
          file_id: 'passed_img',
          file_name: 'Product Visual',
          url: location.state.passedImage,
        }
      : null
  );

  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('Studio');
  const [negativePrompt, setNegativePrompt] = useState('');

  const [generating, setGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [generatedAd, setGeneratedAd] = useState<Ad | null>(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const steps = ['Upload', 'Describe', 'Generate', 'Export'];

  // Button is enabled ONLY when image uploaded, description provided, and aspect ratio selected
  const isFormValid = Boolean(uploadedAsset && description.trim().length > 0 && aspectRatio);

  const handleGenerate = async () => {
    if (!isFormValid) {
      setError('Please upload a product image, enter a description, and select an aspect ratio.');
      return;
    }
    setError('');
    setGenerating(true);
    setProgressStep(1);

    try {
      setTimeout(() => setProgressStep(2), 1000);
      setTimeout(() => setProgressStep(3), 2000);

      const res = await apiClient.post<GenerationResponse>('/generate/image', {
        description,
        aspect_ratio: aspectRatio,
        style: selectedStyle,
        negative_prompt: negativePrompt,
        product_image_url: uploadedAsset?.url,
      });

      setGeneratedAd(res.data.ad);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
      setProgressStep(0);
    }
  };

  const handleCreateVideo = () => {
    if (generatedAd) {
      navigate('/product-to-video', {
        state: { passedImage: generatedAd.media_url, passedDescription: description }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Steps Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#272735] pb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
            Product To Image
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Transform product photos into high-converting AI studio images
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center space-x-2 sm:space-x-4 bg-[#12121A] border border-[#272735] px-4 py-2 rounded-xl">
          {steps.map((step, index) => {
            const currentActiveIndex = generatedAd ? 3 : generating ? 2 : description && uploadedAsset ? 1 : 0;
            const isCompleted = index <= currentActiveIndex;
            return (
              <React.Fragment key={step}>
                <div className="flex items-center space-x-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-[#181824] text-[#64748B]'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCompleted ? 'text-[#F8FAFC]' : 'text-[#64748B]'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <span className="text-[#272735] text-xs">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center space-x-3 text-[#EF4444] text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls & Form */}
        <div className="lg:col-span-6 space-y-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 shadow-xl">
          {/* Real ImageKit Cloud Upload Component */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Upload Product Image (ImageKit Cloud)
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

          {/* Product Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Product Description & Prompt
              </label>
              <span className="text-[10px] text-[#64748B]">{description.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Wireless luxury noise-canceling headphones resting on a minimalist dark marble table with soft studio lighting..."
              className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] transition"
            />
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`py-2 rounded-xl text-xs font-medium border transition ${
                    aspectRatio === ratio.value
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#A855F7]'
                      : 'bg-[#12121A] border-[#272735] text-[#94A3B8] hover:bg-[#181824]'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Visual Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stylesList.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition text-center ${
                    selectedStyle === style
                      ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#A855F7]'
                      : 'bg-[#12121A] border-[#272735] text-[#94A3B8] hover:bg-[#181824]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Negative Prompt (Optional)
            </label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. blurry, low quality, distorted text, oversaturated"
              className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] transition"
            />
          </div>

          {/* Form Validation Feedback Notice */}
          {!isFormValid && (
            <div className="p-3 bg-[#12121A] border border-[#272735] rounded-xl text-[11px] text-[#64748B] space-y-1">
              <p className="font-semibold text-[#94A3B8]">Requirements to generate:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={uploadedAsset ? 'text-[#22C55E]' : 'text-[#64748B]'}>
                  Upload product image
                </li>
                <li className={description.trim() ? 'text-[#22C55E]' : 'text-[#64748B]'}>
                  Enter product description
                </li>
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || generating}
            className="w-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold py-3.5 rounded-xl shadow-lg shadow-[#7C3AED]/25 transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generating ? 'Generating Product Ad...' : '✨ Generate Product Ad'}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-2">
              Cost: 5 Credits (Balance: {user?.credits ?? 0})
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: Interactive Preview Canvas */}
        <div className="lg:col-span-6 bg-[#0D0D12] border border-[#272735] p-6 rounded-16 flex flex-col justify-between min-h-[500px] shadow-xl">
          <div className="flex-1 flex flex-col justify-center items-center">
            {generating ? (
              <div className="text-center space-y-6 max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A855F7] animate-pulse">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">
                    AI Synthesis in Progress
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {progressStep === 1 && '1/3 Analyzing Product Image & Lighting...'}
                    {progressStep === 2 && '2/3 Synthesizing Studio Background & Highlights...'}
                    {progressStep === 3 && '3/3 Rendering High Resolution Output...'}
                  </p>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-[#272735]">
                  <motion.div
                    className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] h-full"
                    initial={{ width: '10%' }}
                    animate={{ width: `${progressStep * 33}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ) : generatedAd ? (
              <div className="w-full space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#272735] max-h-[420px] bg-black flex items-center justify-center">
                  <img
                    src={generatedAd.media_url}
                    alt="Generated Product Ad"
                    className="max-h-[420px] w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Style: <strong className="text-[#F8FAFC]">{generatedAd.style}</strong></span>
                  <span>Aspect: <strong className="text-[#F8FAFC]">{generatedAd.aspect_ratio}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 p-8 border border-dashed border-[#272735] rounded-2xl">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#12121A] text-[#64748B] flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  Your generated advertisement will appear here.
                </p>
                <p className="text-xs text-[#64748B] max-w-xs">
                  Upload your product photo on the left and click Generate to build your creative asset.
                </p>
              </div>
            )}
          </div>

          {generatedAd && !generating && (
            <div className="pt-6 border-t border-[#272735] space-y-3">
              {savedSuccess && (
                <div className="p-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ad saved to your My Ads library successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={generatedAd.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={handleGenerate}
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={() => setSavedSuccess(true)}
                  className="flex items-center justify-center space-x-1.5 bg-[#181824] hover:bg-[#272735] text-[#A855F7] py-2.5 rounded-xl border border-[#272735] text-xs font-medium transition"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </button>

                <button
                  onClick={handleCreateVideo}
                  className="flex items-center justify-center space-x-1.5 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white py-2.5 rounded-xl text-xs font-medium transition shadow-md"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Create Video</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
