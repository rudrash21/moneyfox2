import React, { useState } from 'react';
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Receipt, CreditCard, Users, FileText, GitBranch, Clock, Wallet, Award, CheckCircle2, ShoppingBag, Package, Share2, RotateCcw, X, Eye, Sparkles } from 'lucide-react';
import { BRAND_ASSETS, NINE_LEVEL_SCHEDULE, INITIAL_PRODUCTS } from '../../data/mockData';
import { ScreenView } from '../../types';
import { NineLevelBinaryTree } from './NineLevelBinaryTree';

interface StorefrontProps {
  onNavigate: (screen: ScreenView) => void;
  onSelectProductAndBuy: (productId: string, size: 'S' | 'M' | 'L' | 'XL') => void;
  onViewProductDetail?: (productId: string) => void;
}

const MARQUEE_ITEMS = [
  { text: "✦ FRESH DROPS • FRESH LOOKS", isAccent: true },
  { text: "• FASHION WITH PURPOSE", isAccent: false },
  { text: "✦ PREMIUM PRODUCTS SMART BUSINESS", isAccent: true },
  { text: "• STYLE MEETS OPPORTUNITY", isAccent: false },
  { text: "✦ ZERO JOINING FEE • STORE REWARDS", isAccent: true },
  { text: "• REAL PRODUCT REAL VALUE", isAccent: false },
  { text: "✦ FEEL THE DEAL", isAccent: true },
  { text: "• OWN THE MOVEMENT", isAccent: false },
  { text: "✦ TRUSTED BY PEOPLE", isAccent: true },
  { text: "• BUILT FOR THE BOLD", isAccent: false },
  { text: "✦ MAKE YOUR MOVE", isAccent: true },
  { text: "• GROW A TREE WITH PURCHASE ABOVE 2000", isAccent: false },
];

export const PublicStorefront: React.FC<StorefrontProps> = ({
  onNavigate,
  onSelectProductAndBuy,
  onViewProductDetail,
}) => {
  const [selectedMatrixLevel, setSelectedMatrixLevel] = useState<number>(1);
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);

  const howItWorksSteps = [
    {
      number: 1,
      title: 'Buy Premium Products',
      shortDesc: 'Make a purchase above ₹2,000 (no hidden fees)',
      icon: ShoppingBag,
      details: "Start by purchasing our premium quality MoneyFox branded products (purchase above ₹2,000, includes GST). This is a genuine product purchase - you're buying real products, not a membership or entry fee. Choose from stylish designs in your preferred size. You can simply enjoy your purchase without any further obligations."
    },
    {
      number: 2,
      title: 'Receive Your Product',
      shortDesc: 'Get your products delivered FREE across India',
      icon: Package,
      details: "Your premium MoneyFox products will be delivered to your doorstep within 7-15 business days, completely FREE of charge. We use quality packaging to ensure your product arrives in perfect condition. Track your order through your dashboard. Once you receive it, you can enjoy it with pride - that's the end of your obligation if you choose not to participate in referrals."
    },
    {
      number: 3,
      title: 'Share Your Code',
      shortDesc: 'Voluntarily share your referral code',
      icon: Share2,
      details: "After your purchase, you'll receive a unique 5-digit referral code. Sharing this code is COMPLETELY OPTIONAL - you are not required to refer anyone. If you choose to share, you can do so through WhatsApp, Facebook, or any platform. Your friends can use your code when they purchase products. Remember: referrals are a choice, not a requirement."
    },
    {
      number: 4,
      title: 'Earn Rewards',
      shortDesc: 'If you refer, earn rewards when they purchase',
      icon: Wallet,
      details: "If you choose to participate in referrals and your friends purchase products using your code, you can earn rewards. Level 1: ₹300 when 2 people complete purchases. Higher levels offer more rewards up to ₹76,800 at Level 9. Total potential: ₹1,53,300. These rewards are bonuses for helping us market our products - similar to affiliate commissions. Rewards are only paid when actual product sales occur."
    },
    {
      number: 5,
      title: 'Rejoin Cycle',
      shortDesc: 'Complete all levels? Make another purchase to restart',
      icon: RotateCcw,
      details: "Complete all levels? Make another purchase to restart. When you reach the top level of rewards, you can voluntarily purchase another qualifying product above ₹2,000 to re-enter the commission matrix and restart a new earning cycle."
    }
  ];

  return (
    <div className="bg-noir-950 text-parchment-100">
      {/* BEGIN: Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-radial-golden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Headline & Subheading */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <p className="text-amberfox uppercase font-medium tracking-[0.25em] text-xs sm:text-sm mb-3">
              WEAR IT. SHARE IT. GROW IT.
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.08em] leading-tight sm:leading-none text-parchment-100 uppercase mb-6">
              Be Cunning <br className="hidden sm:block" />
              <span className="gold-gradient-text font-bold">Like A Fox.</span>
            </h1>
            <p className="text-sm sm:text-base text-parchment-400 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              We are Money Fox — a lifestyle brand offering premium branded products through direct selling. Enhance your style while building a thriving business opportunity by purchasing our products above{' '}
              <span className="text-amberfox-gold font-medium">₹2,000</span>
            </p>

            {/* Dual CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="btn-gold-sheen text-noir-950 text-xs uppercase tracking-luxury font-bold px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center shadow-amber-glow cursor-pointer"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <a
                href="#how-it-works"
                className="hairline-border bg-noir-850/80 hover:bg-noir-800 text-parchment-200 hover:text-amberfox text-xs uppercase tracking-luxury font-medium px-8 py-4 w-full sm:w-auto transition-all text-center"
              >
                Explore Distribution Protocol
              </a>
            </div>
          </div>


        </div>
      </section>

      {/* BEGIN: Continuous Marquee Strip */}
      <div className="border-y border-amberfox/20 bg-noir-900/90 py-3.5 overflow-hidden flex select-none group">
        {[1, 2, 3, 4].map((trackIndex) => (
          <div
            key={trackIndex}
            className="flex shrink-0 animate-marquee items-center whitespace-nowrap font-serif tracking-[0.25em] text-xs text-parchment-200 uppercase"
            aria-hidden={trackIndex > 1 ? 'true' : undefined}
          >
            {MARQUEE_ITEMS.map((item, idx) => (
              <span
                key={`${trackIndex}-${idx}`}
                className={`mx-6 ${item.isAccent ? 'text-amberfox' : ''}`}
              >
                {item.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* BEGIN: How It Works Section */}
      <section className="py-24 bg-noir-950 relative" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f58a2e] tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-parchment-300 font-light leading-relaxed">
              Buy our premium products. Optionally share your code to earn rewards.{' '}
              <strong className="text-parchment-100 font-semibold">No obligation to recruit.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {howItWorksSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStepModal(step.number)}
                  className="bg-noir-900/90 border border-amberfox/20 hover:border-amberfox/60 p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(245,138,46,0.15)] group relative rounded-2xl"
                >
                  {/* Step Icon Container & Number Badge */}
                  <div className="relative mb-5 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white shadow-lg shadow-[#ff7a00]/25 group-hover:scale-105 transition-transform">
                      <StepIcon className="w-8 h-8 text-white stroke-[2.2]" />
                    </div>
                    <span className="absolute -top-1.5 -right-3 w-6 h-6 rounded-full border border-[#ff7a00] bg-noir-950 text-[#ff7a00] text-xs font-bold flex items-center justify-center shadow-sm">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-parchment-100 group-hover:text-amberfox transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-parchment-400 font-light leading-relaxed">
                    {step.shortDesc}
                  </p>
                  <span className="mt-4 text-[10px] text-amberfox/80 uppercase tracking-widest font-mono group-hover:text-amberfox underline underline-offset-4">
                    Learn more →
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Step Details Modal */}
          {activeStepModal && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setActiveStepModal(null)}
            >
              <div
                className="bg-black border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveStepModal(null)}
                  className="absolute top-4 right-4 text-parchment-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {(() => {
                  const step = howItWorksSteps.find((s) => s.number === activeStepModal);
                  if (!step) return null;
                  const StepIcon = step.icon;
                  return (
                    <>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#ff7a00] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                          <StepIcon className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
                            Step {step.number}
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                            {step.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-parchment-300 leading-relaxed font-normal">
                        {step.details}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* BEGIN: Full-Page Width Binary Tree Interactive Section */}
        <div className="mt-20 w-full px-2 sm:px-6 lg:px-10 max-w-[1920px] mx-auto">
          <NineLevelBinaryTree />
        </div>

        {/* BEGIN: Referral Rules & Guidelines Section */}
        <div className="mt-14 w-full px-2 sm:px-6 lg:px-10 max-w-[1920px] mx-auto">
          <div className="bg-noir-950 border border-amberfox/30 rounded-2xl p-6 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2.5 text-amberfox font-mono text-xs sm:text-sm uppercase tracking-luxury mb-2">
                <ShieldCheck className="w-5 h-5 text-amberfox" />
                <span>PLATFORM POLICY &amp; COMPLIANCE</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-parchment-100 uppercase tracking-wider">
                Important: Referral Rules &amp; Guidelines
              </h3>
            </div>

            {/* 4 Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base text-parchment-200 font-sans">
              <div className="flex items-center space-x-4 bg-noir-900 border border-amberfox/25 hover:border-amberfox/50 transition-colors rounded-xl p-5 sm:p-6 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-amberfox shrink-0" />
                <span className="leading-snug font-medium">Maximum 2 direct referrals per user (left &amp; right positions)</span>
              </div>
              <div className="flex items-center space-x-4 bg-noir-900 border border-amberfox/25 hover:border-amberfox/50 transition-colors rounded-xl p-5 sm:p-6 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-amberfox shrink-0" />
                <span className="leading-snug font-medium">Referral counts when they purchase a product</span>
              </div>
              <div className="flex items-center space-x-4 bg-noir-900 border border-amberfox/25 hover:border-amberfox/50 transition-colors rounded-xl p-5 sm:p-6 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-amberfox shrink-0" />
                <span className="leading-snug font-medium">Rewards credited when complete levels are filled</span>
              </div>
              <div className="flex items-center space-x-4 bg-noir-900 border border-amberfox/25 hover:border-amberfox/50 transition-colors rounded-xl p-5 sm:p-6 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-amberfox shrink-0" />
                <span className="leading-snug font-medium">Share your code with friends who love quality products</span>
              </div>
            </div>

            {/* Waiting Bench System Callout */}
            <div className="bg-gradient-to-br from-amber-950/30 via-noir-900/90 to-noir-950 border border-amberfox/35 rounded-xl p-6 sm:p-8 space-y-4 shadow-inner">
              <div className="flex items-center space-x-3 text-amberfox-gold font-bold text-base sm:text-lg">
                <Clock className="w-6 h-6 text-amberfox shrink-0" />
                <span className="font-serif tracking-wide uppercase">Waiting Bench System</span>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-parchment-300 leading-relaxed font-light">
                <p>
                  <strong className="text-amber-400 font-semibold text-base sm:text-lg block sm:inline">• Global Waiting Bench: </strong>
                  Users who sign up without a referral code are placed here for 21 days. After 21 days, they receive automatic compensation and can be placed in any available tree position.
                </p>
                <p>
                  <strong className="text-amber-400 font-semibold text-base sm:text-lg block sm:inline">• Personal Waiting Bench: </strong>
                  When you use a referral code that has already been used twice (both positions filled), you are placed in the referrer&apos;s personal waiting bench for 21 days. After 21 days, you receive compensation and can be placed elsewhere.
                </p>
              </div>
            </div>

            {/* After Completing All 9 Levels Callout */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-950/40 to-noir-950 border border-amber-500/50 rounded-xl p-6 sm:p-8 space-y-4 shadow-amber-glow">
              <div className="flex items-center space-x-3 text-amberfox font-bold text-base sm:text-lg">
                <RotateCcw className="w-6 h-6 text-amberfox shrink-0" />
                <span className="font-serif tracking-wide uppercase">After Completing All 9 Levels</span>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-parchment-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amberfox mt-0.5 shrink-0" />
                  <span>
                    Once you complete all 9 levels and earn ₹1,53,300, you can{' '}
                    <strong className="text-amber-300 font-semibold underline decoration-amber-500/50 underline-offset-2">
                      rejoin by making another purchase
                    </strong>{' '}
                    (above ₹2,000).
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amberfox mt-0.5 shrink-0" />
                  <span>You&apos;ll get a fresh start with a new tree and can earn another full cycle of ₹1,53,300.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amberfox mt-0.5 shrink-0" />
                  <span className="text-amberfox-gold font-medium">
                    There&apos;s no limit to how many times you can rejoin - your earning potential is unlimited!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-6 lg:px-10 max-w-[1920px] mx-auto">
          {/* BEGIN: 9-Level 2x2 Binary Tree Compensation Matrix Section */}
          <div className="mt-20 pt-16 border-t border-amberfox/20" id="rewards">
            <div className="text-center max-w-4xl mx-auto mb-14">

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-parchment-100 mt-2">
                9-Level Commission Matrix
              </h2>
              <p className="text-sm sm:text-base text-parchment-300 mt-3 font-light leading-relaxed">
                2×2 binary tree structure (Left and Right Child) with a personal/global waiting bench and 21-day spillover mechanism. Earn from ₹300 up to ₹76,800 across 9 progressive levels with a cumulative earning potential of ₹1,53,300.
              </p>
            </div>

            {/* 3 Mechanism Core Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-3">
                <div className="flex items-center space-x-2.5 text-amberfox mb-2">
                  <GitBranch className="w-5 h-5" />
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-luxury font-bold">2×2 Structure</span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-parchment-100 uppercase">Dual-Branch Topology</h4>
                <p className="text-sm text-parchment-300 font-light leading-relaxed">
                  Every user has exactly 2 direct downline positions: <strong className="text-amberfox">Left Child</strong> and <strong className="text-amberfox">Right Child</strong>. All subsequent referrals spill down automatically into vacant nodes.
                </p>
              </div>

              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-3">
                <div className="flex items-center space-x-2.5 text-amberfox mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-luxury font-bold">Waiting Bench</span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-parchment-100 uppercase">21-Day Spillover Timer</h4>
                <p className="text-sm text-parchment-300 font-light leading-relaxed">
                  Referrals made after direct slots are filled enter a personal/global waiting bench with an active 21-day spillover timer for flexible manual placement or automatic optimal positioning.
                </p>
              </div>

              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-3">
                <div className="flex items-center space-x-2.5 text-amberfox mb-2">
                  <Wallet className="w-5 h-5" />
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-luxury font-bold">Cumulative Payouts</span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-parchment-100 uppercase">₹1,53,300 Max Potential</h4>
                <p className="text-sm text-parchment-300 font-light leading-relaxed">
                  Automated wallet balances credit real-time level bonuses upon completion. Request instant UPI disbursements to Google Pay, PhonePe, or Paytm with statutory GST compliance.
                </p>
              </div>
            </div>

            {/* Interactive Level Inspection Table */}
            <div className="bg-noir-900 hairline-border p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-amberfox/15 font-mono text-xs sm:text-sm">
                <div>
                  <span className="text-xs sm:text-sm uppercase text-amberfox tracking-luxury font-semibold block mb-1">
                    NINE-LEVEL MATRIX SCHEDULE
                  </span>
                  <span className="text-base sm:text-xl font-serif text-parchment-100 uppercase">
                    Select a Level to Inspect Requirements &amp; Earnings
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs sm:text-sm text-parchment-400">Total Cumulative:</span>
                  <span className="px-3 py-1.5 bg-noir-950 hairline-border border-amberfox/40 text-amberfox font-bold text-sm sm:text-base">
                    ₹1,53,300
                  </span>
                </div>
              </div>

              {/* Level Selector Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-3">
                {NINE_LEVEL_SCHEDULE.map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSelectedMatrixLevel(item.level)}
                    className={`py-3 sm:py-3.5 text-center font-mono text-xs sm:text-sm uppercase hairline-border transition-all cursor-pointer ${
                      selectedMatrixLevel === item.level
                        ? 'border-amberfox bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                        : 'bg-noir-950 text-parchment-300 hover:border-amberfox/50 hover:text-amberfox'
                    }`}
                  >
                    L{item.level}
                  </button>
                ))}
              </div>

              {/* Selected Level Highlight Banner */}
              {(() => {
                const lvl = NINE_LEVEL_SCHEDULE.find((l) => l.level === selectedMatrixLevel) || NINE_LEVEL_SCHEDULE[0];
                return (
                  <div className="bg-noir-950 hairline-border border-amberfox/30 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                    <div>
                      <span className="text-xs uppercase text-amberfox block mb-1">SELECTED LEVEL</span>
                      <span className="text-2xl sm:text-3xl font-serif text-parchment-100 font-bold">Level {lvl.level}</span>
                      <span className="text-xs sm:text-sm text-emerald-400 block mt-1">Direct wallet reward</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs uppercase text-parchment-400 block mb-1">LEVEL COMMISSION</span>
                      <span className="text-3xl sm:text-4xl font-serif text-amberfox font-bold">₹{lvl.levelReward.toLocaleString('en-IN')}</span>
                      <span className="text-xs sm:text-sm text-amberfox-gold block mt-1">Progressive cycle bonus</span>
                    </div>
                  </div>
                );
              })()}

              {/* Full Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-amberfox/20 text-parchment-400 text-xs sm:text-sm uppercase tracking-luxury">
                      <th className="py-4 px-6">Level</th>
                      <th className="py-4 px-6 text-right">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amberfox/10">
                    {NINE_LEVEL_SCHEDULE.map((row) => {
                      const isSelected = selectedMatrixLevel === row.level;
                      return (
                        <tr
                          key={row.level}
                          onClick={() => setSelectedMatrixLevel(row.level)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-950/30 text-parchment-100 font-medium'
                              : 'hover:bg-noir-950/60 text-parchment-300'
                          }`}
                        >
                          <td className="py-4 px-6">
                            <span className={`inline-block px-3.5 py-1 text-xs sm:text-sm uppercase font-bold hairline-border ${
                              isSelected ? 'bg-amberfox text-noir-950 border-amberfox' : 'border-amberfox/20 text-amberfox'
                            }`}>
                              Level {row.level}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-amberfox font-bold text-base sm:text-lg">
                            ₹{row.levelReward.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-amberfox/40 font-bold text-amberfox bg-noir-950/80">
                      <td className="py-4 px-6 uppercase text-sm sm:text-base">
                        Total 9-Level Earning Potential:
                      </td>
                      <td className="py-4 px-6 text-right text-amberfox-gold text-lg sm:text-xl">
                        ₹1,53,300
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Statutory Regulatory Disclosure */}
            <div className="mt-8 bg-noir-900 border-l-2 border-amberfox p-6 sm:p-8 text-left">
              <h4 className="font-serif text-sm sm:text-base uppercase tracking-luxury text-amberfox font-semibold mb-2">
                Statutory Regulatory Disclosure • Indian Consumer Protection
              </h4>
              <p className="text-xs sm:text-sm text-parchment-300 leading-relaxed font-light">
                MoneyFox is a direct-to-consumer luxury merchandise brand. Participation in the binary commission structure is strictly tied to physical merchandise orders (₹2,000 one-time product purchase including 12% GST). There is no joining fee or paid pyramid tier. Rewards are paid strictly as retail referral incentives upon verified physical product deliveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEGIN: Interactive FAQ Accordion */}
      <section className="py-24 bg-noir-900 hairline-border-t" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amberfox font-mono text-xs uppercase tracking-luxury">CLARITY &amp; PROTOCOL</span>
            <h2 className="font-serif text-3xl uppercase tracking-wider text-parchment-100 mt-2">
              Frequently Inquired
            </h2>
            <div className="w-10 h-[1px] bg-amberfox mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            <details className="group bg-noir-950 hairline-border p-5 cursor-pointer">
              <summary className="flex justify-between items-center font-serif text-sm tracking-wide uppercase text-parchment-100 list-none">
                <span>What exact tax documentation is issued with my order?</span>
                <span className="text-amberfox group-open:rotate-180 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </span>
              </summary>
              <div className="mt-4 pt-4 hairline-border-t text-xs text-parchment-400 leading-relaxed font-light">
                Every transaction generates a statutory tax invoice under HSN Code 6109 (T-Shirts of Cotton). The invoice explicitly itemizes the taxable base value of ₹1,785.71 alongside 6% Central GST (₹107.14) and 6% State GST (₹107.14). If you enter a valid GSTIN at checkout, a B2B tax invoice is immediately filed to your portal.
              </div>
            </details>

            <details className="group bg-noir-950 hairline-border p-5 cursor-pointer">
              <summary className="flex justify-between items-center font-serif text-sm tracking-wide uppercase text-parchment-100 list-none">
                <span>How does the 7-day size exchange work?</span>
                <span className="text-amberfox group-open:rotate-180 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </span>
              </summary>
              <div className="mt-4 pt-4 hairline-border-t text-xs text-parchment-400 leading-relaxed font-light">
                If your garment does not fit with the structured drop-shoulder drape you prefer, notify our concierge within 7 calendar days of receipt. We schedule a reverse courier pick-up via BlueDart and dispatch the alternate size as soon as the garment passes inspection in unused condition with tags attached.
              </div>
            </details>

            <details className="group bg-noir-950 hairline-border p-5 cursor-pointer">
              <summary className="flex justify-between items-center font-serif text-sm tracking-wide uppercase text-parchment-100 list-none">
                <span>How are UPI payments validated?</span>
                <span className="text-amberfox group-open:rotate-180 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </span>
              </summary>
              <div className="mt-4 pt-4 hairline-border-t text-xs text-parchment-400 leading-relaxed font-light">
                We use direct UPI deep-linking compatible with Google Pay, PhonePe, and Paytm. The 12-digit Unique Transaction Reference (UTR) is verified in real-time against our banking escrow. Your dispatch order number and PDF tax invoice are automatically generated in under 15 seconds.
              </div>
            </details>

            <details className="group bg-noir-950 hairline-border p-5 cursor-pointer">
              <summary className="flex justify-between items-center font-serif text-sm tracking-wide uppercase text-parchment-100 list-none">
                <span>Are there obligations to refer others or purchase monthly kits?</span>
                <span className="text-amberfox group-open:rotate-180 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </span>
              </summary>
              <div className="mt-4 pt-4 hairline-border-t text-xs text-parchment-400 leading-relaxed font-light">
                Absolutely none. MoneyFox is fundamentally a luxury apparel brand. Buying a T-Shirt grants you complete ownership of high-grade streetwear. Sharing your referral code is entirely optional; when used, you simply receive ₹300 per genuine product purchase as customer credit.
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShirtIcon = () => (
  <svg className="w-6 h-6 text-amberfox/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
