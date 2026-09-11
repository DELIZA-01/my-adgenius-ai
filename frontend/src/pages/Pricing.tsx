import React, { useState } from 'react';
import { Tag, Check, Sparkles, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const plans = [
  {
    name: 'Free Starter',
    price: '$0',
    period: '/forever',
    credits: '100 Credits Included',
    desc: 'Perfect for exploring AI ad generation capabilities.',
    features: [
      '100 Free Credits on Signup',
      'AI Product Image Studio',
      'Standard Render Resolution',
      'Community Support',
    ],
    popular: false,
    buttonText: 'Current Plan',
  },
  {
    name: 'Creator Pro',
    price: '$49',
    period: '/month',
    credits: '1,000 Credits / mo',
    desc: 'Designed for active marketers, agencies & e-commerce brands.',
    features: [
      '1,000 Monthly Credits',
      '4K AI Product Images & Motion Videos',
      'UGC AI Avatar Presenter Studio',
      'Fast Priority Rendering Queue',
      'Commercial License Rights',
      'Direct API Access',
    ],
    popular: true,
    buttonText: 'Upgrade to Creator Pro',
  },
  {
    name: 'Enterprise Ultra',
    price: '$199',
    period: '/month',
    credits: '5,000 Credits / mo',
    desc: 'For high-scale performance agencies & enterprise teams.',
    features: [
      '5,000 Monthly Credits',
      'Custom AI Model Training on Products',
      'Dedicated Account Director',
      'Custom Voice Cloning & Avatars',
      'Priority SLA & 99.9% Uptime',
    ],
    popular: false,
    buttonText: 'Contact Enterprise',
  },
];

export const Pricing: React.FC = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');

  const handleSubscribeClick = (planName: string) => {
    if (planName === 'Free Starter') return;
    setSelectedPlanName(planName);
    setShowCheckoutModal(true);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#7C3AED]/15 border border-[#7C3AED]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A855F7]">
          <Tag className="w-3.5 h-3.5" />
          <span>Flexible Credit Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#F8FAFC]">
          Scale Your Ad Campaigns with AI
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Choose the credit plan that fits your business growth. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? 'bg-[#12121A] border-2 border-[#A855F7] shadow-2xl shadow-[#7C3AED]/20 ring-1 ring-[#A855F7]'
                : 'bg-[#0D0D12] border border-[#272735] hover:border-[#7C3AED]/40'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-[11px] font-heading font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-heading font-bold text-[#F8FAFC]">{plan.name}</h3>
                <p className="text-xs text-[#94A3B8] mt-1">{plan.desc}</p>
              </div>

              <div className="border-y border-[#272735] py-4 space-y-1">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-heading font-extrabold text-[#F8FAFC]">{plan.price}</span>
                  <span className="text-xs text-[#64748B]">{plan.period}</span>
                </div>
                <p className="text-xs font-semibold text-[#A855F7]">{plan.credits}</p>
              </div>

              <ul className="space-y-3 text-xs text-[#94A3B8]">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSubscribeClick(plan.name)}
                className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs transition shadow-lg ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] hover:opacity-95 text-white shadow-[#7C3AED]/25'
                    : 'bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] border border-[#272735]'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Professional Payment Coming Soon Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0D0D12] border border-[#272735] rounded-2xl p-6 sm:p-8 text-center space-y-6 z-10 shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center shadow-lg">
                <CreditCard className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#A855F7] px-3 py-1 rounded-full border border-[#7C3AED]/30">
                  Payment Gateway Coming Soon
                </span>
                <h3 className="text-xl font-heading font-bold text-[#F8FAFC] mt-3">
                  {selectedPlanName} Checkout
                </h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                  Stripe & Razorpay live subscription billing integrations are currently being deployed. In the meantime, enjoy your initial free trial credits!
                </p>
              </div>

              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-full bg-[#181824] hover:bg-[#272735] text-[#F8FAFC] font-medium py-3 rounded-xl border border-[#272735] text-xs transition"
              >
                Back to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
