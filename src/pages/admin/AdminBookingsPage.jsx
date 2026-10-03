import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  ShoppingBag, Search, CheckCircle2, Clock, ShieldCheck,
  RefreshCw, Download, Printer, Phone, QrCode, AlertCircle,
  Check, XCircle, Send, Leaf, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminBookingsPage() {
  const { bookings, markBookingHandedOver, cancelBooking, showToast } = useApp();
  const [selectedBooking, setSelectedBooking] = useState(bookings[0]);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchFilter, setSearchFilter] = useState('');

  const handleForceRelease = (bookingId) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    markBookingHandedOver(bookingId);
    setSelectedBooking(prev => ({ ...prev, status: 'Completed', lifecycleStep: 5 }));
    showToast(`Escrow payout for booking #${bookingId} released manually by Super Admin.`, 'success');
  };

  const handleResendNotif = () => {
    showToast(`SMS & WhatsApp QR token re-dispatched to ${selectedBooking.customerPhone}`, 'info');
  };

  const handleCancelRefund = (bookingId) => {
    cancelBooking(bookingId);
    setSelectedBooking(prev => ({ ...prev, status: 'Cancelled', lifecycleStep: 0 }));
  };

  const filteredBookings = bookings.filter(b => {
    if (searchFilter && !b.id.toLowerCase().includes(searchFilter.toLowerCase()) && !b.customerName.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return b.status === 'Ready for Pickup' || b.status === 'Confirmed';
    if (activeTab === 'Completed') return b.status === 'Completed';
    if (activeTab === 'Expired') return b.status === 'Expired';
    return true;
  });

  return (
    <AdminLayout activeTab="bookings">
      <div className="space-y-6 pb-12">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Sync Active • Indore & Bhopal Dispatch Stream • HUB - MP - 04</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Booking Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor, track, and audit all surplus food reservations, digital tokens, and kitchen handovers in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => showToast('Syncing all regional hubs...', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Auto-Refresh (30s)
            </button>
            <button
              onClick={() => showToast('Exporting booking log (CSV)...', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export Log (.CSV)
            </button>
            <button
              onClick={() => window.print()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Audit Sheet
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings Today</span>
              <span className="text-sm">📋</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">2,418</div>
            <span className="text-[10px] text-emerald-700 font-semibold block">↗ +14.6% Across 68 partner kitchens</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Tonight</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">412</div>
            <span className="text-[10px] text-slate-500 block">Peak slot: 6:00 PM – 8:30 PM</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Handovers</span>
              <span className="text-emerald-700 font-bold">✓</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">1,942 <span className="text-xs text-slate-400 font-normal">96.2% success</span></div>
            <span className="text-[10px] text-slate-500 block">Avg counter release: 82 sec</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Cancelled / No-Shows</span>
              <span className="text-rose-500 font-bold">!</span>
            </div>
            <div className="text-2xl font-extrabold text-rose-600">64 <span className="text-xs text-slate-400 font-normal">2.6% attrition</span></div>
            <span className="text-[10px] text-slate-500 block">18 refunds auto-credited</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { name: 'All', label: 'All Bookings 2,418' },
            { name: 'Active', label: 'Active & Pickup Ready 412' },
            { name: 'Completed', label: 'Completed 1,942' },
            { name: 'Expired', label: 'Expired / Uncollected 42' }
          ].map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveTab(f.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === f.name ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Stream on Left, Detail Inspector on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Stream Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">Surplus Reservations Stream</span>
                <span className="text-[10px] text-slate-400">Showing {filteredBookings.length} records</span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                ● Escrow lock active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Token ID</th>
                    <th className="px-3 py-2.5">Diner & Tier</th>
                    <th className="px-3 py-2.5">Restaurant</th>
                    <th className="px-3 py-2.5">Surplus Item</th>
                    <th className="px-3 py-2.5">Total</th>
                    <th className="px-3 py-2.5">Window</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`cursor-pointer transition-colors ${
                        selectedBooking.id === b.id ? 'bg-emerald-50/80 font-medium' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="px-3 py-3">
                        <span className="font-bold text-slate-900 font-mono block">{b.tokenCode}</span>
                        <span className="text-[9px] text-emerald-700">✓ Token Verified</span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="font-bold text-slate-900 block">{b.customerName}</span>
                        <span className="text-[10px] text-slate-400">{b.customerPhone}</span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="font-medium text-slate-800 truncate block max-w-[120px]">{b.restaurantName}</span>
                        <span className="text-[10px] text-slate-400">{b.pickupCounter}</span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="font-bold text-slate-900 truncate block max-w-[120px]">{b.mealTitle}</span>
                        <span className="text-[10px] text-slate-500">{b.portions} portions</span>
                      </td>

                      <td className="px-3 py-3 font-extrabold text-slate-900">
                        ₹{b.totalPaid}
                        <span className="text-[9px] text-emerald-700 block font-normal">{b.paymentMethod}</span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="text-[10px] text-slate-600 block">{b.pickupWindow.split(',')[1] || b.pickupWindow}</span>
                        <span className="text-[10px] text-amber-700 font-bold">{b.expiresInText}</span>
                      </td>

                      <td className="px-3 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Ready for Pickup' ? 'bg-emerald-600 text-white' :
                          b.status === 'Confirmed' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Active Inspection Drawer */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 lg:sticky lg:top-28">
            
            {/* Header ID */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900 font-mono">{selectedBooking.id}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {selectedBooking.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Surplus Order Confirmed • Awaiting Pickup</p>
              </div>

              <button
                onClick={() => showToast('Dispatch log refreshed', 'info')}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* OTP & QR Pass */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode className="w-12 h-12 text-slate-800" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Counter Pickup OTP</span>
                  <span className="text-2xl font-extrabold text-emerald-700 font-mono tracking-wider">
                    {selectedBooking.otp || '824 - 910'}
                  </span>
                </div>
              </div>

              <div className="text-right text-[11px] text-amber-800 font-semibold">
                <span>⏱ Window ends in</span>
                <span className="block font-bold font-mono">01h 14m 20s</span>
              </div>
            </div>

            {/* Rescue Chain Progress */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rescue Chain Progress</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-emerald-800 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="font-bold">Surplus Reservation Placed</span>
                    <p className="text-[10px] text-slate-400">02 Oct, 5:42:10 PM • via Foodie Consumer App (v4.2.1)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-emerald-800 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="font-bold">Kitchen Accepted & Packed</span>
                    <p className="text-[10px] text-slate-400">02 Oct, 5:43:28 PM • Confirmed by Counter Station #2</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-amber-900 font-medium">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">●</span>
                  <div>
                    <span className="font-bold">Awaiting Diner at Counter</span>
                    <p className="text-[10px] text-amber-800">Staged in Thermal Safe Unit A-4 • Temp: 68°C verified</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div>
                    <span className="font-medium">Diner Token Handover</span>
                    <p className="text-[10px]">Pending physical counter validation</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                  <div>
                    <span className="font-medium">Escrow Funds Settlement</span>
                    <p className="text-[10px]">Auto-release ₹{selectedBooking.totalPaid - 20} net to restaurant account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diner Profile */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Diner Profile</span>
                <span className="text-[10px] font-bold text-emerald-700">18 rescued meals</span>
              </div>
              <h5 className="font-bold text-slate-900">{selectedBooking.customerName}</h5>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>{selectedBooking.customerPhone}</span>
                <span>•</span>
                <span>{selectedBooking.customerEmail}</span>
              </div>
              {selectedBooking.specialNote && (
                <p className="text-[10px] text-amber-900 italic pt-1 border-t border-slate-200/60">
                  "{selectedBooking.specialNote}"
                </p>
              )}
            </div>

            {/* Price Breakdown & Escrow */}
            <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>Regular Menu Total (2x Fresh Thali)</span>
                <span className="line-through text-slate-400">₹{selectedBooking.originalAmount}.00</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>Surplus Food Rescue Discount (-51%)</span>
                <span>-₹{selectedBooking.originalAmount - selectedBooking.totalPaid}.00</span>
              </div>
              <div className="flex items-center justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                <span>Net Diner Paid</span>
                <span className="text-emerald-700 text-base">₹{selectedBooking.totalPaid}.00</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Escrow Txn ID: UPI-IND-8829104</span>
                <span className="text-emerald-700 font-bold">100% Cleared</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleForceRelease(selectedBooking.id)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Force Complete & Release Payout
              </button>

              <button
                onClick={handleResendNotif}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                Resend SMS & WhatsApp Token
              </button>

              <button
                onClick={() => handleCancelRefund(selectedBooking.id)}
                className="w-full text-rose-600 hover:bg-rose-50 font-bold py-2 text-xs rounded-xl transition-colors"
              >
                Cancel Booking & Trigger UPI Refund
              </button>
            </div>

            {/* Impact Metric */}
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-950 block">3.8 kg CO2 Diverted</span>
                  <span className="text-[10px] text-emerald-700">Through this specific rescue token</span>
                </div>
              </div>
              <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                +12 EcoPts
              </span>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
