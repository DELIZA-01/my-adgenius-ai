import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FolderKanban, User } from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Create', path: '/creative-studio', icon: PlusCircle },
  { name: 'My Ads', path: '/my-ads', icon: FolderKanban },
  { name: 'Profile', path: '/profile', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0D0D12]/95 backdrop-blur-lg border-t border-[#272735] flex items-center justify-around px-2">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-all ${
                isActive
                  ? 'text-[#A855F7]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
