import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  LayoutDashboard, Users, Store, Utensils, ShoppingBag, CreditCard,
  BarChart3, MessageSquare, Settings, LogOut, Bell, Shield, Search,
  CheckCircle2, Menu, X, ArrowLeft, ExternalLink, Globe
} from 'lucide-react';

export default function AdminLayout({ children, activeTab = 'bookings' }) {
  const { navigate, switchRole, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: 'admin-dashboard' },
    { id: 'users', label: 'Users', icon: Users, route: 'admin-users' },
    { id: 'hotels', label: 'Hotels', icon: Store, route: 'admin-hotels' },
    { id: 'listings', label: 'Food Listings', icon: Utensils, route: 'admin-food' },
    { id: 'bookings', label: 'Bookings', icon: ShoppingBag, route: 'admin-bookings' },
    { id: 'payments', label: 'Payments', icon: CreditCard, route: 'admin-payments' },
    { id: 'reports', label: 'Reports', icon: BarChart3, route: 'admin-reports' },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, route: 'admin-complaints' },
    { id: 'settings', label: 'Settings', icon: Settings, route: 'admin-settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigate('admin-dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-sm">
                🍽️
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Foodie</span>
            </button>

            <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
              ADMIN
            </span>
          </div>

          {/* Quick Exit / Back to Customer App - Always Accessible */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                switchRole('diner');
                navigate('home');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition cursor-pointer"
              title="Return to Diner Storefront & Exploration"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Diner Storefront</span>
            </button>

            <button
              onClick={() => navigate('login')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Switch user role or log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-64 xl:w-80 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search listings, partners, reservations..."
              className="w-full bg-transparent focus:outline-hidden text-slate-700"
            />
          </div>

          {/* Right Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => showToast('All regional dispatch nodes running normally. 0 critical incidents.', 'info')}
              className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
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

      {/* Mobile Drawer Menu (Visible when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl p-5 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <span className="font-extrabold text-base text-slate-900">Admin Portal</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick exit button in mobile drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                switchRole('diner');
                navigate('home');
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Exit to Diner Storefront</span>
            </button>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(item.route);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors text-xs font-semibold ${
                      isActive ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('login');
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Admin Logout / Switch Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* Admin Desktop Sidebar */}
        <aside className="w-52 shrink-0 hidden md:flex flex-col justify-between space-y-4">
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                    isActive ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                switchRole('diner');
                navigate('home');
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Diner Store</span>
            </button>

            <button
              onClick={() => {
                navigate('login');
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout / Switch</span>
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
