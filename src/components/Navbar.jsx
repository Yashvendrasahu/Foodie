import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Utensils, User, ShoppingBag, LogOut, Menu, X, ArrowRight, ChevronDown, CheckCircle
} from 'lucide-react';

export default function Navbar() {
  const { currentView, navigate, dinerProfile, bookings, isLoggedIn, authUser, currentRole, switchRole, performLogout } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeBookingsCount = bookings.filter(
    b => b.status === 'Ready for Pickup' || b.status === 'Confirmed'
  ).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = authUser?.user_metadata?.full_name || dinerProfile?.name || 'Rahul Sharma';
  const displayEmail = authUser?.email || dinerProfile?.email || 'rahul@example.com';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
              Foodie
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => navigate('home')}
              className={`transition-colors hover:text-emerald-700 cursor-pointer ${
                currentView === 'home' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('explore')}
              className={`transition-colors hover:text-emerald-700 cursor-pointer ${
                currentView === 'explore' ? 'text-emerald-700 font-bold' : ''
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
              className="transition-colors hover:text-emerald-700 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                navigate('home');
                setTimeout(() => {
                  document.getElementById('impact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="transition-colors hover:text-emerald-700 cursor-pointer"
            >
              Impact
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => navigate('login')}
                className="transition-colors hover:text-emerald-700 cursor-pointer text-slate-600"
              >
                For Partners & Admin
              </button>
            ) : currentRole === 'partner' ? (
              <button
                onClick={() => navigate('partner-dashboard')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Return to Partner Hub</span>
              </button>
            ) : currentRole === 'admin' ? (
              <button
                onClick={() => navigate('admin-dashboard')}
                className="bg-emerald-800 text-white hover:bg-emerald-900 px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Return to Admin Panel</span>
              </button>
            ) : null}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Role indicator button if in partner/admin role */}
                {currentRole === 'partner' && (
                  <button
                    onClick={() => navigate('partner-dashboard')}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 cursor-pointer hover:bg-emerald-100"
                  >
                    <span>Partner Hub</span>
                  </button>
                )}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => navigate('admin-dashboard')}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-800 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-900"
                  >
                    <span>Admin Hub</span>
                  </button>
                )}

                {/* My Bookings Quick Link */}
                <button
                  onClick={() => navigate('dashboard')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>My Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {initials}
                    </div>
                    <span className="hidden md:block text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                            {currentRole}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
                      </div>

                      <div className="py-1">
                        {currentRole === 'partner' && (
                          <button
                            onClick={() => {
                              navigate('partner-dashboard');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                          >
                            <span>🏢 Open Partner Dashboard</span>
                          </button>
                        )}
                        {currentRole === 'admin' && (
                          <button
                            onClick={() => {
                              navigate('admin-dashboard');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                          >
                            <span>🛡️ Open Admin Dashboard</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            navigate('dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Account & Settings</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            performLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest State: Clean Sign In & Explore */}
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('explore')}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all hover:shadow hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Meals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1 font-semibold text-sm text-slate-700">
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-left ${currentView === 'home' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50'}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('explore');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-left ${currentView === 'explore' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50'}`}
            >
              Explore Surplus Food
            </button>
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('impact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50"
            >
              Our Impact
            </button>
            <button
              onClick={() => {
                navigate('login');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 text-slate-600"
            >
              For Partners & Restaurants
            </button>

            {isLoggedIn ? (
              <>
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => {
                      navigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>My Bookings</span>
                    {activeBookingsCount > 0 && (
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {activeBookingsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left hover:bg-slate-50"
                  >
                    Account Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      performLogout();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-rose-600 hover:bg-rose-50 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-center font-bold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('explore');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-center font-bold hover:bg-emerald-700"
                >
                  Explore Meals
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
