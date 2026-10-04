import React, { useState } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import RealQRScannerModal from '../../components/RealQRScannerModal.jsx';
import {
  QrCode, Search, CheckCircle2, Clock, Printer, Download,
  Camera, ArrowRight, AlertCircle, Phone, User, Check, Eye,
  Sparkles, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartnerBookingsPage() {
  const {
    bookings,
    markBookingHandedOver,
    markBookingReady,
    expireBooking,
    navigate,
    showToast,
    refreshFromSupabase,
    isSyncing,
    lastSyncedTime
  } = useApp();
  const [tokenInput, setTokenInput] = useState('FD-4827');
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [showScannerModal, setShowScannerModal] = useState(false);

  const handleVerify = (codeToVerify) => {
    const code = (codeToVerify || tokenInput).trim().toUpperCase();
    const found = bookings.find(b => b.tokenCode.toUpperCase() === code || b.id.toUpperCase() === code);
    if (found) {
      setVerifiedToken(found);
      showToast(`Token #${found.tokenCode} verified valid!`, 'success');
    } else {
      showToast(`Token #${code} not found or invalid.`, 'error');
    }
  };

  const handleHandover = (bookingId) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    markBookingHandedOver(bookingId);
    if (verifiedToken && verifiedToken.id === bookingId) {
      setVerifiedToken(prev => ({ ...prev, status: 'Completed', lifecycleStep: 5 }));
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return b.status === 'Confirmed';
    if (activeTab === 'Ready') return b.status === 'Ready for Pickup';
    if (activeTab === 'Completed') return b.status === 'Completed';
    if (activeTab === 'Expired') return b.status === 'Expired' || b.status === 'Cancelled';
    return true;
  });

  return (
    <PartnerLayout activeTab="bookings">
      <div className="space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">
              Dashboard &gt; <span className="text-emerald-700 font-bold">Bookings & Token Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Partner Bookings & Token Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly verify diner pickup tokens, scan QR vouchers in real time, and track tonight's meal handovers seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => refreshFromSupabase(true)}
              disabled={isSyncing}
              className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Refresh live orders from Supabase PostgreSQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
              {lastSyncedTime && <span className="text-[10px] text-slate-400 font-normal">({lastSyncedTime})</span>}
            </button>
            <button
              onClick={() => showToast('Exporting pickup roster (CSV)...', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Pickup Sheet (CSV)
            </button>
            <button
              onClick={() => window.print()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Daily Summary
            </button>
          </div>
        </div>

        {/* Section 1: Instant Token Verification Counter (Webcam Simulator & Manual Code) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Instant Token Verification Counter</h3>
                <p className="text-[11px] text-slate-500">Dual-mode verification for high-rush counter hours</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Kitchen Counter Cam #1 Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Real Camera QR Scanner Box */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-5 text-white relative flex flex-col items-center justify-center aspect-4/3 overflow-hidden group shadow-lg border border-slate-700">
              <div className="absolute top-3 left-3 bg-red-600/90 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>REALTIME WEBCAM SCANNER</span>
              </div>

              {/* Viewfinder Target */}
              <div
                onClick={() => setShowScannerModal(true)}
                className="w-44 h-44 border-2 border-emerald-400 rounded-3xl relative flex flex-col items-center justify-center p-3 cursor-pointer hover:border-emerald-300 hover:scale-102 transition shadow-inner bg-slate-950/60"
              >
                <div className="w-full h-full border border-dashed border-emerald-300/50 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Camera className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-300">Tap to Open Webcam</span>
                </div>
                {/* Laser scan line */}
                <div className="absolute top-2 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce" />
              </div>

              <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowScannerModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Open Real Camera Scanner</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVerify('FD-4827')}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                  title="Test verification with sample token"
                >
                  Quick Test Token (FD-4827)
                </button>
              </div>
            </div>

            {/* Right: Manual Token Lookup & Verification Card */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Lookup Form */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Manual Token Lookup</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">123</span>
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="e.g. FD-4827"
                      className="w-full text-xs font-mono font-bold p-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                  <button
                    onClick={() => handleVerify(tokenInput)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Verify & Handover
                  </button>
                </div>
              </div>

              {/* Verified Result Card */}
              {verifiedToken ? (
                <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Token {verifiedToken.tokenCode} Verified!</span>
                    </div>
                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      VALID TICKET
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized Diner</span>
                      <h5 className="font-extrabold text-slate-900 mt-0.5">{verifiedToken.customerName}</h5>
                      <span className="text-[10px] text-emerald-700 font-semibold">{verifiedToken.customerRescueTier}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reserved Meal</span>
                      <h5 className="font-bold text-slate-900 mt-0.5">{verifiedToken.mealTitle}</h5>
                      <span className="text-[10px] text-slate-500 font-medium">Quantity: {verifiedToken.portions} portions packed</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Settlement</span>
                      <h5 className="font-extrabold text-emerald-800 mt-0.5">₹{verifiedToken.totalPaid}.00</h5>
                      <span className="text-[10px] text-slate-500 font-medium">{verifiedToken.paymentMethod} • No Cash Due</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {verifiedToken.status !== 'Completed' ? (
                      <button
                        onClick={() => handleHandover(verifiedToken.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Confirm Food Handed Over
                      </button>
                    ) : (
                      <span className="bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl">
                        ✓ Order Handed Over & Settled
                      </span>
                    )}

                    <button
                      onClick={() => showToast(`Parcel receipt printed for token #${verifiedToken.tokenCode}`, 'success')}
                      className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print Parcel Slip</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
                  <p>Enter any Token ID above (e.g. <strong>FD-4827</strong> or <strong>FD-4828</strong>) or use the camera simulator to verify diners.</p>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Section 2: Bookings List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('All')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'All' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('Pending')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'Pending' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● Pending Pickup
              </button>
              <button
                onClick={() => setActiveTab('Ready')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'Ready' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● Ready at Counter
              </button>
              <button
                onClick={() => setActiveTab('Completed')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'Completed' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● Completed
              </button>
              <button
                onClick={() => setActiveTab('Expired')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'Expired' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● Expired / No-Show
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-3 py-1.5">
                <option>All Food Listings (All)</option>
                <option>Fresh Veg Thali</option>
                <option>Chicken Biryani</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-3 py-1.5">
                <option>Tonight 6:00 PM – 8:00 PM</option>
                <option>Tonight 8:00 PM – 10:00 PM</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] text-slate-400 uppercase font-bold border-y border-slate-100">
                <tr>
                  <th className="px-4 py-3">Token & ID</th>
                  <th className="px-4 py-3">Diner Info</th>
                  <th className="px-4 py-3">Ordered Surplus Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Pickup Window</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Token */}
                    <td className="px-4 py-3.5">
                      <span className="font-extrabold text-sm text-emerald-700 font-mono block">
                        {b.tokenCode}
                      </span>
                      <span className="text-[10px] text-slate-400">Booked at 4:45 PM</span>
                    </td>

                    {/* Diner */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                      <span className="text-[10px] text-emerald-700 font-medium">🌱 {b.customerRescueTier}</span>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{b.mealTitle}</span>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Qty: {b.portions}
                        </span>
                      </div>
                      {b.specialNote && (
                        <p className="text-[10px] text-amber-800 italic mt-0.5 line-clamp-1">
                          "{b.specialNote}"
                        </p>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">₹{b.totalPaid}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{b.paymentMethod}</div>
                    </td>

                    {/* Pickup Window */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-700">{b.pickupWindow}</div>
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {b.expiresInText}
                      </span>
                    </td>

                    {/* Fulfillment badge */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Ready for Pickup'
                          ? 'bg-emerald-600 text-white'
                          : b.status === 'Confirmed'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        ● {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {b.status === 'Ready for Pickup' && (
                        <button
                          onClick={() => handleHandover(b.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Handover Meal
                        </button>
                      )}

                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => markBookingReady(b.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Mark Ready
                        </button>
                      )}

                      {(b.status === 'Confirmed' || b.status === 'Ready for Pickup') && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Mark token #${b.tokenCode} as expired? ${b.portions} portion(s) will be restored to your surplus listing.`)) {
                              expireBooking(b.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Uncollected by customer - restore portions to inventory"
                        >
                          Expire
                        </button>
                      )}

                      <button
                        onClick={() => navigate('partner-booking-detail', { bookingId: b.id })}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Bottom 4 Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings Tonight</span>
            <div className="text-2xl font-extrabold text-slate-900">21 <span className="text-xs text-slate-400 font-normal">(46 total meals)</span></div>
            <span className="text-[11px] text-emerald-700 font-semibold block">↗ 100% capacity reserved</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Handovers</span>
            <div className="text-2xl font-extrabold text-slate-900">15 <span className="text-xs text-slate-400 font-normal">71.4% Rate</span></div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
              <div className="bg-emerald-600 h-1.5 rounded-full w-[71%]" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Disbursed Payout</span>
            <div className="text-2xl font-extrabold text-emerald-800">₹1,840 <span className="text-xs text-slate-400 font-normal">Gross</span></div>
            <span className="text-[10px] text-slate-400 block">Transfer to HDFC ending **4019 tonight</span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-900 uppercase">Partner Desk 24/7</span>
              <div className="text-sm font-extrabold text-emerald-950">1800-FOODIE-HELP</div>
              <p className="text-[10px] text-emerald-800/80">Assistance with no-shows or diner mismatches</p>
            </div>
            <button
              onClick={() => {
                navigate('admin-complaints');
                showToast('Opened Partner Support & Dispute Ticket Queue', 'info');
              }}
              className="text-xs font-bold text-emerald-800 underline text-left cursor-pointer"
            >
              Open Quick Dispute ↗
            </button>
          </div>
        </div>

        {/* Real Live Camera QR Scanner Modal */}
        <RealQRScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onSuccessHandover={(booking) => {
            setVerifiedToken(booking);
          }}
        />

      </div>
    </PartnerLayout>
  );
}
