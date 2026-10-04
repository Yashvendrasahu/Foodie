import React, { useState, useEffect, useRef } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Store, MapPin, Phone, Mail, Clock, ShieldCheck,
  CreditCard, Save, CheckCircle2, Building2, Upload,
  Camera, RotateCcw, AlertCircle, Sparkles, Check,
  BadgePercent, FileText, ArrowRight, UserCheck
} from 'lucide-react';

export default function PartnerProfilePage() {
  const { partnerProfile, updatePartnerProfile, authUser, showToast, meals } = useApp();

  const fileInputRef = useRef(null);

  // Form state initialized with partnerProfile from context
  const [form, setForm] = useState({
    name: '',
    type: '',
    owner: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    fssai: '',
    gstin: '',
    bankAccount: '',
    operatingHours: '',
    logo: '',
    pickupInstructions: '',
    autoAccept: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Sync state whenever partnerProfile updates or on mount
  useEffect(() => {
    if (partnerProfile) {
      setForm({
        name: partnerProfile.name || authUser?.user_metadata?.restaurant_name || 'Sharma Pure Veg Restaurant & Sweets',
        type: partnerProfile.type || 'Fine Dining / Pure Veg Thali & Sweets',
        owner: partnerProfile.owner || authUser?.user_metadata?.full_name || 'Satish Sharma',
        phone: partnerProfile.phone || authUser?.user_metadata?.phone || '+91 98765 43210',
        email: partnerProfile.email || authUser?.email || 'sharma.veg@foodie-partner.in',
        address: partnerProfile.address || authUser?.user_metadata?.address || 'Shop 12-14, Ground Floor, Heritage Square, MG Road',
        city: partnerProfile.city || 'Indore',
        fssai: partnerProfile.fssai || authUser?.user_metadata?.fssai_license || '11521034000128',
        gstin: partnerProfile.gstin || '27AABCS1429B1Z8',
        bankAccount: partnerProfile.bankAccount || 'HDFC0001289 - 5010048291039',
        operatingHours: partnerProfile.operatingHours || '11:00 AM - 11:30 PM (Daily)',
        logo: partnerProfile.logo || authUser?.user_metadata?.restaurant_photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        pickupInstructions: partnerProfile.pickupInstructions || 'Takeaway Counter #2 near main billing desk. Show digital token or QR code.',
        autoAccept: partnerProfile.autoAccept !== undefined ? partnerProfile.autoAccept : true
      });
    }
  }, [partnerProfile, authUser]);

  // Handle Photo / Storefront Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB. Please choose a smaller photo.', 'error');
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
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

        setForm(prev => ({ ...prev, logo: compressedDataUrl }));
        setIsUploadingPhoto(false);
        showToast('📸 Storefront photo updated! Click "Save Kitchen Profile" to persist.', 'info');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (partnerProfile) {
      setForm({
        name: partnerProfile.name || '',
        type: partnerProfile.type || '',
        owner: partnerProfile.owner || '',
        phone: partnerProfile.phone || '',
        email: partnerProfile.email || '',
        address: partnerProfile.address || '',
        city: partnerProfile.city || '',
        fssai: partnerProfile.fssai || '',
        gstin: partnerProfile.gstin || '',
        bankAccount: partnerProfile.bankAccount || '',
        operatingHours: partnerProfile.operatingHours || '',
        logo: partnerProfile.logo || '',
        pickupInstructions: partnerProfile.pickupInstructions || '',
        autoAccept: partnerProfile.autoAccept !== undefined ? partnerProfile.autoAccept : true
      });
      showToast('Form reset to saved profile data.', 'info');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Restaurant / Hotel Name is required.', 'error');
      return;
    }
    if (!form.phone.trim()) {
      showToast('Counter phone number is required for diner coordination.', 'error');
      return;
    }
    if (!form.address.trim()) {
      showToast('Physical pickup counter address is required.', 'error');
      return;
    }
    if (!form.fssai.trim()) {
      showToast('FSSAI license number is required by food safety regulations.', 'error');
      return;
    }

    setIsSaving(true);
    const success = await updatePartnerProfile(form);
    setIsSaving(false);

    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  // Count active partner listings
  const partnerMealsCount = meals.filter(
    m => (m.restaurant || '').toLowerCase().includes((form.name || '').toLowerCase()) || m.restaurantId === 'rest-sharma'
  ).length;

  return (
    <PartnerLayout activePage="profile">
      <div className="space-y-6 max-w-5xl pb-16">
        
        {/* Header Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <span>Partner Hub</span>
              <span>•</span>
              <span>Storefront Coordinates & Legal Info</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Restaurant & Commercial Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep your kitchen name, physical pickup instructions, FSSAI verification, and payout coordinates up to date.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All Changes Saved</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Storefront Hero Preview Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              
              {/* Logo / Storefront Photo */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-emerald-950/60 shadow-lg flex items-center justify-center">
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt={form.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-emerald-300" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl shadow-md transition cursor-pointer"
                  title="Upload Restaurant Storefront Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Title & Metadata */}
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> FSSAI Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-extrabold border border-teal-400/30">
                    Active Kitchen Seller
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {form.name || 'Your Commercial Kitchen Name'}
                </h2>
                <p className="text-emerald-200/90 text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{form.type || 'Fine Dining & Banquet Kitchen'}</span>
                </p>
                <p className="text-slate-300 text-[11px] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-md">{form.address || 'Address not specified'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex md:flex-col gap-3 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 w-full md:w-auto justify-around">
              <div className="text-center md:text-right">
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Live Inventory</span>
                <span className="text-lg sm:text-xl font-black text-white">{partnerMealsCount} items</span>
              </div>
              <div className="text-center md:text-right border-l md:border-l-0 md:border-t border-white/10 pl-3 md:pl-0 md:pt-2">
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Quality Rating</span>
                <span className="text-lg sm:text-xl font-black text-amber-300">4.9 ★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Basic Identity & Categorization */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Commercial Storefront Details</h3>
                  <p className="text-[11px] text-slate-500">This name and photo are visible to diners on listings and pickup tokens.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Public Facing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Restaurant / Commercial Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sharma Sweets & Pure Veg"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Cuisine & Kitchen Specialty *
                </label>
                <input
                  type="text"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="e.g. North Indian, Thalis, Artisan Bakery"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Storefront Photo / Logo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Daily Pickup & Operating Hours
                </label>
                <input
                  type="text"
                  value={form.operatingHours}
                  onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                  placeholder="e.g. 11:00 AM - 11:30 PM (Daily)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Person & Location Coordinates */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Pickup Location & Counter Guidance</h3>
                  <p className="text-[11px] text-slate-500">Provide exact directions so diners can easily reach your takeaway counter.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                Navigation & Pickup
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Authorized Manager / Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="e.g. Satish Sharma"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Counter Coordination Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Official Communication Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="partner@restaurant.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  City / Region
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Indore"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Complete Physical Pickup Address (Street, Building, Landmark) *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Shop 12-14, Ground Floor, Heritage Square, MG Road, Indore"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Counter Handover Instructions (Shown to Diner upon reservation)
                </label>
                <textarea
                  rows={2}
                  value={form.pickupInstructions}
                  onChange={(e) => setForm({ ...form, pickupInstructions: e.target.value })}
                  placeholder="e.g. Please collect from Takeaway Desk #2. Show your Foodie digital token code to manager Rajat."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Compliance & Escrow Payouts */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Compliance & Escrow Payout Coordinates</h3>
                  <p className="text-[11px] text-slate-500">Required for automated instant escrow settlements upon diner food handover.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Encrypted & Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  FSSAI Food Safety License # *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.fssai}
                    onChange={(e) => setForm({ ...form, fssai: e.target.value })}
                    placeholder="11521034000128"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  GSTIN Tax Registration Number
                </label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  placeholder="27AABCS1429B1Z8"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Escrow Payout Bank Account or Merchant UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={form.bankAccount}
                  onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                  placeholder="e.g. HDFC0001289 - 5010048291039 or sharmafoods@upi"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Daily revenue from collected orders is settled directly into this account within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All updates are synchronized immediately across Discovery & Storefront.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel / Reset
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Kitchen Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </PartnerLayout>
  );
}
