import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, User, ShieldCheck, Menu, X } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface HeaderProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavAnchor = (hash: string) => {
    setMobileMenuOpen(false);
    if (currentScreen !== 'storefront') {
      onNavigate('storefront');
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavScreen = (screen: ScreenView) => {
    setMobileMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-noir-950/95 backdrop-blur-xl border-b border-amberfox/25 shadow-[0_8px_32px_rgba(0,0,0,0.7)]'
          : 'bg-noir-950/80 backdrop-blur-md border-b border-amberfox/10'
      }`}
    >
      <div
        className={`w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Brand Logo Container */}
        <button
          onClick={() => handleNavScreen('storefront')}
          className="flex items-center space-x-3.5 group text-left cursor-pointer shrink-0"
        >
          <img
            alt="MoneyFox Crest - Golden Fox Silhouette"
            className={`w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(245,138,46,0.35)] transition-all duration-300 group-hover:scale-105 ${
              isScrolled ? 'h-9 sm:h-10' : 'h-10 sm:h-12'
            }`}
            src={BRAND_ASSETS.logoCrest}
          />
          <div className="flex flex-col">
            <span className="font-serif tracking-luxury font-bold text-sm tracking-[0.2em] text-parchment-100 group-hover:text-amberfox transition-colors whitespace-nowrap">
              MONEYFOX
            </span>
            <span className="text-[9px] uppercase tracking-luxury text-amberfox font-medium whitespace-nowrap">
              Be Cunning Like A Fox
            </span>
          </div>
        </button>

        {/* Primary Editorial Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[13px] xl:text-sm tracking-wider font-semibold uppercase text-parchment-300 shrink-0">
          <button
            onClick={() => handleNavScreen('products')}
            className={`hover:text-amberfox transition-colors py-1 cursor-pointer whitespace-nowrap ${
              currentScreen === 'products' || currentScreen === 'product-detail' ? 'text-amberfox font-bold' : ''
            }`}
          >
            Products
          </button>
          <button
            onClick={() => handleNavAnchor('#how-it-works')}
            className="hover:text-amberfox transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavAnchor('#rewards')}
            className="hover:text-amberfox transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Commission
          </button>
          <button
            onClick={() => handleNavAnchor('#faq')}
            className="hover:text-amberfox transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            FAQ
          </button>
          <span className="text-amberfox/30 text-base font-light">|</span>
          <button
            onClick={() => handleNavScreen('member-terminal')}
            className={`hover:text-amberfox transition-colors py-1 cursor-pointer whitespace-nowrap ${
              currentScreen === 'member-terminal' ? 'text-amberfox font-bold' : 'text-parchment-300'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Account & Action Buttons */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">

          {/* User Sign In */}
          <button
            onClick={() => handleNavScreen('login')}
            className="text-xs sm:text-sm uppercase tracking-wider text-parchment-200 hover:text-amberfox transition-colors px-1.5 sm:px-2 py-1.5 font-semibold flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 text-amberfox shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Sign In</span>
          </button>

          {/* Mini Cart Indicator */}
          <button
            onClick={() => handleNavScreen('cart-review')}
            aria-label="Shopping Bag"
            className="relative p-1.5 sm:p-2 text-parchment-200 hover:text-amberfox transition-colors flex items-center cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-parchment-200 hover:text-amberfox transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-noir-950 bg-amberfox rounded-full font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Premium CTA Button */}
          <button
            onClick={() => handleNavScreen('products')}
            className="hidden sm:inline-flex btn-gold-sheen text-noir-950 text-xs font-bold uppercase tracking-luxury px-3 sm:px-4 py-2 sm:py-2.5 rounded-none border border-amberfox/40 items-center shadow-amber-glow cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">View Products</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 shrink-0" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-parchment-300 hover:text-amberfox focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Dynamic Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-noir-950/98 border-t border-amberfox/20 px-4 py-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-wider font-semibold text-parchment-300">
            <button
              onClick={() => handleNavScreen('products')}
              className={`text-left py-2 hover:text-amberfox border-b border-noir-850 whitespace-nowrap ${
                currentScreen === 'products' || currentScreen === 'product-detail' ? 'text-amberfox font-bold' : ''
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavAnchor('#how-it-works')}
              className="text-left py-2 hover:text-amberfox border-b border-noir-850 whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavAnchor('#rewards')}
              className="text-left py-2 hover:text-amberfox border-b border-noir-850 whitespace-nowrap"
            >
              Commission
            </button>
            <button
              onClick={() => handleNavAnchor('#faq')}
              className="text-left py-2 hover:text-amberfox border-b border-noir-850 whitespace-nowrap"
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavScreen('member-terminal')}
              className="text-left py-2 text-amberfox font-bold whitespace-nowrap"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
