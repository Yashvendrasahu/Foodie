import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  LayoutDashboard, PlusCircle, Utensils, ShoppingBag, BarChart3,
  Store, Settings, LogOut, Bell, HelpCircle, ShieldCheck, CheckCircle2,
  ChevronRight, Search
} from 'lucide-react';

export default function PartnerLayout({ children, activeTab = 'bookings' }) {
  const { navigate, switchRole } = useApp();

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[37px] z-30">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('partner-bookings')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                🍽️
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Foodie</span>
            </button>

            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider">
              PARTNER HUB
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-72 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings, token code #..."
              className="w-full bg-transparent focus:outline-hidden text-slate-700"
            />
          </div>

          {/* Right Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Support line for kitchen operators: 1800-FOODIE-HELP')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => alert('3 new orders received for tonight’s dinner batch.')}
              className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Restaurant Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center">
                SR
              </div>
              <div className="hidden sm:block text-left">
                <h5 className="font-bold text-xs text-slate-900 leading-tight">Sharma Restaurant</h5>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified Partner
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* Partner Sidebar */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between space-y-4">
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => navigate('partner-bookings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => navigate('partner-add-food')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'add-food' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-700 font-bold hover:bg-emerald-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              + Add Food
            </button>

            <button
              onClick={() => navigate('partner-bookings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'listings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Food Listings
            </button>

            <div className="pt-1">
              <button
                onClick={() => navigate('partner-bookings')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'bookings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Bookings
              </button>
              
              {/* Sub-item */}
              <button
                onClick={() => navigate('partner-booking-detail', { bookingId: 'FD-4827' })}
                className="w-full text-left pl-9 pr-3 py-1.5 text-[11px] text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
              >
                <span>↳</span>
                <span>Booking Details</span>
              </button>
            </div>

            <button
              onClick={() => navigate('partner-analytics')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'analytics' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>

            <button
              onClick={() => alert('Restaurant Profile: Sharma Restaurant & Banquets (FSSAI Lic #1001901100234)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-2.5 transition-colors"
            >
              <Store className="w-4 h-4" />
              Restaurant Profile
            </button>

            <button
              onClick={() => navigate('admin-settings')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-2.5 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                navigate('login');
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Partner Logout / Switch Role</span>
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* Footer Certifications */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap text-[11px]">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> FSSAI Verified Kitchen
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Safe Food Certified
            </span>
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              🍃 Food Waste Recovery Partner
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Guidelines</span>
            <span>Terms</span>
            <span>Privacy</span>
            <span>© 2024 Foodie Partner Hub</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
