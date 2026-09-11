import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Video, UserCheck, X, Sparkles, ArrowRight } from 'lucide-react';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  {
    title: 'Product Image',
    desc: 'Generate studio-grade promotional graphics for products',
    path: '/product-to-image',
    icon: Image,
    badge: '5 Credits',
    color: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    title: 'Product Video',
    desc: 'Transform product concepts into 4K motion ads',
    path: '/product-to-video',
    icon: Video,
    badge: '15 Credits',
    color: 'from-[#6366F1] to-[#7C3AED]',
  },
  {
    title: 'AI Avatar Ad',
    desc: 'Create presenter video ads with real AI spokespersons',
    path: '/ai-avatar',
    icon: UserCheck,
    badge: '20 Credits',
    color: 'from-[#EC4899] to-[#A855F7]',
  },
];

export const CreateAdModal: React.FC<CreateAdModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-[#0D0D12] border border-[#272735] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#272735] pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-[#F8FAFC]">
                  What do you want to create?
                </h3>
                <p className="text-xs text-[#94A3B8]">Select an AI creative engine to start</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg hover:bg-[#181824] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.path}
                  onClick={() => handleSelect(opt.path)}
                  className="w-full p-4 bg-[#12121A] hover:bg-[#181824] border border-[#272735] hover:border-[#7C3AED]/50 rounded-xl text-left transition group flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${opt.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-heading font-bold text-sm text-[#F8FAFC] group-hover:text-[#A855F7] transition">
                          {opt.title}
                        </h4>
                        <span className="text-[10px] font-medium bg-[#7C3AED]/20 text-[#A855F7] px-2 py-0.5 rounded-full border border-[#7C3AED]/30">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#64748B] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
