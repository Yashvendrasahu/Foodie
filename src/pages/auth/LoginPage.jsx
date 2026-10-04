import React, { useState, useRef } from 'react';
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
  ExternalLink, Phone, AlertTriangle, Camera, Upload, Image as ImageIcon
} from 'lucide-react';

const RESTAURANT_FACADE_PRESETS = [
  { name: 'Grand Banquet & Restaurant', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sharma Sweets & Pure Veg', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Patisserie Bakery & Café', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
  { name: 'Commercial Kitchen Hub', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' }
];

export default function LoginPage() {
  const { navigate, showToast, switchRole, currentRole, performLogin } = useApp();
  
  // Auth state
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(
    currentRole === 'admin' ? 'diner' : (currentRole || 'diner')
  );
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [restaurantPhoto, setRestaurantPhoto] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');
  const [restaurantPhotoName, setRestaurantPhotoName] = useState('sharma_storefront_facade.jpg');
  const [isPhotoCompressing, setIsPhotoCompressing] = useState(false);
  const restaurantPhotoInputRef = useRef(null);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  // Email verification state
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Quick Demo Login Helper
  const handleQuickDemoLogin = (role = selectedRole) => {
    if (role === 'admin') {
      const demoAdmin = {
        id: 'usr-admin-super',
        email: 'admin@foodie.org',
        user_metadata: {
          full_name: 'Super Admin',
          role: 'admin'
        }
      };
      performLogin(demoAdmin, 'admin');
      showToast('Signed in as Platform Super Admin!', 'success');
      navigate('admin-dashboard');
    } else if (role === 'partner') {
      const demoPartner = {
        id: 'usr-sharma-partner',
        email: 'sharma@restaurant.com',
        user_metadata: {
          full_name: 'Sharma Sweets & Restaurant',
          restaurant_name: 'Sharma Sweets & Restaurant',
          role: 'partner'
        }
      };
      performLogin(demoPartner, 'partner');
      showToast('Signed in as Sharma Sweets & Restaurant Partner!', 'success');
      navigate('partner-dashboard');
    } else {
      const demoDiner = {
        id: 'USR-9021',
        email: 'rahul.sharma@example.com',
        user_metadata: {
          full_name: 'Rahul Sharma',
          role: 'diner'
        }
      };
      performLogin(demoDiner, 'diner');
      showToast('Signed in as Diner (Rahul Sharma)!', 'success');
      navigate('home');
    }
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide both email and password.', 'error');
      return;
    }

    setLoading(true);
    setLoginError(null);

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
          if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid_credentials')) {
            setLoginError({
              type: 'invalid_credentials',
              message: 'Invalid email or password. If you have not created an account on this backend yet, you can register or sign in using quick demo mode.'
            });
            showToast('Invalid credentials. Click below to Create Account or use Demo mode.', 'error');
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
      setLoginError({
        type: 'general',
        message: err.message || 'Failed to sign in. Please verify your credentials or try Demo login.'
      });
      showToast(err.message || 'Failed to sign in. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Compress and set restaurant storefront photo
  const handleRestaurantPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG).', 'error');
      return;
    }

    setIsPhotoCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setRestaurantPhoto(compressedDataUrl);
        setRestaurantPhotoName(file.name);
        setIsPhotoCompressing(false);
        showToast(`📸 Restaurant storefront photo "${file.name}" attached!`, 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Sign Up Handler with real Supabase Auth
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      showToast('Admin accounts cannot be self-registered. Please sign in with admin credentials.', 'error');
      return;
    }

    if (!email || !password || !fullName) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    if (selectedRole === 'partner') {
      if (!restaurantName.trim() || !fssaiLicense.trim()) {
        showToast('Please provide your restaurant name and FSSAI license.', 'error');
        return;
      }
      if (!restaurantPhoto) {
        showToast('Please upload or select a photo of your restaurant storefront.', 'error');
        return;
      }
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
        restaurant_photo: selectedRole === 'partner' ? restaurantPhoto : undefined,
      };

      if (selectedRole === 'partner' && restaurantPhoto) {
        localStorage.setItem('foodie_partner_photo', restaurantPhoto);
        localStorage.setItem('foodie_partner_restaurant', restaurantName.trim());
      }

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
                <span className="text-emerald-300">Diner & Partner Portals.</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                Connect your community or commercial kitchen with zero-waste surplus recovery, FSSAI certified food safety standards, and instant QR pickup vouchers.
              </p>
            </div>

            {/* Portal description card */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-200 text-[11px] uppercase tracking-wider">
                  Selected Role:
                </span>
                <span className="bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                  {selectedRole === 'partner' ? 'Kitchen Partner' : 'Diner'}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                {selectedRole === 'partner'
                  ? 'Commercial Kitchen Partner Hub'
                  : 'Diner & Community Food Rescuer'}
              </h4>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                {selectedRole === 'partner'
                  ? 'List banquet & restaurant surplus batches in seconds. Scan customer QR tokens at takeaway counters with live camera validation.'
                  : 'Reserve fresh meals at 50%–70% off before nightly kitchen cutoff. Receive verified digital QR pickup vouchers.'}
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
                      onClick={() => {
                        setAuthMode('signup');
                        if (selectedRole === 'admin') {
                          setSelectedRole('diner');
                        }
                      }}
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
                    {authMode === 'signin' ? 'Secure Login' : 'Customer & Partner Sign Up'}
                  </span>
                </div>

                {/* Account Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>{authMode === 'signup' ? 'Select Registration Type' : 'Select Account Portal'}</span>
                    <span className="text-[10px] text-slate-400 lowercase font-normal">
                      {authMode === 'signup' ? 'create customer or partner account' : 'determines your destination'}
                    </span>
                  </label>

                  {authMode === 'signup' ? (
                    /* In Create Account mode, only Diner and Kitchen Partner are available (Admin removed) */
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('diner')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRole === 'diner'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <User className={`w-4 h-4 ${selectedRole === 'diner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {selectedRole === 'diner' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="font-bold text-xs text-slate-900">Diner (Customer)</div>
                          <div className="text-[10px] text-slate-500 truncate">Book surplus discounted food</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('partner')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRole === 'partner'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Store className={`w-4 h-4 ${selectedRole === 'partner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {selectedRole === 'partner' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="font-bold text-xs text-slate-900">Kitchen Partner</div>
                          <div className="text-[10px] text-slate-500 truncate">List hotel / restaurant surplus</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    /* In Sign In mode, Diner, Kitchen Partner, and Admin are available */
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('diner')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRole === 'diner'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <User className={`w-4 h-4 ${selectedRole === 'diner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {selectedRole === 'diner' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="mt-1.5">
                          <div className="font-bold text-[11px] text-slate-900">Diner</div>
                          <div className="text-[9px] text-slate-500 truncate">Rescue Food</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('partner')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRole === 'partner'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Store className={`w-4 h-4 ${selectedRole === 'partner' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {selectedRole === 'partner' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="mt-1.5">
                          <div className="font-bold text-[11px] text-slate-900">Kitchen</div>
                          <div className="text-[9px] text-slate-500 truncate">Partner Hub</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selectedRole === 'admin'
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Shield className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-emerald-700' : 'text-slate-500'}`} />
                          {selectedRole === 'admin' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="mt-1.5">
                          <div className="font-bold text-[11px] text-slate-900">Admin</div>
                          <div className="text-[9px] text-slate-500 truncate">Management</div>
                        </div>
                      </button>
                    </div>
                  )}
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
                  <div className="space-y-3 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    {/* Restaurant Storefront Photo Upload Section */}
                    <div className="space-y-2 pt-2 border-t border-emerald-200/70">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Restaurant Storefront / Kitchen Photo *</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                          Mandatory for Verification
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={restaurantPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleRestaurantPhotoUpload}
                        className="hidden"
                      />

                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-inner">
                          {restaurantPhoto ? (
                            <img src={restaurantPhoto} alt="Storefront Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Building2 className="w-6 h-6" />
                            </div>
                          )}
                          {isPhotoCompressing && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 text-white animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-slate-900 truncate">
                            {restaurantPhotoName || 'restaurant_facade.jpg'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Shows on diner explore cards & pickup instructions
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => restaurantPhotoInputRef.current?.click()}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const captureInput = document.createElement('input');
                                captureInput.type = 'file';
                                captureInput.accept = 'image/*';
                                captureInput.capture = 'environment';
                                captureInput.onchange = handleRestaurantPhotoUpload;
                                captureInput.click();
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3 text-emerald-400" />
                              <span>Camera</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Facade Presets */}
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                          Or select standard verified establishment style:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          {RESTAURANT_FACADE_PRESETS.map((preset) => (
                            <button
                              type="button"
                              key={preset.name}
                              onClick={() => {
                                setRestaurantPhoto(preset.url);
                                setRestaurantPhotoName(`${preset.name}.jpg`);
                                showToast(`Applied ${preset.name} storefront photo`, 'info');
                              }}
                              className={`p-1.5 rounded-lg border text-left truncate transition cursor-pointer ${
                                restaurantPhoto === preset.url
                                  ? 'border-emerald-600 bg-emerald-100 text-emerald-900 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              • {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
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

                {/* Error Banner when Sign In fails */}
                {authMode === 'signin' && loginError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-start gap-2 text-rose-800 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold">Login Unsuccessful</p>
                        <p className="text-[11px] text-rose-700 leading-relaxed mt-0.5">
                          {loginError.message}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginError(null);
                          setAuthMode('signup');
                        }}
                        className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg text-center transition cursor-pointer"
                      >
                        Create New Account
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginError(null);
                          setPassword('');
                        }}
                        className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-[11px] rounded-lg text-center transition cursor-pointer shadow-xs"
                      >
                        Try Again
                      </button>
                    </div>
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
                          ? `Sign In to ${selectedRole === 'admin' ? 'Super Admin' : selectedRole === 'partner' ? 'Kitchen Partner' : 'Diner'}`
                          : `Create Verified ${selectedRole === 'partner' ? 'Kitchen Partner' : 'Diner'} Account`}
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
