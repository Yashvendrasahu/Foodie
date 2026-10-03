import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, Leaf, CheckCircle2, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { navigate, showToast } = useApp();
  const [email, setEmail] = useState('rahul@example.com');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Password reset instructions sent to ${email}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] flex flex-col justify-between py-12 px-4 sm:px-6">
      
      {/* Top pill */}
      <div className="text-center">
        <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-200 uppercase tracking-wider">
          🍃 GOOD FOOD • LESS WASTE • BETTER PRICES
        </span>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 my-auto">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              🍽️
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Foodie Rescue</h4>
              <p className="text-[10px] text-slate-400">Account Security Portal</p>
            </div>
          </div>

          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Self-Service
          </span>
        </div>

        {!submitted ? (
          <>
            {/* Center Icon & Headline */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">
                Forgot your password?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Enter your registered email address and we'll send you a link to reset your password and rescue delicious meals.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Registered Email Address</label>
                  <span className="text-[10px] text-slate-400 font-medium">Step 1 of 2</span>
                </div>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. rahul@example.com"
                    className="w-full text-xs p-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>ℹ️</span>
                <span>We will send a 6-digit verification code or magic reset link.</span>
              </p>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Check Your Inbox!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We've sent a 6-digit reset PIN and recovery link to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => navigate('reset-password')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors w-full"
            >
              Enter New Password ↗
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium underline block mx-auto"
            >
              Didn't receive email? Resend code
            </button>
          </div>
        )}

        {/* State preview switcher */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>UI State Switcher</span>
          <button
            onClick={() => setSubmitted(!submitted)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {submitted ? 'Preview Form' : 'Preview Success Screen'}
          </button>
        </div>

      </div>

      {/* Footer stats */}
      <div className="max-w-md w-full mx-auto space-y-3 text-center text-xs text-slate-500">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-800">1.4M kg</span>
            <span className="text-[10px] text-slate-400">CO2e diverted</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center gap-2">
            <span className="text-sm">🥡</span>
            <span className="font-extrabold text-slate-800">820k+</span>
            <span className="text-[10px] text-slate-400">Meals rescued</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
          <span>🛡️ FSSAI & Safe Food Standards</span>
          <span>🔒 256-Bit SSL Protection</span>
        </div>

        <p className="text-[11px]">
          Lost access to your email account?{' '}
          <button onClick={() => navigate('admin-complaints')} className="text-emerald-700 font-bold hover:underline">
            Contact Diner Care Support ↗
          </button>
        </p>
      </div>

    </div>
  );
}
