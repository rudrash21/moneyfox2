import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/mockData';
import { ScreenView } from '../../types';

interface PasswordRecoveryProps {
  onNavigate: (screen: ScreenView) => void;
  onBackToLogin: () => void;
}

export const PasswordRecoveryFlow: React.FC<PasswordRecoveryProps> = ({
  onNavigate,
  onBackToLogin,
}) => {
  const [stage, setStage] = useState<'request' | 'sent' | 'reset'>('request');
  const [email, setEmail] = useState<string>('vikram.s@matrixguild.in');
  const [newPassword, setNewPassword] = useState<string>('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState<string>('••••••••••••');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  return (
    <div className="bg-noir-950 text-parchment-100 min-h-screen pb-24">
      {/* Top Header / Breadcrumb strip */}
      <div className="border-b border-amberfox/15 bg-noir-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-luxury text-amberfox uppercase">
            <button
              onClick={() => onNavigate('storefront')}
              className="hover:underline text-parchment-400 cursor-pointer"
            >
              ATELIER
            </button>
            <span className="text-parchment-600">/</span>
            <span className="text-parchment-400">SHOPPING &amp; ACCOUNT ACCESS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-2">
            Return to your terminal.
          </h1>
          <p className="text-xs text-parchment-400 font-mono mt-1">
            Account recovery / Request a link / Set a new password
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Private Guild Access Philosophy */}
          <div className="lg:col-span-4 bg-noir-900 hairline-border p-8 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                PRIVATE GUILD ACCESS
              </span>
              <h2 className="font-serif text-3xl uppercase tracking-wider text-parchment-100">
                A considered way back.
              </h2>
            </div>
            <p className="text-xs text-parchment-400 font-light leading-relaxed">
              Recover access with your registered email. Your orders, membership and ledger remain associated with the same member ID.
            </p>
            <div className="pt-4 border-t border-amberfox/15">
              <p className="text-[11px] text-parchment-400 leading-relaxed font-light">
                Never share a recovery link, password or UPI PIN. MoneyFox support does not need your password.
              </p>
            </div>
            <div className="pt-8 opacity-40">
              <img src={BRAND_ASSETS.sealEmblem} alt="MF Emblem" className="w-16 h-16 object-contain" />
            </div>
            <p className="text-[11px] font-mono text-amberfox-gold">support@moneyfox.luxury</p>
          </div>

          {/* Center Column: Interactive Request / Sent / Reset Stages */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stage Selector Pills (Allows testing all 3 stages from screenshot) */}
            <div className="flex items-center gap-2 p-1 bg-noir-900 hairline-border font-mono text-xs">
              <button
                type="button"
                onClick={() => setStage('request')}
                className={`px-3 py-1.5 transition-all ${
                  stage === 'request' ? 'bg-amberfox text-noir-950 font-bold' : 'text-parchment-400 hover:text-parchment-100'
                }`}
              >
                1. Request stage
              </button>
              <button
                type="button"
                onClick={() => setStage('sent')}
                className={`px-3 py-1.5 transition-all ${
                  stage === 'sent' ? 'bg-amberfox text-noir-950 font-bold' : 'text-parchment-400 hover:text-parchment-100'
                }`}
              >
                2. Sent-link state
              </button>
              <button
                type="button"
                onClick={() => setStage('reset')}
                className={`px-3 py-1.5 transition-all ${
                  stage === 'reset' ? 'bg-amberfox text-noir-950 font-bold' : 'text-parchment-400 hover:text-parchment-100'
                }`}
              >
                3. New-password state
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Box 1: Request or Sent Link */}
              {stage === 'request' && (
                <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                      REQUEST STAGE
                    </span>
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                      Forgot your password?
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                        Registered email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setStage('sent')}
                      className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury w-full flex items-center justify-center cursor-pointer shadow-amber-glow"
                    >
                      SEND RECOVERY LINK
                    </button>

                    <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                      If an account exists for this email, a reset link will be sent. This message does not reveal whether an account is registered.
                    </p>

                    <button
                      type="button"
                      onClick={onBackToLogin}
                      className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-300 hover:border-amberfox hover:text-amberfox flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK TO LOGIN</span>
                    </button>
                  </div>
                </div>
              )}

              {stage === 'sent' && (
                <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                      SENT-LINK STATE
                    </span>
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                      Check your inbox
                    </h3>
                    <div className="mt-2 inline-block bg-noir-950 text-amberfox-gold font-mono text-[10px] uppercase px-2.5 py-1 hairline-border">
                      Recovery requested
                    </div>
                  </div>

                  <p className="text-xs text-parchment-300 font-light leading-relaxed">
                    Check <strong className="text-amberfox-gold font-mono">{email}</strong> for recovery instructions if it is registered. Check spam, or request another link if needed.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStage('reset')}
                      className="hairline-border px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-amberfox hover:border-amberfox cursor-pointer"
                    >
                      Simulate Open Link →
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage('request')}
                      className="hairline-border px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-parchment-400 hover:border-amberfox hover:text-amberfox cursor-pointer"
                    >
                      USE ANOTHER EMAIL
                    </button>
                  </div>
                </div>
              )}

              {/* Box 2: New-Password State */}
              <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block mb-1">
                    NEW-PASSWORD STATE
                  </span>
                  <h3 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
                    Create a new access key
                  </h3>
                  <div className="mt-2 inline-block bg-noir-950 text-emerald-400 font-mono text-[10px] uppercase px-2.5 py-1 hairline-border border-emerald-500/30">
                    Recovery link opened
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    />
                    <p className="text-[10px] font-mono text-parchment-600 mt-1">
                      Use at least 12 characters and avoid reused passwords.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-luxury text-parchment-400 mb-1.5">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-noir-950 hairline-border p-3 text-xs font-mono text-parchment-100 focus:outline-none focus:border-amberfox"
                    />
                  </div>

                  {/* Passwords Match Box */}
                  <div className="p-3 bg-noir-950 hairline-border border-emerald-500/30 font-mono text-xs space-y-1">
                    <span className="text-emerald-400 font-semibold block">Passwords match</span>
                    <p className="text-[10px] text-parchment-400 font-light">
                      Your password is concealed. No plaintext password is shown in this design.
                    </p>
                  </div>

                  {resetSuccess ? (
                    <div className="p-3 bg-emerald-950/80 hairline-border border-emerald-500/40 text-emerald-300 font-mono text-xs">
                      Access key updated successfully. Return to login with your new credentials.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResetSuccess(true)}
                      className="btn-gold-sheen text-noir-950 px-6 py-3 text-xs font-bold uppercase tracking-luxury w-full flex items-center justify-center cursor-pointer shadow-amber-glow"
                    >
                      RESET PASSWORD
                    </button>
                  )}

                  <p className="text-[11px] text-parchment-400 font-light leading-relaxed">
                    After resetting, return to login with your new password. Other sessions can be reviewed in account settings.
                  </p>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-300 hover:border-amberfox hover:text-amberfox cursor-pointer w-full text-center"
                  >
                    RETURN TO LOGIN
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-parchment-600">
              These are distinct static stages of the same recovery journey; all states are fully interactive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
