import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Search, MapPin, Navigation, ArrowRight, ShieldCheck, Sparkles,
  Leaf, Clock, CheckCircle2, Flame, Utensils, Star, TrendingUp,
  SlidersHorizontal, ChevronRight, Heart
} from 'lucide-react';

export default function HeroSection() {
  const { navigate, switchRole, meals } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Downtown & Campus Area');
  const [selectedQuickTag, setSelectedQuickTag] = useState('All');
  const [isLocating, setIsLocating] = useState(false);

  const quickTags = [
    { label: 'All Surplus', icon: '✨' },
    { label: 'Pure Veg', icon: '🌱' },
    { label: 'Thalis & Meals', icon: '🍲' },
    { label: 'Biryani & Rice', icon: '🍚' },
    { label: 'Bakery & Sweets', icon: '🥐' },
    { label: 'Under ₹99', icon: '🏷️' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('explore');
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation('Current Location (Within 2.5 km)');
      setIsLocating(false);
    }, 600);
  };

  const featuredMeal = meals[0] || {
    name: 'Grand Hyatt Buffet Surplus',
    restaurantName: 'Grand Hyatt Luxury Kitchen',
    discountedPrice: 59,
    originalPrice: 180,
    discountPercent: 67,
    portionsLeft: 4,
    pickupTime: '8:30 PM - 9:45 PM',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 border-b border-emerald-100/60">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Value Proposition & Search Box */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            
            {/* Live Movement Badge */}
            <div className="inline-flex items-center gap-2.5 bg-emerald-100/80 border border-emerald-300/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-900 shadow-xs backdrop-blur-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="tracking-wide">#1 Food Rescue Community • Over 14,800+ Meals Saved</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] sm:leading-[1.12]">
              Rescue Delicious Food.{' '}
              <span className="block text-emerald-700 mt-1">
                Slash Food Waste.
              </span>
              <span className="text-gray-900 block text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800/90 mt-2">
                Save Up To <span className="underline decoration-amber-400 decoration-wavy underline-offset-4 text-emerald-800">70% Off Every Day</span>.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
              Connect directly with verified local hotels, bakeries, and restaurants to collect freshly prepared, premium surplus food before closing time. Pure goodness, guaranteed fresh, ultra affordable.
            </p>

            {/* High-Converting Responsive Interactive Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-200/90 hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Location Picker */}
                <div className="sm:col-span-5 relative flex items-center bg-gray-50 hover:bg-gray-100/80 rounded-xl px-3.5 py-2.5 transition border border-gray-200/70">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Pickup Area</span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter city or area..."
                      className="w-full text-xs font-semibold text-gray-800 bg-transparent focus:outline-hidden truncate"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    title="Detect My Location"
                    className="p-1 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>
                </div>

                {/* Food / Keyword Input */}
                <div className="sm:col-span-4 relative flex items-center bg-gray-50 hover:bg-gray-100/80 rounded-xl px-3.5 py-2.5 transition border border-gray-200/70">
                  <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Craving</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Thali, Biryani, Bakery..."
                      className="w-full text-xs font-semibold text-gray-800 bg-transparent focus:outline-hidden truncate"
                    />
                  </div>
                </div>

                {/* High-Impact CTA Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full h-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Find Food</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Quick Filter Tag Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
                <span className="text-gray-400 font-bold shrink-0 mr-1 hidden sm:inline">Popular:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSelectedQuickTag(tag.label);
                      navigate('explore');
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition flex items-center gap-1 cursor-pointer ${
                      selectedQuickTag === tag.label
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </form>

            {/* Dual CTA Secondary Route & Partner Portal */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => navigate('explore')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition hover:-translate-y-0.5"
              >
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span>Browse {meals.length}+ Live Surplus Deals</span>
              </button>

              <button
                onClick={() => switchRole('partner')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 shadow-xs hover:border-emerald-300 transition hover:-translate-y-0.5"
              >
                <span className="text-base">🏨</span>
                <span>Are You a Kitchen? List Surplus</span>
              </button>
            </div>

            {/* Live Trust & Verification Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span>4.9 / 5</span>
                <span className="text-gray-400 font-normal">(2,400+ local diners)</span>
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />

              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% FSSAI Safety Verified</span>
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block" />

              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <Leaf className="w-4 h-4 text-blue-600" />
                <span>Zero Slop • Eco-Packaging</span>
              </div>
            </div>

            {/* Urgent Live Inventory Ticker */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
                <span>
                  <strong>85 fresh meal boxes</strong> available tonight within 3 km of your location.
                </span>
              </div>
              <button
                onClick={() => navigate('explore')}
                className="font-bold text-amber-800 underline decoration-amber-500 shrink-0 hover:text-amber-950"
              >
                Grab Portion &rarr;
              </button>
            </div>

          </div>

          {/* Right Column: High-Converting Interactive Live Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Surplus Feast Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group hover:shadow-emerald-900/10 transition duration-300">
                
                {/* Hero Dish Image */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="Surplus Food Feast"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Discount Badge */}
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1 tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>UP TO 70% OFF</span>
                  </div>

                  {/* Live Urgency Status Pill */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Fresh Today</span>
                  </div>

                  {/* Inside Floating Info Banner */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>FSSAI Certified Commercial Kitchen</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Luxury Dinner Buffet Surplus</h3>
                    <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">
                      Assorted Paneer Gravy, Dal Makhani, Pulao & Artisan Breads
                    </p>
                  </div>
                </div>

                {/* Card Lower Bar & Quick Action */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-emerald-700">₹59</span>
                      <span className="text-xs text-gray-400 line-through font-semibold">₹180</span>
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded">
                        -67%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Pickup: 8:30 PM - 9:45 PM • 4 portions left</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate('meal-detail');
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>Rescue Meal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Floating Social Proof Mini-Card */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 items-center gap-3 max-w-xs animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0">
                  🌱
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">1,420 kg Food Rescued</div>
                  <div className="text-[10px] text-gray-500">Prevented 3.8 tons CO2 this month</div>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-emerald-200/50 rounded-full blur-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl -z-10" />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
