import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import HeroSection from '../../components/HeroSection.jsx';
import {
  Search, MapPin, SlidersHorizontal, Sparkles, Clock, Navigation,
  ShieldCheck, Leaf, TrendingUp, Users, ArrowRight, Star, Quote,
  ChevronRight, CheckCircle2, Heart, Award, Map as MapIcon
} from 'lucide-react';

export default function HomePage() {
  const { meals, mealsWithDistance, navigate, switchRole } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', count: 140, icon: '🍽️' },
    { name: 'Meals & Thalis', count: 48, icon: '🍲' },
    { name: 'Biryani & Rice', count: 19, icon: '🍚' },
    { name: 'Bakery & Breads', count: 24, icon: '🥐' },
    { name: 'Bowls & Curries', count: 15, icon: '🥗' },
    { name: 'Snacks & Starters', count: 12, icon: '🥪' }
  ];

  const featuredMeals = (mealsWithDistance || meals).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafcfb]">
      
      {/* High-Converting Responsive Hero Component */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.name);
                navigate('explore');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeCategory === cat.name
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-80">({cat.count})</span>
            </button>
          ))}
        </div>

      </div>

      {/* Fresh Surplus Available Tonight / Affordable Food Near You */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Fresh Surplus Available Tonight
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Affordable Food Near You
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Prepared fresh by premium hotels and eateries today. Grab them before the pickup window closes.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button className="px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-semibold">
                Popular
              </button>
              <button onClick={() => navigate('explore')} className="px-3 py-1.5 hover:text-slate-900 transition-colors">
                Under ₹60
              </button>
              <button onClick={() => navigate('explore')} className="px-3 py-1.5 hover:text-slate-900 transition-colors">
                Ending Soon
              </button>
              <button onClick={() => navigate('explore')} className="px-3 py-1.5 hover:text-slate-900 transition-colors">
                Nearest
              </button>
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMeals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => navigate('meal-detail', { mealId: meal.id })}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image & Tags */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top discount & left count */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-amber-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      -{meal.discountPercent}%
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {meal.portionsLeft} left
                    </span>
                  </div>

                  {/* Distance badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>{meal.distance}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{meal.restaurant}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {meal.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Pickup {meal.pickupWindowStart || '6:00'} - {meal.pickupWindowEnd || '8:00'} PM</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-emerald-700">₹{meal.rescuePrice}</span>
                        <span className="text-xs text-slate-400 line-through">₹{meal.originalPrice}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('meal-detail', { mealId: meal.id });
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dinner Rescue Alerts Banner */}
          <div className="mt-10 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Never miss a dinner rescue near your place</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set up personalized instant notifications for your favorite hotel buffets & bakeries.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('profile')}
              className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Turn on Alerts
            </button>
          </div>

          {/* OpenStreetMap Discovery Card */}
          <div className="mt-6 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700/60">
                <MapIcon className="w-3.5 h-3.5" /> OpenStreetMap Integration
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Explore Real Surplus Food On Live Interactive Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                View verified commercial kitchen pickup points, distance radii, and live discount price tags across your neighborhood.
              </p>
            </div>

            <button
              onClick={() => navigate('explore')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Map Food Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* How Foodie Works */}
      <section id="how-it-works" className="py-20 bg-[#f4f8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              How Foodie Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Rescuing gourmet meals and saving your budget in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                  🛒
                </div>
                <span className="text-4xl font-extrabold text-slate-200 font-mono">01</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hotels List Surplus Food</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Top-tier hotels, buffet kitchens and restaurants assess daily safe surplus and post meal bundles at up to 70% off retail prices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Inspected freshness • Strict safety window</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                  📱
                </div>
                <span className="text-4xl font-extrabold text-slate-200 font-mono">02</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Users Book at Low Prices</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Students, bachelors, and budget-conscious foodies browse nearby deals, reserve their meal through the app, and pay securely.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Zero platform markups • Instant confirmation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                  🥡
                </div>
                <span className="text-4xl font-extrabold text-slate-200 font-mono">03</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pick Up Before Expiry</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Head to the hotel concierge or pickup counter during the designated pickup window, show your digital QR voucher, and enjoy fresh gourmet food.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Contactless QR show • Eco packaging</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Turn Surplus Food into Value (Partner CTA) */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Hotel & Restaurant Partnership
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Turn Surplus Food Into Value.
              </h2>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                List your safe surplus food, reduce kitchen waste, and earn back production costs from culinary meals that might otherwise go unused. Join over 75+ hospitality leaders already boosting their bottom line.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero upfront costs or setup fees</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enhance your ESG & green rating</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Reach 1,200+ local food fans</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated daily safety cutoffs</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => switchRole('partner')}
                  className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
                >
                  Join as a Hotel Partner
                </button>
                <button
                  onClick={() => showToast('Potential Recovery: For 40 daily meals, expected monthly net kitchen revenue is ₹42,000 to ₹75,000.', 'success')}
                  className="text-emerald-200 hover:text-white underline underline-offset-4 text-xs font-medium cursor-pointer"
                >
                  Calculate potential recovery (₹1,500 – ₹4,200/mo) ↗
                </button>
              </div>
            </div>

            {/* Right Card: Partner Stats Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-800 p-6 rounded-3xl shadow-2xl border border-white/20">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-lg">
                      🏨
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">The Grand Regal Hotel</h4>
                      <p className="text-[11px] text-slate-500">Monthly Sustainability Summary</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-5">
                  <div className="bg-slate-50 p-3.5 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Meals Rescued</span>
                    <span className="text-2xl font-extrabold text-emerald-700">420</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">this month</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Waste Diverted</span>
                    <span className="text-2xl font-extrabold text-amber-600">210 kg</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">organic food</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recovered Revenue</span>
                    <span className="text-2xl font-extrabold text-slate-900">₹2,840</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">+14% vs last month</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Diner Rating</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900">5.0</span>
                      <span className="text-amber-500 text-sm">★</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">from 184 reviews</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Estimated CO2 avoided: <strong>525 kg</strong>
                  </span>
                  <button onClick={() => switchRole('partner')} className="text-emerald-700 font-bold hover:underline">
                    Full Report
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Impact Section */}
      <section id="impact-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Our Collective Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Every Meal Rescued Makes a Difference
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Together with our partner hotels and community, we are proving that good food belongs on tables, not in waste bins.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">2,500+</div>
              <div className="text-sm font-bold text-slate-800 mt-1">Meals Rescued</div>
              <p className="text-xs text-slate-500 mt-1">
                Preventing over 1.8 tons of greenhouse gas CO2 equivalent emissions.
              </p>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                🍽️
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">850+</div>
              <div className="text-sm font-bold text-slate-800 mt-1">Daily Food Listings</div>
              <p className="text-xs text-slate-500 mt-1">
                Daily batches spanning gourmet breakfast, lunch, and dinner services.
              </p>
            </div>

            <div className="bg-sky-50/50 p-6 rounded-3xl border border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                🏨
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">75+</div>
              <div className="text-sm font-bold text-slate-800 mt-1">Partner Hotels</div>
              <p className="text-xs text-slate-500 mt-1">
                From boutique bakery cafes to 5-star international hotel kitchens.
              </p>
            </div>

            <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                👥
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">1,200+</div>
              <div className="text-sm font-bold text-slate-800 mt-1">Happy Diners</div>
              <p className="text-xs text-slate-500 mt-1">
                Students, professionals & families saving an average of ₹180/month.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 relative">
              <Quote className="w-8 h-8 text-slate-300 absolute top-6 right-6" />
              <p className="text-sm text-slate-700 italic leading-relaxed pr-10">
                "As a university student on a tight budget, Foodie lets me eat delicious restaurant meals for ₹49–₹65 instead of instant noodles every night."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Priya M.</h5>
                  <p className="text-[11px] text-slate-500">Master's Student at State University</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 relative">
              <Quote className="w-8 h-8 text-slate-300 absolute top-6 right-6" />
              <p className="text-sm text-slate-700 italic leading-relaxed pr-10">
                "Our hotel kitchen used to discard dozens of untouched buffet portions every evening. Now they feed local neighbors and we cover packaging costs."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  MV
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Chef Marcus V.</h5>
                  <p className="text-[11px] text-slate-500">Executive Chef at Hyatt Regency</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Ready to Taste Good Food CTA */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Taste Good Food <br />
            and Stop Food Waste?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Download the app or explore tonight's available surplus boxes in your neighborhood right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('explore')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Find Food Near You
            </button>
            <button
              onClick={() => switchRole('partner')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 rounded-xl border border-slate-300 shadow-xs transition-all text-sm"
            >
              Register Your Kitchen
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
