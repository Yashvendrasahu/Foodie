import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import OpenStreetMap from '../../components/OpenStreetMap.jsx';
import {
  Clock, MapPin, ShieldCheck, Leaf, CheckCircle2, ChevronRight,
  Sparkles, AlertCircle, ShoppingBag, Plus, Minus, ArrowRight,
  Navigation, Utensils, Award, Lock, User, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MealDetailPage() {
  const {
    selectedMealId,
    meals,
    bookMeal,
    navigate,
    userLocation,
    isLoggedIn,
    authUser,
    showToast,
    performLogin
  } = useApp();
  const [portions, setPortions] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const meal = meals.find((m) => m.id === selectedMealId) || meals[0];

  const subtotal = meal.rescuePrice * portions;
  const packagingFee = 5;
  const wasteCredit = -5;
  const totalAmount = subtotal + packagingFee + wasteCredit;
  const savings = (meal.originalPrice * portions) - totalAmount;

  const handleBooking = () => {
    // Strict authentication check: Unauthenticated users CANNOT book
    if (!isLoggedIn || !authUser) {
      showToast('Bina login ke booking nahi ho sakti. Kripya pehle login kariye.', 'error');
      setShowLoginModal(true);
      return;
    }

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    bookMeal(meal, portions, specialNote);
  };

  const handleQuickLoginAndBook = () => {
    const demoDiner = {
      id: 'USR-9021',
      email: 'rahul.sharma@example.com',
      user_metadata: {
        full_name: 'Rahul Sharma',
        role: 'diner'
      }
    };
    performLogin(demoDiner, 'diner');
    showToast('Signed in as Rahul Sharma (Diner)! Processing your reservation...', 'success');
    setShowLoginModal(false);
    setTimeout(() => {
      bookMeal(meal, portions, specialNote);
    }, 200);
  };

  const otherMeals = meals.filter((m) => m.id !== meal.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <button onClick={() => navigate('home')} className="hover:text-emerald-700">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={() => navigate('explore')} className="hover:text-emerald-700">Explore Food</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-800">{meal.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Image Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 aspect-16/10">
              <img
                src={meal.gallery?.[activePhotoIdx] || meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm">
                  -{meal.discountPercent}% OFF
                </span>
                <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  100% {meal.dietary}
                </span>
              </div>

              {/* Portions left */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <span>⚡</span>
                <span>Only {meal.portionsLeft} portions left</span>
              </div>

              {/* Bottom tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6 rounded-b-2xl">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" /> Verified Fresh Today (Lunch Surplus)
                </span>
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px]">
                  ECO TRAY INCLUDED
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {meal.gallery && meal.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {meal.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative rounded-2xl overflow-hidden aspect-16/9 border-2 transition-all ${
                      activePhotoIdx === idx ? 'border-emerald-600 scale-[1.02] shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                      {idx === 0 ? 'Dal & Rice' : idx === 1 ? 'Curry & Roti' : 'Packaging'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Safe Food Rescue Guarantee */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-slate-700">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-xs">Safe Food Rescue Guarantee</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {meal.cookTime || 'Surplus prepared fresh by hotel chefs today at 1:30 PM, strictly temperature controlled and packaged in food-grade biodegradable sugarcane pulp containers.'}
                </p>
              </div>
            </div>

            {/* Restaurant & Title info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Partner: {meal.restaurant}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <span className="text-amber-500">★</span>
                  <span>{meal.rating}</span>
                  <span className="text-slate-400 font-normal">({meal.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  {meal.distance} • Near City College Metro
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                {meal.name}
              </h1>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {meal.description}
              </p>
            </div>

            {/* Pickup Windows Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Pickup Window
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {meal.pickupWindow || 'Today: 6:00 PM – 8:00 PM'}
                </div>
                <div className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {meal.windowStatus || 'Window opens in 1 hr 20 mins'}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Point
                </div>
                <div className="text-base font-extrabold text-slate-900 truncate">
                  {meal.pickupCounter || 'Counter 2 (Takeaway Desk)'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {meal.restaurant}, MG Road
                </div>
              </div>
            </div>

            {/* What's Inside This Meal Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">What's Inside This Meal Box</h3>
                  <p className="text-xs text-slate-500">Carefully packed in partitioned compostable meal trays</p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Total wt: ~650g
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meal.contents?.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 text-xs shrink-0">
                      🍽️
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center">
                    SR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-base text-slate-900">{meal.restaurant}</h4>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">North Indian & Banqueting Cuisine • Est. 2012</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/80 w-fit">
                  FSSAI Lic #{meal.fssaiLic || '1001901100234'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Family-owned North Indian restaurant renowned for hygienic and wholesome vegetarian meals. Proud Foodie partner since 2023, committed to zero-landfill kitchen operations by rescuing gourmet daily surplus.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50/60 p-3 rounded-2xl text-center">
                  <div className="text-sm font-extrabold text-emerald-800">1,420+</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Meals Rescued</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <div className="text-sm font-extrabold text-slate-900">380 kg</div>
                  <div className="text-[10px] text-slate-500 font-medium">CO2 Abated</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <div className="text-sm font-extrabold text-slate-900">4.7 / 5</div>
                  <div className="text-[10px] text-slate-500 font-medium">Hygiene Rating</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">{meal.restaurantAddress}</span>
                <button onClick={() => navigate('explore')} className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 cursor-pointer">
                  View All Partner Dishes ↗
                </button>
              </div>
            </div>

            {/* Interactive OpenStreetMap Pickup Location Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="font-extrabold text-base text-slate-900">
                      Pickup Location on OpenStreetMap
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Navigate directly to the verified restaurant counter to collect your meal
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    📍 {meal.pickupCounter || 'Counter #1'}
                  </span>
                </div>
              </div>

              {/* Map embed */}
              <OpenStreetMap
                singleLocation={{
                  lat: meal.lat || 22.7245,
                  lng: meal.lng || 75.8640,
                  restaurant: meal.restaurant,
                  address: meal.restaurantAddress,
                  pickupCounter: meal.pickupCounter,
                  price: meal.rescuePrice
                }}
                userCoords={userLocation?.coords}
                zoom={15}
                height="320px"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Pickup Bay: <b>{meal.pickupCounter || 'Takeaway Counter #1'}</b> • {meal.restaurantAddress}
                  </span>
                </div>

                <a
                  href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation?.coords?.[0] || 22.72},${userLocation?.coords?.[1] || 75.86};${meal.lat || 22.7245},${meal.lng || 75.8640}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Open Directions</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Important Surplus Pickup Guidelines */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-950">Important Surplus Pickup Guidelines</h5>
                <p className="text-amber-800/90 leading-relaxed mt-0.5">
                  Please collect your order within the specified pickup time (6:00 PM – 8:00 PM). Unclaimed bookings expire automatically to maintain strict food hygiene standards. Present your Foodie digital booking voucher or QR code at Counter 2 upon arrival.
                </p>
              </div>
            </div>

            {/* You May Also Like Section */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Rescue More Food Tonight</span>
                  <h3 className="text-lg font-extrabold text-slate-900">You May Also Like</h3>
                </div>
                <button onClick={() => navigate('explore')} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                  Browse all nearby offers <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {otherMeals.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate('meal-detail', { mealId: item.id });
                    }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                        -{item.discountPercent}%
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-slate-400 truncate">{item.restaurant}</p>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-xs font-extrabold text-emerald-700">₹{item.rescuePrice}</span>
                        <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">+</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            
            {/* Main Reservation Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
              
              {/* Header Pricing */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">₹{meal.rescuePrice}</span>
                    <span className="text-sm text-slate-400 line-through">₹{meal.originalPrice}</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    🎉 You save ₹{meal.originalPrice - meal.rescuePrice} on this meal
                  </p>
                </div>

                <div className="bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                  {meal.discountPercent}% OFF
                </div>
              </div>

              {/* Portion Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Select Portions</span>
                  <span className="text-slate-400 font-medium">Max 4 per customer</span>
                </div>

                {meal.portionsLeft === 0 ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-center text-xs font-bold">
                    ⚠️ All portions have been reserved. Sold out!
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setPortions(Math.max(1, portions - 1))}
                      disabled={portions <= 1}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-base text-slate-900">
                      {portions} portion{portions > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setPortions(Math.min(4, Math.min(meal.portionsLeft, portions + 1)))}
                      disabled={portions >= 4 || portions >= meal.portionsLeft}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {meal.portionsLeft > 0 ? (
                    <span>Real-time availability: <strong>{meal.portionsLeft} portions</strong> remaining</span>
                  ) : (
                    <span className="text-rose-600 font-bold">Sold Out for tonight</span>
                  )}
                </div>
              </div>

              {/* Special Note Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Special pickup note (optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Please pack cutlery / extra tissues"
                  value={specialNote}
                  disabled={meal.portionsLeft === 0}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 disabled:opacity-50"
                />
              </div>

              {/* Bill Breakdown */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Meal Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Compostable Packing</span>
                  <span className="font-semibold text-slate-900">₹{packagingFee}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Food Waste Recovery Credit
                  </span>
                  <span>-₹5</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total Amount</span>
                  <span className="font-extrabold text-2xl text-emerald-700">₹{totalAmount}</span>
                </div>
              </div>

              {/* Surplus Marketplace Disclaimer */}
              <div className="bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] p-2.5 rounded-xl flex items-center gap-2">
                <span className="text-base">🛍️</span>
                <span><strong>Self-Pickup Only:</strong> Collect from restaurant counter before closing. No delivery.</span>
              </div>

              {/* Login Requirement Banner if user is not logged in */}
              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span>Booking ke liye Login zaroori hai</span>
                      <span className="text-[10px] bg-amber-200/70 px-2 py-0.5 rounded font-extrabold uppercase">Required</span>
                    </div>
                    <p className="text-amber-800 mt-0.5 text-[11px] leading-relaxed">
                      Bina login ke food reserve nahi ho sakta. Kripya pehle apne account me login karein.
                    </p>
                  </div>
                </div>
              )}

              {/* Reserve Now / Login Required Button */}
              <button
                onClick={handleBooking}
                disabled={meal.portionsLeft === 0}
                className={`w-full font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                  meal.portionsLeft === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : !isLoggedIn
                    ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white hover:shadow-xl cursor-pointer'
                    : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white hover:shadow-xl cursor-pointer'
                }`}
              >
                {meal.portionsLeft === 0 ? (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sold Out - No Portions Available</span>
                  </>
                ) : !isLoggedIn ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pehle Login Karein to Reserve (₹{totalAmount})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Reserve {portions} Portion{portions > 1 ? 's' : ''} (₹{totalAmount})</span>
                  </>
                )}
              </button>

              {/* Guarantees list */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free cancellation up to 30 mins before pickup</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant QR voucher sent to your phone</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pickup only • Closes strictly at 8:00 PM</span>
                </div>
              </div>

              {/* Takeaway counter address bar */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    🏨
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">MG Road Sector 4</h5>
                    <p className="text-[10px] text-slate-500">Counter 2 Takeaway Desk</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Directions loaded: ${meal.restaurantAddress}`, 'info')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Directions
                </button>
              </div>

            </div>

            {/* Environmental Impact Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-emerald-950">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Your Impact with this Meal</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed text-xs">
                  Rescuing this portion prevents <strong>{(meal.co2SavedKg * portions).toFixed(1)} kg</strong> of CO2 equivalent emissions and saves <strong>{meal.waterSavedL * portions}L</strong> of agricultural water.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-amber-200">
                <Lock className="w-7 h-7 text-amber-700" />
              </div>
              <span className="inline-block bg-amber-50 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                Authentication Required
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Pehle Login Kariye
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Surplus food reservation confirm karne aur apna digital pickup token/QR code paane ke liye account me login hona zaroori hai.
              </p>
            </div>

            {/* Order Summary Snapshot */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Reserving Item:</span>
                <span className="font-bold text-slate-800 truncate max-w-[180px]">{meal.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Portions & Total:</span>
                <span className="font-bold text-emerald-800">{portions} portion(s) • ₹{totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('login', { returnMealId: meal.id });
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span>Sign In / Create Account with Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickLoginAndBook}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-700" />
                <span>⚡ Quick Login as Rahul Sharma (Demo Diner) & Confirm</span>
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold text-center hover:underline cursor-pointer"
              >
                Continue Browsing as Guest
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
