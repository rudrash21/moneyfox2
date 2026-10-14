import React from 'react';
import { Phone, Mail, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface FooterProps {
  onNavigate: (screen: ScreenView) => void;
}

export const EditorialFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavAnchor = (hash: string) => {
    onNavigate('storefront');
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-noir-950 border-t border-amberfox/20 pt-16 pb-12 text-parchment-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 hairline-border-b">
          {/* Col 1: Brand & Official Motto */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                alt="MoneyFox Seal"
                className="h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(245,138,46,0.3)]"
                src={BRAND_ASSETS.sealEmblem}
              />
              <span className="font-serif tracking-luxury font-bold text-sm text-parchment-100">
                MONEYFOX
              </span>
            </div>
            <p className="font-serif text-xs text-amberfox uppercase tracking-luxury mb-4">
              Be Cunning Like A Fox
            </p>
            <p className="text-parchment-400 leading-relaxed text-xs font-light">
              Luxury heavyweight apparel engineered with architectural precision. Founded in India, distributed globally under verified statutory compliances.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm tracking-luxury text-parchment-100 font-bold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 font-normal text-sm">
              <li>
                <button
                  onClick={() => onNavigate('product-detail')}
                  className="hover:text-amberfox transition-colors text-left text-parchment-300 cursor-pointer"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavAnchor('#how-it-works')}
                  className="hover:text-amberfox transition-colors text-left text-parchment-300 cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavAnchor('#rewards')}
                  className="hover:text-amberfox transition-colors text-left text-parchment-300 cursor-pointer"
                >
                  Rewards
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavAnchor('#faq')}
                  className="hover:text-amberfox transition-colors text-left text-parchment-300 cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us */}
          <div>
            <h4 className="font-serif text-sm tracking-luxury text-parchment-100 font-bold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 font-normal text-sm text-parchment-300">
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center space-x-2.5 hover:text-amberfox transition-colors"
                >
                  <Phone className="w-4 h-4 text-amberfox flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@moneyfox.com"
                  className="flex items-center space-x-2.5 hover:text-amberfox transition-colors"
                >
                  <Mail className="w-4 h-4 text-amberfox flex-shrink-0" />
                  <span>support@moneyfox.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h4 className="font-serif text-sm tracking-luxury text-parchment-100 font-bold mb-4">
              Follow Us
            </h4>
            <ul className="space-y-3 font-normal text-sm text-parchment-300">
              <li>
                <a
                  href="https://instagram.com/moneyfox_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-amberfox transition-colors group"
                >
                  <Instagram className="w-4 h-4 text-[#E1306C] flex-shrink-0" />
                  <span>@moneyfox_official</span>
                  <ExternalLink className="w-3 h-3 text-parchment-500 group-hover:text-amberfox" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/moneyfox-india"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-amberfox transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5] flex-shrink-0" />
                  <span>MoneyFox India</span>
                  <ExternalLink className="w-3 h-3 text-parchment-500 group-hover:text-amberfox" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-parchment-600">
          <p>© 2025 MoneyFox. All rights reserved. Strictly adhering to Consumer Protection (Direct Selling) Rules, 2021.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 font-light">
            <span className="hover:text-parchment-200 cursor-pointer">Terms of Commerce</span>
            <span className="hover:text-parchment-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-parchment-200 cursor-pointer">Exchange Protocol</span>
            <span className="hover:text-parchment-200 cursor-pointer">Income Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
