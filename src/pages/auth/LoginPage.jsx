import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  ShieldCheck, Eye, EyeOff, CheckCircle2, Lock, ArrowRight,
  User, Store, Shield, Sparkles, Building2, Utensils, Key,
  Check, ArrowLeft, Leaf
} from 'lucide-react';

export default function LoginPage() {
  const { navigate, showToast, switchRole, currentRole } = useApp();
  const [selectedRole, setSelectedRole] = useState(currentRole || 'diner');
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'

  // Pre-configured role credentials
  const ROLE_CREDENTIALS = {
    diner: {
      email: 'rahul.sharma@example.com',
      name: 'Rahul Sharma',
      badge: 'Eco Hero • Level 3 Rescuer',
      headline: 'Diner & Community Rescuer',
      description: 'Discover surplus meals from nearby restaurants at up to 70% off.',
      destination: 'home',
      destinationLabel: 'Diner Storefront & Discovery'
    },
    partner: {
      email: 'sharma.sweets@foodie-partner.in',
      name: 'Sharma Pure Veg Restaurant',
      badge: 'Verified FSSAI Commercial Kitchen',
      headline: 'Commercial Kitchen Partner Hub',
      description: 'List surplus meal batches, manage counter pickups, and verify customer QR vouchers.',
      destination: 'partner-dashboard',
      destinationLabel: 'Partner Kitchen Dashboard'
    },
    admin: {
      email: 'admin@foodie-platform.com',
      name: 'Platform Operations Admin',
      badge: 'Super Admin Security Clearance',
      headline: 'Platform Master Operations',
      description: 'Audit master surplus food ledger, verify hotel licenses, and manage financial escrow.',
      destination: 'admin-dashboard',
      destinationLabel: 'Super Admin Executive Portal'
    }
  };

  const [email, setEmail] = useState(ROLE_CREDENTIALS[selectedRole]?.email || 'rahul.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Handle switching role tabs on the login screen
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(ROLE_CREDENTIALS[roleKey].email);
    setPassword('password123');
  };

  // Perform Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    performLogin(selectedRole);
  };

  const performLogin = (roleToLogin) => {
    switchRole(roleToLogin);
    const target = ROLE_CREDENTIALS[roleToLogin];
    showToast(`Logged in successfully as ${target.name} (${roleToLogin.toUpperCase()})`, 'success');
    navigate(target.destination);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Informative Brand & Role Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-6 relative z-10">
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Leaf className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">
                  Foodie
                </span>
                <span className="text-[10px] text-emerald-200 tracking-wider uppercase font-semibold">
                  Surplus Food Rescue Platform
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Role-Based Secure Gateway</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                One Platform. <br />
                <span className="text-emerald-300">Three Powerful Portals.</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                Log in to experience Foodie tailored specifically to your role: whether you're rescuing meals, managing kitchen operations, or auditing platform safety.
              </p>
            </div>

            {/* Dynamic Card based on Selected Role */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-200 text-[11px] uppercase tracking-wider">
                  Target Portal:
                </span>
                <span className="bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  {selectedRole.toUpperCase()}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {ROLE_CREDENTIALS[selectedRole].headline}
              </h4>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                {ROLE_CREDENTIALS[selectedRole].description}
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Redirects to: <strong>{ROLE_CREDENTIALS[selectedRole].destinationLabel}</strong></span>
              </div>
            </div>

            {/* Quick 1-Click Role Direct Logins */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-bold block">
                Instant 1-Click Demo Logins:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => performLogin('diner')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Diner: Rahul Sharma</span>
                  </span>
                  <span className="text-[10px] text-emerald-200 font-mono">1-Click &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => performLogin('partner')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-amber-300" />
                    <span>Partner: Sharma Restaurant</span>
                  </span>
                  <span className="text-[10px] text-amber-200 font-mono">1-Click &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => performLogin('admin')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-300" />
                    <span>Admin: Platform Operations</span>
                  </span>
                  <span className="text-[10px] text-purple-200 font-mono">1-Click &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-6 border-t border-emerald-700/50 flex items-center justify-between text-xs text-emerald-200 relative z-10">
            <button
              onClick={() => navigate('home')}
              className="hover:text-white flex items-center gap-1.5 transition font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <span className="text-[11px] opacity-75">100% Encrypted</span>
          </div>

          {/* Ambient Blur */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Step 1: Role Selection Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Choose Your Role to Log In</span>
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Role-Based Authentication
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Diner Role Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('diner')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    selectedRole === 'diner'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedRole === 'diner' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    {selectedRole === 'diner' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-2">Diner</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">Rescue food deals</p>
                </button>

                {/* Partner Role Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('partner')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    selectedRole === 'partner'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedRole === 'partner' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Store className="w-4 h-4" />
                    </div>
                    {selectedRole === 'partner' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-2">Restaurant</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">List surplus food</p>
                </button>

                {/* Super Admin Role Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    selectedRole === 'admin'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedRole === 'admin' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    {selectedRole === 'admin' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-2">Super Admin</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">Auditing & Ledger</p>
                </button>
              </div>
            </div>

            {/* Selected Role Badge Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Logging In As:</span>
                <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {ROLE_CREDENTIALS[selectedRole].name}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {ROLE_CREDENTIALS[selectedRole].badge}
              </span>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Email</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 pr-9 font-medium"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Security Password</label>
                  <button
                    type="button"
                    onClick={() => navigate('forgot-password')}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 pr-9 font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember session for 30 days</span>
                </label>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  2FA Protected
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <span>Login as {ROLE_CREDENTIALS[selectedRole].name.split(' ')[0]} ({selectedRole.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Help Text */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500">
                Tip: Choose any role above or click the 1-Click buttons to instantly switch between the Diner app, Restaurant Partner Hub, and Super Admin Portal.
              </p>
            </div>

          </div>

          <p className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            Foodie Platform Security • FSSAI Certified Operations • 256-Bit SSL
          </p>

        </div>

      </div>
    </div>
  );
}
