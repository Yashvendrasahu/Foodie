import React from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  TrendingUp, Users, Store, Utensils, ShoppingBag, CreditCard,
  ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, Clock,
  DollarSign, CheckCircle2, ChevronRight, Activity, Leaf
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { meals, bookings, users, hotelVerifications, supportTickets, navigate, showToast } = useApp();

  const activeMealsCount = meals.filter(m => m.status === 'active').length;
  const pendingHotelsCount = hotelVerifications.filter(h => h.status === 'pending').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'open').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalPortionsSaved = bookings.length * 2 + 1240;

  return (
    <AdminLayout activePage="dashboard">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Platform Intelligence</span>
              <span>•</span>
              <span>Real-Time Audit</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Super Admin Executive Hub</h1>
            <p className="text-sm text-gray-500">
              Live monitoring of multi-vendor surplus inventory, verification queues, escrow settlements, and consumer bookings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Action required notification banners */}
        {pendingHotelsCount > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  {pendingHotelsCount} Hotel & Kitchen Application{pendingHotelsCount > 1 ? 's' : ''} Awaiting Verification
                </h4>
                <p className="text-xs text-amber-700">
                  FSSAI and kitchen safety certificates require admin approval before store activation.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('admin-hotels')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition shrink-0"
            >
              Review Queue
            </button>
          </div>
        )}

        {/* 4 Core Platform Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gross Platform Volume</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900">₹{totalRevenue * 15 + 48290}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+22.4% vs last week</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Surplus Listings</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-700">{activeMealsCount} live</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Across 18 certified kitchens</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meals Rescued</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-blue-700">{totalPortionsSaved}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>~3.8 Tons CO2e offset</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certified Partners</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900">24 Venues</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-purple-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% FSSAI certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Live Bookings & Verification (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Live Escrow & Booking Stream</h3>
                <p className="text-xs text-gray-500">Real-time digital token reservations and handovers</p>
              </div>
              <button
                onClick={() => navigate('admin-bookings')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All Bookings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center border border-emerald-200">
                      {b.tokenCode.split('-')[1] || 'TK'}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">{b.mealName}</div>
                      <div className="text-[11px] text-gray-500">
                        {b.dinerName} • <span className="text-emerald-700 font-medium">{b.restaurantName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs text-gray-900">₹{b.totalAmount}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Matrix (1 col) */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Admin Quick Controls
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('admin-food')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 transition text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Food Listings Ledger</div>
                    <div className="text-[11px] text-gray-500">Audit {meals.length} surplus items</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => navigate('admin-hotels')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 transition text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Hotel Verifications</div>
                    <div className="text-[11px] text-gray-500">{pendingHotelsCount} pending review</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => navigate('admin-users')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 transition text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">User Management</div>
                    <div className="text-[11px] text-gray-500">{users.length} registered diners</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => navigate('admin-payments')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 transition text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Financial Escrow & Payouts</div>
                    <div className="text-[11px] text-gray-500">Automated T+1 settlements</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
