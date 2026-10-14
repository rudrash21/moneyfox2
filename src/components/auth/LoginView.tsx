import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, AlertCircle, RefreshCw, User, Lock, Mail, Phone, UserPlus } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView, UserProfile } from '../../types';
import { authService } from '../../lib/authService';

interface LoginViewProps {
  onNavigate: (screen: ScreenView) => void;
  onLoginSuccess: (role: 'member' | 'admin', user?: UserProfile) => void;
  onForgotPassword: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  onLoginSuccess,
  onForgotPassword,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In fields
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Sign Up fields
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpPhone, setSignUpPhone] = useState<string>('');
  const [signUpReferral, setSignUpReferral] = useState<string>('00000');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await authService.signIn(identifier, password);
    setIsLoading(false);

    if (res.success && res.user) {
      const isAdmin =
        res.user.role === 'admin' ||
        identifier.trim().toLowerCase().includes('admin') ||
        res.user.email?.toLowerCase().includes('admin');

      onLoginSuccess(isAdmin ? 'admin' : 'member', {
        ...res.user,
        role: isAdmin ? 'admin' : res.user.role,
      });
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await authService.signUp({
      email: signUpEmail,
      password: signUpPassword,
      name: signUpName,
      phone: signUpPhone,
      referralCode: signUpReferral,
    });
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMessage('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess('member', res.user);
      }, 700);
    } else {
      setErrorMessage(res.error || 'Registration failed. Please check the details entered.');
    }
  };



  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24 font-sans selection:bg-amberfox selection:text-noir-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="bg-noir-900 hairline-border p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Accent top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amberfox/20 via-amberfox to-amberfox/20" />

          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5 pb-6 hairline-border-b">
            <img
              src={BRAND_ASSETS.logoCrest}
              alt="MoneyFox Crest"
              className="h-10 w-auto filter drop-shadow-[0_2px_8px_rgba(245,138,46,0.35)]"
            />
            <div>
              <span className="font-serif tracking-luxury font-bold text-sm tracking-[0.2em] text-parchment-100 block">
                MONEYFOX
              </span>
              <span className="text-[9px] uppercase tracking-luxury text-amberfox font-medium">
                Be Cunning Like A Fox • Official Portal
              </span>
            </div>
          </div>

          {/* Sign In vs Register Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-noir-950 hairline-border font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 text-center uppercase tracking-wider transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-noir-900 border border-amberfox/40 text-amberfox font-semibold shadow-inner'
                  : 'text-parchment-400 hover:text-parchment-200'
              }`}
            >
              Member Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 text-center uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-noir-900 border border-amberfox/40 text-amberfox font-semibold shadow-inner'
                  : 'text-parchment-400 hover:text-parchment-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-4 bg-amber-950/40 border border-amberfox/50 text-xs font-mono text-amberfox flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full bg-noir-950 hairline-border p-3.5 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="Enter your email address"
                    required
                  />
                  <Mail className="w-4 h-4 text-parchment-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-[11px] font-mono text-amberfox hover:underline cursor-pointer"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full bg-noir-950 hairline-border p-3.5 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="••••••••••••"
                    required
                  />
                  <Lock className="w-4 h-4 text-parchment-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gold-sheen text-noir-950 px-8 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating With Supabase...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>SIGN IN TO GUILD</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="e.g. Vikramaditya Sharma"
                    required
                  />
                  <User className="w-4 h-4 text-parchment-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="e.g. yourname@domain.com"
                    required
                  />
                  <Mail className="w-4 h-4 text-parchment-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="w-full bg-noir-950 hairline-border p-3 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      placeholder="9876543210"
                      required
                    />
                    <Phone className="w-4 h-4 text-parchment-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                    Sponsor Referral Code
                  </label>
                  <input
                    type="text"
                    value={signUpReferral}
                    onChange={(e) => setSignUpReferral(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="00000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                  Password (min 6 characters) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-noir-950 hairline-border p-3 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    placeholder="Create a strong password"
                    minLength={6}
                    required
                  />
                  <Lock className="w-4 h-4 text-parchment-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gold-sheen text-noir-950 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Account In Supabase...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>REGISTER NEW ACCOUNT</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* New Member acquisition link */}
          <div className="pt-6 hairline-border-t flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-parchment-400 gap-4">
            <span>Prefer to order first and activate automatically?</span>
            <button
              type="button"
              onClick={() => onNavigate('product-detail')}
              className="text-amberfox-gold hover:underline font-semibold uppercase tracking-luxury cursor-pointer"
            >
              Order Drop &amp; Join Guild →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
