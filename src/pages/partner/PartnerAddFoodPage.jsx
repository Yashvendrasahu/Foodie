import React, { useState } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  PlusCircle, Upload, CheckCircle2, Clock, ShieldCheck, Leaf,
  Sparkles, Camera, ArrowLeft, Eye, Smartphone, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartnerAddFoodPage() {
  const { addNewSurplusListing, navigate, showToast } = useApp();

  // Form states matching screenshot 5
  const [foodName, setFoodName] = useState('Fresh Deluxe Veg Thali');
  const [category, setCategory] = useState('Meals & Thalis');
  const [dietary, setDietary] = useState('Pure Veg');
  const [description, setDescription] = useState(
    'Includes fresh steamed basmati rice, yellow dal tadka, 2 whole wheat rotis, paneer sabzi, and fresh salad. Prepared fresh during today\'s lunch banquet service, strictly temperature monitored and packaged in compostable compartmentalized meal trays.'
  );
  const [portions, setPortions] = useState(15);
  const [maxPerDiner, setMaxPerDiner] = useState('3 portions max');
  const [retailPrice, setRetailPrice] = useState(120);
  const [rescuePrice, setRescuePrice] = useState(59);
  const [startTime, setStartTime] = useState('06:00 PM');
  const [endTime, setEndTime] = useState('08:00 PM');
  const [counterGuidance, setCounterGuidance] = useState(
    'Please collect the food from Takeaway Counter #2 near the main reception desk. Show your Foodie digital token or QR code to staff member Rajat.'
  );
  const [safetyCertified, setSafetyCertified] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80');

  const discountPercent = Math.round(((retailPrice - rescuePrice) / retailPrice) * 100) || 51;
  const estimatedRevenue = rescuePrice * portions;
  const dinerSavings = retailPrice - rescuePrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!safetyCertified) {
      showToast('Please check the Kitchen Safety & Expiry Assurance certificate.', 'error');
      return;
    }

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 }
    });

    addNewSurplusListing({
      name: foodName,
      subTitle: 'Deluxe Veg Thali (Eco-Box)',
      category: category,
      dietary: dietary,
      description: description,
      portions: Number(portions),
      originalPrice: Number(retailPrice),
      rescuePrice: Number(rescuePrice),
      startTime: startTime,
      endTime: endTime,
      image: photoUrl,
      pickupCounter: 'Takeaway Counter #2'
    });
  };

  return (
    <PartnerLayout activeTab="add-food">
      <div className="space-y-6 pb-12">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Food Listings</span>
              <span>&gt;</span>
              <span className="text-emerald-700 font-bold">Add Surplus Food</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Add Surplus Food
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              List your safe surplus food and make it available to Foodie users at an affordable discount before kitchen closing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live System Sync
            </span>
            <button
              onClick={() => navigate('partner-bookings')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Form, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: 5 Steps */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Food Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Food Information</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Basic Metadata
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Food Name *</label>
                  <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Food Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-medium"
                    >
                      <option>Meals & Thalis</option>
                      <option>Biryani & Rice</option>
                      <option>Bowls & Curries</option>
                      <option>Bakery & Breads</option>
                      <option>Snacks & Starters</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Dietary Classification *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDietary('Pure Veg')}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                          dietary === 'Pure Veg' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Pure Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setDietary('Non-Veg')}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                          dietary === 'Non-Veg' ? 'bg-rose-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        Non-Veg
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Portion Description & Contents *</label>
                    <span className="text-[10px] text-slate-400">{description.length} / 500 characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-normal leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-700">Special Attributes & Compliance Tags</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Contains Dairy', 'Nut-Free', 'Eco-Packaging', 'FSSAI Certified'].map((tag) => (
                      <label key={tag} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 cursor-pointer">
                        <input type="checkbox" defaultChecked={tag !== 'Nut-Free'} className="rounded text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-[11px] font-medium text-slate-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Surplus Item Photography */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Surplus Item Photography</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ⚡ 3.5x higher bookings
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Current
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>thali_lunch_surplus_batch4.jpg</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">1.8 MB • High Resolution • Color Balanced</p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => alert('Photo updated with today’s banquet batch shot.')}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Change Photo
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80')}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Use Alternate Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Quantity & Pricing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Quantity & Pricing</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Surplus Economics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Available Surplus Portions *</label>
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPortions(Math.max(1, portions - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-sm hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-base text-slate-900">{portions}</span>
                    <button
                      type="button"
                      onClick={() => setPortions(portions + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-sm hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Packaged ready for dispatch</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Portions per Diner *</label>
                  <select
                    value={maxPerDiner}
                    onChange={(e) => setMaxPerDiner(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option>3 portions max</option>
                    <option>2 portions max</option>
                    <option>4 portions max</option>
                    <option>No limit</option>
                  </select>
                  <span className="text-[10px] text-slate-400">Prevents bulk hoard & promotes fair access</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Original Retail Dine-in Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(Number(e.target.value))}
                      className="w-full p-3 pl-7 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Normal menu price</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Foodie Rescue Price *</label>
                    <span className="text-[10px] text-emerald-700 font-bold">Min 40% OFF recommended</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={rescuePrice}
                      onChange={(e) => setRescuePrice(Number(e.target.value))}
                      className="w-full p-3 pl-7 bg-emerald-50/50 border border-emerald-300 rounded-xl font-extrabold text-emerald-800 text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">{discountPercent}% Discount applied</span>
                </div>
              </div>

              {/* Economics calculator card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs">
                    {discountPercent}% OFF
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Diner saves ₹{dinerSavings} per meal</h5>
                    <p className="text-[11px] text-slate-500">Quick turnaround expected within 45 mins</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Revenue</span>
                  <span className="text-xl font-extrabold text-emerald-800">₹{estimatedRevenue}</span>
                </div>
              </div>
            </div>

            {/* Step 4: Pickup Window & Instructions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Pickup Window & Instructions</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Logistics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pickup Date *</label>
                  <input
                    type="text"
                    defaultValue="Today, 02 Oct"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Time *</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Time (Cutoff) *</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Takeaway Counter & Staff Guidance *</label>
                <textarea
                  rows={2}
                  value={counterGuidance}
                  onChange={(e) => setCounterGuidance(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-normal"
                />
              </div>
            </div>

            {/* Step 5: Kitchen Safety & Expiry Assurance */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">Kitchen Safety & Expiry Assurance</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600 ml-auto" />
              </div>

              <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={safetyCertified}
                  onChange={(e) => setSafetyCertified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span className="leading-relaxed font-medium">
                  I certify this surplus food was prepared within the last 4 hours, meets FSSAI hygiene standards, and has been kept at safe holding temperatures.
                </span>
              </label>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>The listing will automatically turn inactive once the countdown reaches <strong>{endTime}</strong> or portions reach 0.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Publish Surplus Listing
              </button>

              <button
                type="button"
                onClick={() => showToast('Draft saved successfully.', 'info')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs transition-colors text-xs"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => navigate('partner-bookings')}
                className="text-slate-400 hover:text-slate-600 font-medium text-xs px-4 py-2"
              >
                Cancel
              </button>
            </div>

          </form>

          {/* Right Sidebar: Live Diner Preview (Mobile App Frame) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" /> Live Diner Preview
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Mobile App View
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              This is how your surplus meal card will appear in real-time to hungry diners searching within 3 km of your location.
            </p>

            {/* Mobile Device Frame */}
            <div className="bg-slate-900 rounded-[32px] p-3 shadow-2xl border-4 border-slate-800 max-w-[320px] mx-auto text-slate-900">
              
              {/* Phone Notch & Status */}
              <div className="flex items-center justify-between text-white text-[10px] font-bold px-3 py-1">
                <span>05:42 PM</span>
                <div className="flex items-center gap-1.5">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl overflow-hidden mt-2 shadow-inner">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                    <span className="bg-slate-900/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {portions} Left
                    </span>
                  </div>

                  <span className="absolute top-2 right-2 bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    ● {dietary}
                  </span>

                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-medium p-1 rounded flex items-center justify-between">
                    <span>⏱ Pickup Tonight • {startTime} – {endTime}</span>
                    <span>1.8 km</span>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">Sharma Restaurant & Banquets</span>
                    <span className="font-bold text-slate-800">★ 4.7 (184)</span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{foodName}</h4>

                  <div className="flex items-center gap-1 text-[9px] text-slate-500 flex-wrap">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Paneer</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Dal</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Rotis</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">🌿 Eco tray</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-emerald-700">₹{rescuePrice}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{retailPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      Reserve Meal ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* CO2e Impact Callout */}
              <div className="mt-3 bg-emerald-950/90 text-emerald-200 p-2.5 rounded-xl text-[10px] flex items-start gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">CO2e Impact</span>
                  <p className="opacity-80">Publishing this prevents ~{(portions * 2.5).toFixed(1)} kg of greenhouse emissions from food waste.</p>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 text-center py-2">
                🔒 Verified Foodie Merchant Sandbox Preview
              </div>
            </div>

          </div>

        </div>

      </div>
    </PartnerLayout>
  );
}
