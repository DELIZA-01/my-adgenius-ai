import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Key, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="border-b border-[#272735] pb-6">
        <h1 className="text-2xl font-heading font-bold text-[#F8FAFC]">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Configure security, notifications, and application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#272735] pb-2">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'account'
              ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Account Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'security'
              ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'notifications'
              ? 'bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/40'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Account Section */}
      {activeTab === 'account' && (
        <form onSubmit={handleSave} className="bg-[#0D0D12] border border-[#272735] p-6 rounded-16 space-y-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-[#F8FAFC]">System Configuration</h3>
          <div className="space-y-4 text-xs text-[#94A3B8]">
            <div className="p-4 bg-[#12121A] border border-[#272735] rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-[#F8FAFC]">Backend API Endpoint</p>
                <p className="text-[10px] text-[#64748B]">Connected FastAPI Server</p>
              </div>
              <code className="bg-[#181824] px-3 py-1 rounded text-[#A855F7] font-mono">
                {import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}
              </code>
            </div>

            <div className="p-4 bg-[#12121A] border border-[#272735] rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-[#F8FAFC]">High Resolution Video Rendering</p>
                <p className="text-[10px] text-[#64748B]">Default 4K Ultra Preset</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#7C3AED]" />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Save Account Settings
          </button>
        </form>
      )}

      {/* Security Section */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="bg-[#0D0D12] border border-[#272735] p-6 rounded-16 space-y-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-[#F8FAFC]">Security & Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#12121A] border border-[#272735] rounded-xl p-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Update Password
          </button>
        </form>
      )}

      {/* Notifications Section */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="bg-[#0D0D12] border border-[#272735] p-6 rounded-16 space-y-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-[#F8FAFC]">Email & App Alerts</h3>
          <div className="space-y-3 text-xs text-[#94A3B8]">
            <label className="flex items-center justify-between p-3.5 bg-[#12121A] border border-[#272735] rounded-xl cursor-pointer">
              <span>Notify when video rendering completes</span>
              <input type="checkbox" defaultChecked className="accent-[#7C3AED]" />
            </label>
            <label className="flex items-center justify-between p-3.5 bg-[#12121A] border border-[#272735] rounded-xl cursor-pointer">
              <span>Low credit balance warning email</span>
              <input type="checkbox" defaultChecked className="accent-[#7C3AED]" />
            </label>
          </div>

          <button
            type="submit"
            className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Save Notifications
          </button>
        </form>
      )}

      {/* Logout Box */}
      <div className="bg-[#12121A] border border-[#EF4444]/20 p-6 rounded-16 flex items-center justify-between">
        <div>
          <h4 className="font-heading font-bold text-sm text-[#F8FAFC]">Sign Out of Session</h4>
          <p className="text-xs text-[#64748B]">Log out of your current AdGenius AI account</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
