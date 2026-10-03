import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Utensils, Bell, ChevronDown, User, ShoppingBag, Heart, LogOut, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { currentView, navigate, dinerProfile, bookings, switchRole } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b => b.status === 'Ready for Pickup' || b.status === 'Confirmed').length;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand & Motto */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                {/* Cloche / Leaf icon */}
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 3a9 9 0 0 0-9 9v1h18v-1a9 9 0 0 0-9-9zm-1-2h2v2h-2V1zm-9 14h20v2H2v-2zm3 4h14v2H5v-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                  Foodie
                </span>
              </div>
            </button>

            {/* Pill */}
            <div className="hidden md:flex items-center bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/70">
              Good Food. Less Waste. Better Prices.
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigate('home')}
              className={`transition-colors hover:text-emerald-700 ${
                currentView === 'home' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('explore')}
              className={`transition-colors hover:text-emerald-700 ${
                currentView === 'explore' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Explore Food
            </button>
            <button
              onClick={() => {
                navigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="transition-colors hover:text-emerald-700"
            >
              How It Works
            </button>
            <button
              onClick={() => switchRole('partner')}
              className="transition-colors hover:text-emerald-700"
            >
              For Hotels
            </button>
            <button
              onClick={() => {
                navigate('home');
                setTimeout(() => {
                  document.getElementById('impact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="transition-colors hover:text-emerald-700"
            >
              Impact
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className={`transition-colors hover:text-emerald-700 flex items-center gap-1 ${
                currentView === 'dashboard' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              My Bookings
              {activeBookingsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('profile')}
              className={`transition-colors hover:text-emerald-700 ${
                currentView === 'profile' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('dashboard')}
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Avatar Badge */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  RS
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {dinerProfile.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Active Diner
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{dinerProfile.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{dinerProfile.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                      <Sparkles className="w-3 h-3" /> Level 3 Rescuer (15 Saved)
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      Diner Dashboard & Bookings
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Preferences
                    </button>
                    <button
                      onClick={() => {
                        navigate('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Switch Role via Login Screen
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        navigate('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role-Based Login Button */}
            <button
              onClick={() => navigate('login')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Login / Switch Role</span>
            </button>

            {/* Quick Explore / Get Started CTA */}
            <button
              onClick={() => navigate('explore')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all hover:shadow hidden sm:inline-flex items-center gap-1.5"
            >
              Get Started
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
