import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import OpenStreetMap from '../../components/OpenStreetMap.jsx';
import RealQRCode from '../../components/RealQRCode.jsx';
import {
  CheckCircle2, Copy, Clock, AlertTriangle, MapPin, Phone,
  Navigation, XCircle, ShieldCheck, ChevronRight, Share2, Sparkles, Check
} from 'lucide-react';

export default function BookingConfirmedPage() {
  const { selectedBookingId, bookings, meals, userLocation, cancelBooking, navigate, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Timer countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 24, seconds: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const booking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];
  const associatedMeal = (meals || []).find((m) => m.id === booking.mealId || m.name === booking.mealTitle);
  const restaurantLat = associatedMeal?.lat || 22.7245;
  const restaurantLng = associatedMeal?.lng || 75.8640;

  const handleCopy = () => {
    navigator.clipboard?.writeText(booking.tokenCode || 'FD-4827');
    setCopied(true);
    showToast('Token code copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCancelOrder = () => {
    cancelBooking(booking.id);
    setShowCancelConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-24">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-3 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-2">
          <button onClick={() => navigate('home')} className="hover:text-emerald-700">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={() => navigate('dashboard')} className="hover:text-emerald-700">My Bookings</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-800">Booking Details ({booking.id})</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Confirmed Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your food has been successfully reserved. Show your digital token at the pickup counter.
          </p>

          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Order #{booking.id} is ready for tonight's pickup window</span>
          </div>
        </div>

        {/* Digital Pass / QR Voucher Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
          
          {/* Green Top Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 3a9 9 0 0 0-9 9v1h18v-1a9 9 0 0 0-9-9zm-1-2h2v2h-2V1zm-9 14h20v2H2v-2zm3 4h14v2H5v-2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-200 tracking-wider uppercase">Foodie Rescue Pass</p>
                <h3 className="text-sm font-extrabold">Pickup Token</h3>
              </div>
            </div>

            <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/40">
              ● Confirmed & Verified
            </span>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            
            {/* Token Code */}
            <div className="flex items-center justify-between bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pickup Token Code</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {booking.tokenCode}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy Token'}</span>
              </button>
            </div>

            {/* Real Dynamic QR Code Pass */}
            <div className="flex flex-col items-center justify-center py-2">
              <RealQRCode booking={booking} size={210} />

              <h4 className="font-extrabold text-sm text-slate-900 mt-3">Scan at Takeaway Counter</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Show this official scannable QR code or token <span className="font-mono font-bold text-slate-800">#{booking.tokenCode}</span> to the restaurant staff when collecting your food.
              </p>
            </div>

            {/* Dotted separator */}
            <div className="relative border-t-2 border-dashed border-slate-200 my-2">
              <div className="absolute -left-10 -top-3 w-6 h-6 bg-[#fafcfb] rounded-full" />
              <div className="absolute -right-10 -top-3 w-6 h-6 bg-[#fafcfb] rounded-full" />
            </div>

            {/* Countdown Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Pickup token expires in</span>
                <span className="bg-white px-2.5 py-1 rounded-md text-amber-900 font-mono font-extrabold text-sm shadow-xs border border-amber-200">
                  0{timeLeft.hours}h {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}m {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}s
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80">
                ⚠️ Please collect your order before the <strong>8:00 PM</strong> cutoff deadline. Unclaimed meals cannot be held after restaurant closing.
              </p>
            </div>

          </div>

        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Order Summary</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {booking.portions}x Items Reserved
            </span>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <img src={booking.image} alt={booking.mealTitle} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                ● Veg Thali Combo
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">{booking.mealTitle}</h4>
              <p className="text-xs text-slate-500 leading-tight">{booking.subTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Restaurant</span>
              <span className="font-bold text-xs text-slate-900 block mt-0.5">{booking.restaurantName}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid</span>
              <span className="font-extrabold text-sm text-emerald-700 block mt-0.5">
                ₹{booking.totalPaid} <span className="text-[11px] font-normal text-slate-500">• Paid via UPI • Eco Packaging Inc.</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booking Date</span>
              <span className="font-medium text-xs text-slate-700 block mt-0.5">{booking.bookingDate}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pickup Time Window</span>
              <span className="font-bold text-xs text-amber-800 block mt-0.5">{booking.pickupWindow}</span>
            </div>
          </div>
        </div>

        {/* Pickup Location Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Pickup Location
            </h3>
            <span className="text-xs text-slate-500">Navigate to dedicated Foodie counter</span>
          </div>

          {/* Live OpenStreetMap Interactive Route */}
          <OpenStreetMap
            singleLocation={{
              lat: restaurantLat,
              lng: restaurantLng,
              restaurant: booking.restaurantName,
              address: booking.restaurantAddress,
              pickupCounter: booking.pickupCounter
            }}
            userCoords={userLocation?.coords}
            zoom={15}
            height="260px"
          />

          {/* Address details */}
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-900">{booking.restaurantName}</h4>
            <p className="text-xs text-slate-600">{booking.restaurantAddress}</p>
            <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
              📍 {booking.pickupCounter}
            </div>
          </div>

          {/* Location Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation?.coords?.[0] || 22.72},${userLocation?.coords?.[1] || 75.86};${restaurantLat},${restaurantLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions (OpenStreetMap) ↗</span>
            </a>

            <button
              onClick={() => showToast('Calling Hotel Dispatch Desk: +91 98260 12345', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Contact (+91 98260 12345)</span>
            </button>

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold text-xs ml-auto hover:underline"
            >
              Cancel Booking
            </button>
          </div>
        </div>

        {/* Automatic Pickup Verification Notice */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="font-bold text-slate-900 text-xs">Automatic Pickup Verification</h5>
            <p className="text-slate-600 text-xs leading-relaxed">
              After successful pickup, the restaurant will scan this token and this booking will automatically move to your completed history. Thank you for rescuing good food!
            </p>
          </div>
        </div>

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">Cancel Booking?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel booking #{booking.id}? Your payment of ₹{booking.totalPaid} will be refunded to your original UPI account.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelOrder}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
