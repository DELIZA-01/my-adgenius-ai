import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  FolderKanban,
  Tag,
  Coins,
  User,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Creative Studio', path: '/creative-studio', icon: Palette },
  { name: 'My Ads', path: '/my-ads', icon: FolderKanban },
  { name: 'Pricing', path: '/pricing', icon: Tag },
];

const secondaryNavItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-[240px] h-screen bg-[#0D0D12] border-r border-[#272735] flex flex-col justify-between p-4 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-[#F8FAFC] tracking-tight">
              ✦ AdGenius AI
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-[#94A3B8] hover:text-white p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7C3AED]/15 text-[#A855F7] border border-[#7C3AED]/30 font-semibold shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#181824]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        {/* Credits Badge */}
        {isAuthenticated && user && (
          <div className="bg-[#12121A] border border-[#272735] p-3.5 rounded-16 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-[#7C3AED]/20 text-[#A855F7]">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Credits</p>
                <p className="font-bold text-sm text-[#F8FAFC]">{user.credits} Available</p>
              </div>
            </div>
            <NavLink
              to="/pricing"
              className="text-[11px] font-semibold text-[#A855F7] hover:underline"
            >
              Top Up
            </NavLink>
          </div>
        )}

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-2 border-t border-[#272735]">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#7C3AED]/15 text-[#A855F7] border border-[#7C3AED]/30 font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#181824]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                if (onClose) onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
