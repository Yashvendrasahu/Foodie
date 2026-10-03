import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  LayoutDashboard, Users, Store, Utensils, ShoppingBag, CreditCard,
  BarChart3, MessageSquare, Settings, LogOut, Bell, Shield, Search,
  CheckCircle2
} from 'lucide-react';

export default function AdminLayout({ children, activeTab = 'bookings' }) {
  const { navigate, switchRole } = useApp();

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[37px] z-30">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('admin-bookings')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-sm">
                🍽️
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Foodie</span>
            </button>

            <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
              ADMIN
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-80 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search listings, partners, reservations..."
              className="w-full bg-transparent focus:outline-hidden text-slate-700"
            />
          </div>

          {/* Right Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('All regional dispatch nodes running normally.')}
              className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Admin Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                PA
              </div>
              <div className="hidden sm:block text-left">
                <h5 className="font-bold text-xs text-slate-900 leading-tight">Platform Admin</h5>
                <span className="text-[10px] text-slate-400 font-semibold">Superuser</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* Admin Sidebar */}
        <aside className="w-52 shrink-0 hidden md:flex flex-col justify-between space-y-4">
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => navigate('admin-bookings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => navigate('admin-users')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'users' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>

            <button
              onClick={() => navigate('admin-hotels')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'hotels' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              Hotels
            </button>

            <button
              onClick={() => navigate('admin-listings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'listings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Food Listings
            </button>

            <button
              onClick={() => navigate('admin-bookings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'bookings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Bookings
            </button>

            <button
              onClick={() => navigate('admin-payments')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'payments' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payments
            </button>

            <button
              onClick={() => navigate('admin-reports')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'reports' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>

            <button
              onClick={() => navigate('admin-complaints')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'complaints' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Complaints
            </button>

            <button
              onClick={() => navigate('admin-settings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'settings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
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
              <span>Admin Logout / Switch Role</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
