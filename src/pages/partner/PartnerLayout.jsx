import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  LayoutDashboard, PlusCircle, Utensils, ShoppingBag, BarChart3,
  Store, Settings, LogOut, Bell, HelpCircle, ShieldCheck, CheckCircle2,
  ChevronRight, Search, Menu, X, ArrowLeft
} from 'lucide-react';

export default function PartnerLayout({ children, activeTab = 'bookings' }) {
  const { navigate, switchRole, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: 'partner-dashboard' },
    { id: 'add-food', label: '+ Add Food Listing', icon: PlusCircle, route: 'partner-add-food', highlight: true },
    { id: 'listings', label: 'Food Listings', icon: Utensils, route: 'partner-food' },
    { id: 'bookings', label: 'Live Bookings', icon: ShoppingBag, route: 'partner-bookings' },
    { id: 'analytics', label: 'Analytics & Revenue', icon: BarChart3, route: 'partner-analytics' },
    { id: 'profile', label: 'Restaurant Profile', icon: Store, route: 'partner-profile' },
    { id: 'settings', label: 'Kitchen Settings', icon: Settings, route: 'admin-settings' },
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
              onClick={() => navigate('partner-dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                🍽️
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Foodie</span>
            </button>

            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider">
              PARTNER HUB
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
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-64 xl:w-72 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookings, token code #..."
              className="w-full bg-transparent focus:outline-hidden text-slate-700"
            />
          </div>

          {/* Right Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => showToast('Support line for kitchen operators: 1800-FOODIE-HELP (Toll-Free)', 'info')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => showToast('3 new orders received for tonight’s dinner batch.', 'info')}
              className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl p-5 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  🏪
                </div>
                <span className="font-extrabold text-base text-slate-900">Partner Hub</span>
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
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : item.highlight
                        ? 'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-600 hover:bg-slate-100'
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
                <span>Partner Logout / Switch Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* Partner Desktop Sidebar */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between space-y-4">
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : item.highlight
                      ? 'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
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
              <span>Partner Logout / Switch</span>
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
