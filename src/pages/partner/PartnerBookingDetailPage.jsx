import React from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  ArrowLeft, CheckCircle2, Clock, Phone, MapPin, QrCode,
  ShieldCheck, AlertCircle, Printer, Camera, Check, XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartnerBookingDetailPage() {
  const { selectedBookingId, bookings, markBookingHandedOver, markBookingReady, cancelBooking, navigate, showToast } = useApp();

  const booking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handleHandover = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    markBookingHandedOver(booking.id);
  };

  return (
    <PartnerLayout activeTab="bookings">
      <div className="space-y-6">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('partner-bookings')}
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Bookings
          </button>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {booking.status}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Booked {booking.placedTimestamp?.split(' ')[3] || '45 mins ago'}
            </span>
          </div>
        </div>

        {/* Header Title & ID */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking Details</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage live preparation status and counter handoff verification</p>
          </div>
        </div>

        {/* 4 Info Blocks Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booking Identifier</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">{booking.id}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placed Timestamp</span>
            <span className="text-xs font-bold text-slate-800 mt-1 block">{booking.placedTimestamp}</span>
            <span className="text-[10px] text-slate-400">Counter Slot: Dinner Service</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Settlement Method</span>
            <span className="text-sm font-extrabold text-emerald-700 mt-1 block">₹{booking.totalPaid}.00 Paid via UPI</span>
            <span className="text-[10px] text-slate-400">Ref: #UPI-982347102</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <div>
              <span className="text-xs font-bold text-amber-950 block">Awaiting Diner Counter Pickup</span>
              <span className="text-[10px] text-amber-800">Counter 2 (Takeaway Desk)</span>
            </div>
          </div>
        </div>

        {/* Order Lifecycle Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Order Life Cycle
            </h3>
            <span className="text-xs font-bold text-slate-400">
              Step {booking.lifecycleStep || 3} of 5 In Progress
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mx-auto">
                ✓
              </div>
              <h5 className="font-bold text-slate-900 text-[11px]">Booking Created</h5>
              <span className="text-[10px] text-slate-400 block">5:42 PM</span>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mx-auto">
                ✓
              </div>
              <h5 className="font-bold text-slate-900 text-[11px]">Confirmed</h5>
              <span className="text-[10px] text-slate-400 block">5:43 PM</span>
            </div>

            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ${
                booking.lifecycleStep >= 3 ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-slate-200 text-slate-500'
              }`}>
                🥡
              </div>
              <h5 className="font-bold text-amber-900 text-[11px]">Ready for Pickup</h5>
              <span className="text-[10px] text-amber-700 font-semibold block">Active • 6:00 PM</span>
            </div>

            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ${
                booking.lifecycleStep >= 4 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                👋
              </div>
              <h5 className="font-semibold text-slate-400 text-[11px]">Picked Up</h5>
              <span className="text-[10px] text-slate-400 block">Pending Handover</span>
            </div>

            <div className="space-y-1">
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ${
                booking.lifecycleStep === 5 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                🏁
              </div>
              <h5 className="font-semibold text-slate-400 text-[11px]">Completed</h5>
              <span className="text-[10px] text-slate-400 block">Review</span>
            </div>
          </div>
        </div>

        {/* Main 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Food & Customer Info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Food Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span className="text-base">🍴</span> Food Information
                </h3>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                  Kitchen Order
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img src={booking.image} alt={booking.mealTitle} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      ● PURE VEG CERTIFIED
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Meals</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900">{booking.mealTitle}</h4>
                  <p className="text-xs text-slate-500">{booking.subTitle}</p>

                  <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-700">
                    <span>Quantity: <strong className="text-emerald-700">{booking.portions} Portions</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700">🍃 Saved ~1.4kg CO2 surplus</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown list */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  What's in the Eco-Box (Per Portion):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">✓ Steamed Jeera Rice</div>
                  <div className="flex items-center gap-1.5">✓ Dal Tadka Double-tempered</div>
                  <div className="flex items-center gap-1.5">✓ 2x Tawa Rotis with Ghee</div>
                  <div className="flex items-center gap-1.5">✓ Paneer Butter Masala</div>
                  <div className="flex items-center gap-1.5">✓ Fresh Cucumber Koshimbir</div>
                  <div className="flex items-center gap-1.5">✓ Gulab Jamun (1 pc)</div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Price per portion</span>
                  <span className="font-semibold text-slate-900">₹59.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal ({booking.portions} portions)</span>
                  <span className="font-semibold text-slate-900">₹{booking.totalPaid}.00</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Surplus Rescue Discount (Original retail: ₹240)</span>
                  <span>-₹122.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Packaging & Bag Fee</span>
                  <span className="text-emerald-700 font-bold">₹0.00 (Waived)</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total Amount Collected</span>
                  <span className="font-extrabold text-xl text-emerald-700">₹{booking.totalPaid}.00</span>
                </div>
              </div>
            </div>

            {/* Customer & Counter Pickup Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" /> Customer & Counter Pickup Info
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Verified Rescuer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</span>
                  <h5 className="font-bold text-slate-900 text-sm">{booking.customerName}</h5>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-600">{booking.customerPhone}</span>
                    <button
                      onClick={() => alert(`Calling customer ${booking.customerName} (${booking.customerPhone})...`)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3 h-3" /> Call Customer
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Collection Point</span>
                  <h5 className="font-bold text-slate-900">Self Pickup (Takeaway Counter #2)</h5>
                  <p className="text-[11px] text-slate-500">Scheduled: 6:00 PM – 8:00 PM</p>
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pickup token expires in 1h 18m
                  </span>
                </div>
              </div>

              {/* Customer Special Request */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Customer Special Request</span>
                <p className="text-xs text-amber-950 italic">
                  "{booking.specialNote || 'Please pack the food separately and include extra spoons if possible. Thank you!'}"
                </p>
                <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Kitchen Acknowledgement: Eco-cutlery added</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Counter Verification & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Customer Pickup Token Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Counter Fulfillment</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">Customer Pickup Token</h4>
                <p className="text-[11px] text-slate-500">Scan or verify this unique token when diner arrives</p>
              </div>

              {/* Big Token Number */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">PIN / TOKEN #</span>
                <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
                  {booking.tokenCode}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  ✓ Matches Diner App Token
                </span>
              </div>

              {/* QR Scanner simulator */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <QrCode className="w-16 h-16 text-slate-700 mx-auto" />
                <button
                  onClick={() => handleHandover()}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Scan Diner QR with Webcam
                </button>
              </div>

              {/* Fast counter actions */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Fast Counter Actions</span>
                
                {booking.status !== 'Ready for Pickup' && (
                  <button
                    onClick={() => markBookingReady(booking.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Ready for Pickup
                  </button>
                )}

                {booking.status !== 'Completed' ? (
                  <button
                    onClick={handleHandover}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Completed (Handover Meal)
                  </button>
                ) : (
                  <div className="bg-emerald-100 text-emerald-900 font-bold text-xs py-2.5 rounded-xl">
                    ✓ Food Handed Over & Closed
                  </div>
                )}

                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="w-full text-rose-600 hover:bg-rose-50 text-xs font-bold py-2 rounded-xl transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>

            {/* Kitchen Handover Protocol Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-2 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kitchen Handover Protocol
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                <li>Match 4-digit token code <strong>{booking.tokenCode}</strong> on customer mobile.</li>
                <li>Ensure {booking.portions} separate trays are sealed with eco-friendly lids.</li>
                <li>Instant payout releases automatically once verified.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </PartnerLayout>
  );
}
