import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Clock, MapPin, ShieldCheck, Leaf, CheckCircle2, ChevronRight,
  Sparkles, AlertCircle, ShoppingBag, Plus, Minus, ArrowRight,
  Navigation, Utensils, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MealDetailPage() {
  const { selectedMealId, meals, bookMeal, navigate } = useApp();
  const [portions, setPortions] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const meal = meals.find((m) => m.id === selectedMealId) || meals[0];

  const subtotal = meal.rescuePrice * portions;
  const packagingFee = 5;
  const wasteCredit = -5;
  const totalAmount = subtotal + packagingFee + wasteCredit;
  const savings = (meal.originalPrice * portions) - totalAmount;

  const handleBooking = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    bookMeal(meal, portions, specialNote);
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
                <button onClick={() => navigate('explore')} className="text-emerald-700 font-bold hover:underline shrink-0 ml-2">
                  View All Partner Dishes ↗
                </button>
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

                <div className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> High demand: {meal.portionsLeft} portions remaining tonight
                </div>
              </div>

              {/* Special Note Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Special pickup note (optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Please pack cutlery / extra tissues"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
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

              {/* Book Now Button */}
              <button
                onClick={handleBooking}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Book Now for Pickup
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
                  onClick={() => alert(`Directions to ${meal.restaurantAddress}`)}
                  className="text-emerald-700 font-bold hover:underline"
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

    </div>
  );
}
