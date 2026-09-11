import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Coins, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/creative-studio': 'Creative Studio',
  '/product-to-image': 'Product To Image',
  '/product-to-video': 'Product To Video',
  '/ai-avatar': 'AI Avatar Ad',
  '/my-ads': 'My Ads Library',
  '/pricing': 'Pricing & Credits',
  '/profile': 'User Profile',
  '/settings': 'Settings',
  '/login': 'Sign In',
  '/signup': 'Create Account',
};

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const currentTitle = pageTitles[location.pathname] || 'AdGenius AI';

  return (
    <header className="h-[72px] bg-[#0D0D12]/80 backdrop-blur-md border-b border-[#272735] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded-lg hover:bg-[#181824]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Page Title & Breadcrumb */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#64748B]">
            <span>AdGenius AI</span>
            <span>/</span>
            <span className="text-[#94A3B8]">{currentTitle}</span>
          </div>
          <h1 className="text-lg font-heading font-bold text-[#F8FAFC]">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3" />
          <input
            type="text"
            placeholder="Search creatives & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 bg-[#12121A] border border-[#272735] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] transition-all"
          />
        </div>

        {/* Credits Badge */}
        {isAuthenticated && user && (
          <Link
            to="/pricing"
            className="flex items-center space-x-2 bg-[#12121A] border border-[#272735] px-3 py-1.5 rounded-xl hover:border-[#7C3AED]/50 transition group"
          >
            <Coins className="w-4 h-4 text-[#A855F7] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-[#F8FAFC]">{user.credits}</span>
            <span className="text-[10px] text-[#94A3B8] font-medium hidden md:inline">Credits</span>
          </Link>
        )}

        {/* Notifications */}
        <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#181824] rounded-xl relative transition">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-[#EC4899] rounded-full absolute top-2 right-2 ring-2 ring-[#0D0D12]" />
        </button>

        {/* User Profile Avatar */}
        {isAuthenticated && user ? (
          <Link
            to="/profile"
            className="flex items-center space-x-2.5 pl-2 border-l border-[#272735]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] p-[1px]">
              <div className="w-full h-full rounded-full bg-[#0D0D12] flex items-center justify-center text-xs font-bold text-[#F8FAFC]">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.email.substring(0, 2).toUpperCase()
                )}
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-[#F8FAFC] truncate max-w-[120px]">
                {user.full_name || user.email.split('@')[0]}
              </p>
              <p className="text-[10px] text-[#64748B] truncate max-w-[120px]">{user.email}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-1.5 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white font-medium px-3.5 py-1.5 rounded-xl shadow-md shadow-[#7C3AED]/20 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
