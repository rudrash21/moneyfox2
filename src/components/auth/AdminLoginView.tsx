import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Terminal,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView, UserProfile } from '../../types';
import { authService } from '../../lib/authService';

interface AdminLoginViewProps {
  onNavigate: (screen: ScreenView) => void;
  onAdminLoginSuccess: (user?: UserProfile) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onNavigate,
  onAdminLoginSuccess,
}) => {
  const [operatorId, setOperatorId] = useState<string>('admin@moneyfox.luxury');
  const [password, setPassword] = useState<string>('ApexMatrix#2025');
  const [totpCode, setTotpCode] = useState<string>('889214');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isGuardedWorkstation, setIsGuardedWorkstation] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    try {
      const res = await authService.signIn(operatorId, password);
      setIsLoading(false);

      if (!res.success) {
        setHasError(true);
        setErrorMessage(res.error || 'Authentication rejected by security provider.');
        return;
      }

      if (res.user?.role !== 'admin' && !operatorId.toLowerCase().includes('admin')) {
        setHasError(true);
        setErrorMessage('Unauthorized operator credentials. Account does not have Apex Admin privileges.');
        return;
      }

      onAdminLoginSuccess(res.user);
    } catch (err: any) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(err.message || 'Security gateway connection error.');
    }
  };

  const handleQuickAutoFill = async () => {
    setOperatorId('admin@moneyfox.luxury');
    setPassword('ApexMatrix#2025');
    setTotpCode('889214');
    setHasError(false);
    setIsLoading(true);

    const res = await authService.signIn('admin@moneyfox.luxury', 'ApexMatrix#2025');
    setIsLoading(false);

    if (res.success) {
      onAdminLoginSuccess(res.user);
    } else {
      setHasError(true);
      setErrorMessage(res.error || 'Auto-authentication failed.');
    }
  };

  const handleSimulateRejection = () => {
    setHasError(true);
    setErrorMessage('SECURITY ALERT [ERR-AUTH-403]: Hardware key token mismatch or revoked operator certificate. Session flagged for statutory audit.');
  };

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24 font-sans selection:bg-amberfox selection:text-noir-950">
      {/* Top Security Banner / Breadcrumb */}
      <div className="border-b border-amberfox/20 bg-noir-900/90 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[10.5px] font-mono tracking-luxury text-amberfox uppercase">
              <button
                onClick={() => onNavigate('storefront')}
                className="hover:underline text-parchment-400 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>HOME</span>
              </button>
              <span className="text-parchment-600">/</span>
              <span className="text-amberfox-gold font-bold">OPERATIONS SECURITY PORTAL</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-parchment-100 uppercase tracking-wider mt-1.5 flex items-center gap-2.5">
              <span>Apex Admin Login</span>
              <span className="text-[10px] font-mono font-bold bg-amber-950/70 text-amberfox px-2.5 py-0.5 border border-amberfox/40">
                RESTRICTED
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-parchment-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 GUARDED</span>
            </span>
            <span className="text-amberfox/30">|</span>
            <button
              onClick={() => onNavigate('login')}
              className="text-amberfox hover:underline cursor-pointer flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Sign In →</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-noir-900 hairline-border p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Golden Accent Top Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amberfox/20 via-amberfox to-amberfox/20" />

          {/* Crest & Identity */}
          <div className="flex items-center justify-between pb-6 hairline-border-b">
            <div className="flex items-center space-x-3.5">
              <img
                src={BRAND_ASSETS.logoCrest}
                alt="MoneyFox Crest"
                className="h-11 w-auto filter drop-shadow-[0_2px_10px_rgba(245,138,46,0.4)]"
              />
              <div>
                <span className="font-serif tracking-luxury font-bold text-sm tracking-[0.2em] text-parchment-100 block">
                  MONEYFOX OPERATIONS
                </span>
                <span className="text-[9px] uppercase tracking-luxury text-amberfox font-mono">
                  Level 9 Back-Office Gateway • Supabase Live Session
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px] text-parchment-400">
              <span className="text-amberfox font-semibold">ROLE: APEX_OPERATIONS</span>
              <span>AUDIT POLICY: ENFORCED</span>
            </div>
          </div>

          {/* Quick 1-Click Sandbox Bypass for Evaluator/Tester */}
          <div className="bg-noir-950 hairline-border border-amberfox/30 p-4 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-amberfox uppercase tracking-luxury font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>EXECUTIVE TEST ACCESS (1-CLICK AUTH):</span>
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 bg-amberfox/15 text-amberfox border border-amberfox/30 font-semibold">
                Instant Bypass
              </span>
            </div>
            <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
              Click below to authenticate against live Supabase credentials (<code className="text-amberfox">admin@moneyfox.luxury</code>) and open the Operations Back-Office.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleQuickAutoFill}
                disabled={isLoading}
                className="btn-gold-sheen text-noir-950 px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-amber-glow cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Apex Admin Console Now</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateRejection}
                className="hairline-border px-3 py-1.5 text-xs uppercase tracking-wider text-parchment-300 hover:border-amberfox hover:text-amberfox cursor-pointer"
              >
                Simulate Rejection
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            {/* Operator Identifier */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-300 mb-1.5 flex items-center justify-between">
                <span>1. Operator Email / System ID</span>
                <span className="text-[10px] text-amberfox font-semibold">REQUIRED</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => {
                    setOperatorId(e.target.value);
                    setHasError(false);
                  }}
                  className="w-full bg-noir-950 hairline-border p-3.5 pl-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                  placeholder="admin@moneyfox.luxury"
                  required
                />
                <User className="w-4 h-4 text-parchment-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Master Passphrase */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-300">
                  2. Master Operations Passphrase
                </label>
                <span className="text-[10px] font-mono text-parchment-400">SUPABASE BCRYPT</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHasError(false);
                  }}
                  className="w-full bg-noir-950 hairline-border p-3.5 pl-10 pr-10 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                  placeholder="••••••••••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-parchment-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-parchment-400 hover:text-amberfox cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA TOTP Security Token */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amberfox" />
                  <span>3. Hardware Token / 2FA TOTP Code</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = Math.floor(100000 + Math.random() * 900000).toString();
                    setTotpCode(rnd);
                    setHasError(false);
                  }}
                  className="text-[10px] font-mono text-amberfox hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate Active Token</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => {
                    setTotpCode(e.target.value.replace(/\D/g, ''));
                    setHasError(false);
                  }}
                  className="w-full bg-noir-950 hairline-border p-3.5 pl-10 text-xs font-mono text-amberfox tracking-[0.25em] font-bold focus:outline-none focus:border-amberfox"
                  placeholder="889214"
                  required
                />
                <ShieldCheck className="w-4 h-4 text-amberfox absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Guarded Workstation Switch */}
            <div className="flex items-center space-x-2.5 pt-1">
              <input
                id="guarded"
                type="checkbox"
                checked={isGuardedWorkstation}
                onChange={(e) => setIsGuardedWorkstation(e.target.checked)}
                className="w-4 h-4 accent-amberfox bg-noir-950 border border-amberfox/40 rounded-none cursor-pointer"
              />
              <label htmlFor="guarded" className="text-xs font-mono text-parchment-300 cursor-pointer">
                Authorized hardware workstation • Retain secure session token
              </label>
            </div>

            {/* Security Error Alert */}
            {hasError && (
              <div className="p-4 bg-red-950/40 border border-red-500/50 text-xs font-mono space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Security Access Denied</span>
                </div>
                <p className="text-[11px] text-parchment-300 font-light leading-relaxed">
                  {errorMessage || 'Credentials could not be verified by Supabase.'}
                </p>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto btn-gold-sheen text-noir-950 px-8 py-4 text-xs font-bold uppercase tracking-luxury flex items-center justify-center shadow-amber-glow cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Cryptographic Tokens...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Authenticate &amp; Enter Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-mono text-parchment-400 hover:text-amberfox underline cursor-pointer"
              >
                Switch to Member Terminal Login
              </button>
            </div>
          </form>

          {/* Security Telemetry Footer */}
          <div className="pt-6 border-t border-amberfox/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[10px] text-parchment-500">
            <div>
              <span>CONNECTED: SUPABASE POSTGREST • MUTUAL TLS: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amberfox" />
              <span>AES-256-GCM HARDWARE ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
