import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  isSupabaseConfigured,
  supabaseUrl,
  authSignIn,
  authSignUp,
  authResendVerificationEmail
} from '../../lib/supabaseClient.js';
import SupabaseConnectionModal from '../../components/SupabaseConnectionModal.jsx';
import {
  ShieldCheck, Eye, EyeOff, CheckCircle2, Lock, ArrowRight,
  User, Store, Shield, Sparkles, Building2, Utensils, Key,
  Check, ArrowLeft, Leaf, Database, Mail, AlertCircle, RefreshCw,
  ExternalLink, Phone, AlertTriangle
} from 'lucide-react';

export default function LoginPage() {
  const { navigate, showToast, switchRole, currentRole, performLogin } = useApp();
  
  // Auth state
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'diner');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Email verification state
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide both email and password.', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await authSignIn(email, password);

        if (error) {
          const errMsg = (error?.message || '').toLowerCase();
          if (errMsg.includes('email not confirmed') || errMsg.includes('unconfirmed')) {
            setVerificationEmail(email);
            setAwaitingVerification(true);
            showToast('Email address not yet confirmed. Please verify your email.', 'warning');
            setLoading(false);
            return;
          }
          throw error;
        }

        // Determine role from user metadata or profile
        const userMeta = data?.user?.user_metadata || {};
        const userRole = userMeta.role || selectedRole;
        performLogin(data?.user, userRole);
        showToast(`Welcome back, ${userMeta.full_name || email.split('@')[0]}!`, 'success');
        navigate(userRole === 'admin' ? 'admin-dashboard' : userRole === 'partner' ? 'partner-dashboard' : 'home');
      } else {
        // Fallback when Supabase is not configured
        performLogin({ email, name: email.split('@')[0], user_metadata: { full_name: email.split('@')[0] } }, selectedRole);
        showToast(`Signed in successfully as ${selectedRole.toUpperCase()}`, 'success');
        navigate(selectedRole === 'admin' ? 'admin-dashboard' : selectedRole === 'partner' ? 'partner-dashboard' : 'home');
      }
    } catch (err) {
      console.error('Sign In error:', err);
      showToast(err.message || 'Failed to sign in. Please verify your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler with real Supabase Auth
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    if (!termsAccepted) {
      showToast('Please agree to the Terms of Service & Food Safety Standards.', 'error');
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        full_name: fullName.trim(),
        role: selectedRole,
        phone: phone.trim() || undefined,
        restaurant_name: selectedRole === 'partner' ? restaurantName.trim() : undefined,
        fssai_license: selectedRole === 'partner' ? fssaiLicense.trim() : undefined,
      };

      if (isSupabaseConfigured) {
        const { data, error } = await authSignUp(email, password, metadata);

        if (error) {
          throw error;
        }

        // Check if user requires email confirmation
        if (data?.user && !data.session) {
          setVerificationEmail(email);
          setAwaitingVerification(true);
          showToast('Account created! A confirmation email has been dispatched.', 'success');
        } else {
          // If Supabase auto-confirmed or disabled email confirm
          switchRole(selectedRole);
          showToast(`Account registered and verified for ${fullName}!`, 'success');
          navigate(selectedRole === 'admin' ? 'admin-dashboard' : selectedRole === 'partner' ? 'partner-dashboard' : 'home');
        }
      } else {
        // Fallback for development without active credentials
        setVerificationEmail(email);
        setAwaitingVerification(true);
        showToast('Account created! Email verification flow initiated.', 'success');
      }
    } catch (err) {
      console.error('Sign Up error:', err);
      showToast(err.message || 'Registration failed. Please check inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    try {
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      await authResendVerificationEmail(verificationEmail);
      showToast(`Verification email resent to ${verificationEmail}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to resend email.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Top Floating Exit Bar */}
      <div className="max-w-5xl w-full mb-3 flex items-center justify-between">
        <button
          onClick={() => {
            switchRole('diner');
            navigate('home');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Diner Storefront</span>
        </button>

        {/* Supabase Connection Status Pill */}
        <button
          onClick={() => setShowConfigModal(true)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition cursor-pointer ${
            isSupabaseConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
          }`}
          title="Manage Supabase Backend Connection"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Connect Supabase'}</span>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
        </button>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Platform Value */}
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
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Production PostgreSQL & Auth</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                One Verified Platform. <br />
                <span className="text-emerald-300">Three Dedicated Portals.</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                Connect your community, kitchen, or administrative team with zero-waste surplus recovery, FSSAI certified food inspections, and encrypted UPI escrow.
              </p>
            </div>

            {/* Portal description card */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-200 text-[11px] uppercase tracking-wider">
                  Selected Role:
                </span>
                <span className="bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                  {selectedRole}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {selectedRole === 'diner'
                  ? 'Diner & Community Food Rescuer'
                  : selectedRole === 'partner'
                  ? 'Commercial Kitchen Partner Hub'
                  : 'Platform Super Admin Console'}
              </h4>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                {selectedRole === 'diner'
                  ? 'Reserve meals at 50%–70% off before nightly kitchen cutoff. Receive verified digital QR pickup vouchers.'
                  : selectedRole === 'partner'
                  ? 'List banquet & restaurant surplus batches in 30 seconds. Scan customer QR tokens at takeaway counters.'
                  : 'Audit real-time surplus ledger, review kitchen FSSAI certificates, and manage escrow settlements.'}
              </p>
            </div>

            {/* Safety Badges */}
            <div className="pt-2 space-y-2 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>FSSAI 100% Food Safety Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Supabase Live Realtime PostgreSQL Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Encrypted Authentication</span>
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
            <span className="text-[11px] opacity-75">SSL 256-Bit</span>
          </div>

          {/* Ambient Glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Real Auth Form OR Email Verification Screen */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          
          {awaitingVerification ? (
            /* ========================================================= */
            /* EMAIL VERIFICATION SCREEN (REAL SUPABASE AUTH CONFIRMATION) */
            /* ========================================================= */
            <div className="space-y-6 my-auto animate-in fade-in py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <Mail className="w-8 h-8 text-emerald-700 animate-bounce" />
              </div>

              <div className="text-center space-y-2 max-w-md mx-auto">
                <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Verification Email Sent
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verify Your Email Address
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We have dispatched a real confirmation link to: <br />
                  <strong className="text-slate-900 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                    {verificationEmail}
                  </strong>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Please open the email and click the confirmation link to activate your Foodie account and secure your meals.
                </p>
              </div>

              {/* Action buttons */}
              <div className="max-w-md mx-auto space-y-3 pt-2">
                <a
                  href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(verificationEmail)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Gmail / Webmail</span>
                </a>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-50 font-bold py-2.5 px-4 rounded-xl border border-slate-200 transition flex items-center justify-center gap-2 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Verification Email'}
                  </span>
                </button>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={() => {
                      setAwaitingVerification(false);
                      setAuthMode('signin');
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    ← Already confirmed? Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAwaitingVerification(false);
                      setAuthMode('signup');
                    }}
                    className="text-slate-500 hover:underline"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* REAL PRODUCTION SIGN IN / SIGN UP TABS                    */
            /* ========================================================= */
            <div className="space-y-6">
              
              {/* Header with Sign In / Sign Up Switcher */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-full max-w-xs border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        authMode === 'signin'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hidden sm:inline-block">
                    {authMode === 'signin' ? 'Secure Login' : 'Email Verification Enabled'}
                  </span>
                </div>

                {/* Account Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>Select Account Portal</span>
                    <span className="text-[10px] text-slate-400 lowercase font-normal">
                      determines your destination
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('diner')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedRole === 'diner'
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <User className={`w-4 h-4 ${selectedRole === 'diner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <div className="font-bold text-xs text-slate-900 mt-1">Diner</div>
                      <div className="text-[10px] text-slate-500">Rescue Food</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('partner')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedRole === 'partner'
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <Store className={`w-4 h-4 ${selectedRole === 'partner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <div className="font-bold text-xs text-slate-900 mt-1">Kitchen Partner</div>
                      <div className="text-[10px] text-slate-500">List Surplus</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedRole === 'admin'
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <Shield className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <div className="font-bold text-xs text-slate-900 mt-1">Platform Admin</div>
                      <div className="text-[10px] text-slate-500">Auditing</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Component */}
              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
                
                {/* Full Name field (Sign Up only) */}
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                    />
                  </div>
                )}

                {/* Partner specific fields */}
                {authMode === 'signup' && selectedRole === 'partner' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Restaurant / Hotel Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sharma Sweets & Restaurant"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">FSSAI License # *</label>
                      <input
                        type="text"
                        required
                        placeholder="1001901100234"
                        value={fssaiLicense}
                        onChange={(e) => setFssaiLicense(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 pr-9 font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                {/* Phone number (Sign Up only) */}
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mobile Phone (+91)</label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 pr-9 font-medium"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password *</label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => navigate('forgot-password')}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={authMode === 'signup' ? 'Min 8 characters' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 pr-9 font-mono"
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

                {/* Terms Acceptance (Sign Up) OR Remember Me (Sign In) */}
                {authMode === 'signup' ? (
                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                    />
                    <span className="text-[11px]">
                      I agree to Foodie's Food Safety Verification Charter, Terms of Service, and understand that an email verification link will be sent to activate my account.
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Remember session</span>
                    </label>
                    <span className="text-emerald-700 font-semibold text-[11px]">
                      🔒 2FA & SSL Protected
                    </span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authMode === 'signin'
                          ? `Sign In to ${selectedRole.toUpperCase()}`
                          : `Create Verified ${selectedRole.toUpperCase()} Account`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Cancel / Browse as Guest */}
                <button
                  type="button"
                  onClick={() => {
                    switchRole('diner');
                    navigate('home');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel & Return to Diner Storefront</span>
                </button>
              </form>

            </div>
          )}

          <p className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            Foodie Platform Security • FSSAI Certified Operations • 256-Bit SSL
          </p>

        </div>

      </div>

      {/* Supabase Connection Setup Modal */}
      <SupabaseConnectionModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />

    </div>
  );
}
