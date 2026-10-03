import React from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Utensils, PlusCircle, ShoppingBag, TrendingUp, Clock,
  CheckCircle2, ArrowRight, AlertCircle, Sparkles, QrCode,
  ShieldCheck, Leaf, Flame
} from 'lucide-react';

export default function PartnerDashboardPage() {
  const { meals, bookings, navigate, showToast } = useApp();

  const activeMeals = meals.filter(m => m.restaurantId === 'rest-sharma' && m.status === 'active');
  const partnerBookings = bookings.filter(b => b.restaurantName.includes('Sharma') || b.tokenCode);

  return (
    <PartnerLayout activePage="dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Commercial Partner • Sharma Pure Veg Restaurant</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Good Afternoon, Kitchen Staff!</h1>
              <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
                You have saved 28 meals today, cutting ₹4,890 in food waste while helping local diners access fresh surplus meals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('partner-add-food')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Surplus Food</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Surplus Items</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-black text-gray-900">{activeMeals.length}</div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Selling</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Bookings</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-black text-emerald-700">2</div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pickup Pending</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Revenue</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-black text-gray-900">₹1,940</div>
              <span className="text-xs font-bold text-emerald-600">+18%</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Rescued</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-black text-blue-700">142 meals</div>
              <span className="text-xs text-gray-400">This month</span>
            </div>
          </div>
        </div>

        {/* Action Center Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Listings Grid (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Your Live Surplus Food Listings</h3>
                <p className="text-xs text-gray-500">Currently visible to nearby diners in the app</p>
              </div>
              <button
                onClick={() => navigate('partner-food')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeMeals.slice(0, 3).map((meal) => (
                <div
                  key={meal.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 hover:bg-emerald-50/30 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{meal.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        {meal.portionsLeft} portions left • Pickup: {meal.pickupTime}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs text-emerald-700">₹{meal.discountedPrice}</div>
                    <span className="text-[10px] text-gray-400 line-through">₹{meal.originalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Scanner & Handover Widget (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Quick Pickup Token Desk</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Counter Ready
              </span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center space-y-3">
              <QrCode className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h4 className="font-bold text-sm text-gray-900">Diner Arrival at Counter?</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Verify digital token code or scan QR code to release food parcel securely.
                </p>
              </div>
              <button
                onClick={() => navigate('partner-bookings')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Open Token Verification Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
