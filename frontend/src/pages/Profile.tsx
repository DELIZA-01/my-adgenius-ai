import React, { useState } from 'react';
import { User as UserIcon, Coins, Mail, Calendar, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="border-b border-[#272735] pb-6">
        <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
          User Profile & Account
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your personal details and subscription credits
        </p>
      </div>

      {success && (
        <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully in backend database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D0D12] border border-[#272735] p-5 rounded-16 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <Coins className="w-4 h-4 text-[#A855F7]" />
            <span>Available Credits</span>
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#F8FAFC]">
            {user?.credits ?? 0}
          </p>
        </div>

        <div className="bg-[#0D0D12] border border-[#272735] p-5 rounded-16 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <Mail className="w-4 h-4 text-[#6366F1]" />
            <span>Account Email</span>
          </div>
          <p className="text-sm font-semibold text-[#F8FAFC] truncate">
            {user?.email || 'Guest'}
          </p>
        </div>

        <div className="bg-[#0D0D12] border border-[#272735] p-5 rounded-16 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <Calendar className="w-4 h-4 text-[#EC4899]" />
            <span>Member Since</span>
          </div>
          <p className="text-sm font-semibold text-[#F8FAFC]">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#0D0D12] border border-[#272735] p-6 sm:p-8 rounded-16 space-y-6 shadow-xl">
        <h3 className="font-heading font-bold text-lg text-[#F8FAFC]">
          Edit Profile Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-95 text-white font-heading font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-[#7C3AED]/25 transition"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Save Profile Settings'}</span>
        </button>
      </form>
    </div>
  );
};
