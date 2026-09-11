import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, RefreshCw, FileImage, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../api/client';

export interface UploadedAsset {
  id: number;
  file_id: str;
  file_name: str;
  url: str;
  thumbnail_url?: str;
  file_size?: number;
  mime_type?: str;
}

interface ProductImageUploaderProps {
  value: UploadedAsset | null;
  onChange: (asset: UploadedAsset | null) => void;
  onError?: (msg: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  value,
  onChange,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndUpload = async (file: File) => {
    setLocalError(null);

    // 1. Format Validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      const errStr = `Invalid file format '${file.name}'. Only PNG, JPG, JPEG, and WEBP images are supported.`;
      setLocalError(errStr);
      if (onError) onError(errStr);
      return;
    }

    // 2. Size Validation
    if (file.size > MAX_SIZE_BYTES) {
      const errStr = `File size (${formatFileSize(file.size)}) exceeds maximum limit of 10MB.`;
      setLocalError(errStr);
      if (onError) onError(errStr);
      return;
    }

    // 3. Perform Backend ImageKit Cloud Upload
    setUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<UploadedAsset>('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      setUploadProgress(100);
      onChange(response.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Cloud upload failed. Please try again.';
      setLocalError(errMsg);
      if (onError) onError(errMsg);
    } fontinally: {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      await apiClient.delete(`/images/${encodeURIComponent(value.file_id)}`);
    } catch (err) {
      console.warn('Failed to delete remote ImageKit asset', err);
    } finally {
      onChange(null);
      setLocalError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Box Container */}
      {value ? (
        /* AFTER UPLOAD SUCCESS STATE */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12121A] border border-[#272735] rounded-xl p-4 space-y-3 relative shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#22C55E]">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Product Uploaded to ImageKit</span>
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">{formatFileSize(value.file_size)}</span>
          </div>

          <div className="flex items-center space-x-4 bg-[#0D0D12] p-3 rounded-lg border border-[#272735]">
            <img
              src={value.thumbnail_url || value.url}
              alt={value.file_name}
              className="w-20 h-20 rounded-lg object-cover bg-black border border-[#272735]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#F8FAFC] truncate">{value.file_name}</p>
              <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">{value.url}</p>
              <span className="inline-block mt-1 text-[9px] bg-[#7C3AED]/20 text-[#A855F7] px-2 py-0.5 rounded border border-[#7C3AED]/30">
                Cloud Synced
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#272735]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 text-xs bg-[#181824] hover:bg-[#272735] text-[#A855F7] px-3 py-1.5 rounded-lg border border-[#272735] transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center space-x-1 text-xs bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white px-3 py-1.5 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </motion.div>
      ) : uploading ? (
        /* UPLOADING STATE */
        <div className="bg-[#12121A] border border-[#7C3AED]/40 rounded-xl p-8 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#7C3AED]/20 text-[#A855F7] flex items-center justify-center animate-pulse">
            <Upload className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#F8FAFC]">Uploading product image...</p>
            <p className="text-[11px] font-mono text-[#A855F7]">{uploadProgress}%</p>
          </div>
          <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-[#272735]">
            <motion.div
              className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      ) : (
        /* INITIAL DROPZONE STATE */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-16 p-8 flex flex-col items-center justify-center cursor-pointer transition text-center space-y-3 ${
            isDragging
              ? 'border-[#A855F7] bg-[#7C3AED]/15'
              : 'border-[#272735] hover:border-[#7C3AED]/50 bg-[#12121A]/50 hover:bg-[#12121A]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 text-[#A855F7] flex items-center justify-center border border-[#7C3AED]/20">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-heading font-bold text-[#F8FAFC]">
              Drop your product image here
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Supports PNG, JPG, JPEG, WEBP (Max 10MB)
            </p>
          </div>

          <button
            type="button"
            className="bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-xl border border-[#272735] transition pointer-events-none"
          >
            Browse Files
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Local Error State */}
      {localError && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
};
