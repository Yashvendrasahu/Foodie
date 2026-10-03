import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Search, Home, Compass, WifiOff, ShoppingBag, UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function SystemStatesPage() {
  const { navigate } = useApp();
  const [activeState, setActiveState] = useState('404'); // '404', 'no-food', 'no-bookings', 'offline'

  return (
    <div className="min-h-screen bg-[#fafcfb] py-10 px-4 sm:px-6 flex flex-col justify-between">
      
      {/* Top Prototype State Switcher */}
      <div className="max-w-xl mx-auto w-full bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 px-2">
          <span>⚙️</span>
          <span>System Feedback Showcase</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveState('404')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeState === '404' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            404 Lost
          </button>
          <button
            onClick={() => setActiveState('no-food')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeState === 'no-food' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍽️ No Food
          </button>
          <button
            onClick={() => setActiveState('no-bookings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeState === 'no-bookings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛍️ No Bookings
          </button>
          <button
            onClick={() => setActiveState('offline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeState === 'offline' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📡 Offline
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 my-auto">
        
        {activeState === '404' && (
          <>
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Error 404 / Lost in Kitchen
            </span>

            {/* Cartoon Box Illustration */}
            <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
              <div className="text-6xl animate-bounce">📦</div>
              <span className="absolute -top-1 -right-1 text-2xl">🌱</span>
              <span className="absolute -bottom-1 -left-1 text-2xl">✨</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900">Oops! Page Not Found</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                The meal or kitchen parcel you're seeking has already been rescued, never existed, or was moved to another counter.
              </p>
            </div>

            {/* Quick Search inside 404 */}
            <div className="max-w-md mx-auto flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search bakery, café, or dish..."
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden"
              />
              <button
                onClick={() => navigate('explore')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('home')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
              <button
                onClick={() => navigate('explore')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Explore Nearby Food
              </button>
            </div>

            <div className="pt-4 text-xs text-slate-400 flex items-center justify-center gap-3 flex-wrap">
              <span>Popular rescues:</span>
              <button onClick={() => navigate('explore')} className="text-emerald-700 font-bold hover:underline">Pastry Bags</button>
              <span>•</span>
              <button onClick={() => navigate('explore')} className="text-emerald-700 font-bold hover:underline">Dinner Buffets</button>
              <span>•</span>
              <button onClick={() => navigate('explore')} className="text-emerald-700 font-bold hover:underline">Produce Boxes</button>
            </div>
          </>
        )}

        {activeState === 'no-food' && (
          <>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              🍽️ State 02: No Food in Area
            </span>

            <div className="text-6xl my-4">🥣</div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">All Surplus Rescued Tonight!</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Great news for the planet: all meals in this 3 km radius have been claimed. Partner kitchens post new night batches around 8:00 PM.
              </p>
            </div>

            <button
              onClick={() => navigate('explore')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
            >
              Expand Search Radius to 10 km
            </button>
          </>
        )}

        {activeState === 'no-bookings' && (
          <>
            <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">
              🛍️ State 03: No Bookings Yet
            </span>

            <div className="text-6xl my-4">🎒</div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Your Rescue Bag is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                You haven't reserved any surplus meals for tonight. Explore delicious boxes from ₹49 onwards.
              </p>
            </div>

            <button
              onClick={() => navigate('explore')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
            >
              Browse Today's Meals ↗
            </button>
          </>
        )}

        {activeState === 'offline' && (
          <>
            <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
              📡 State 04: Offline & Disconnected
            </span>

            <div className="text-6xl my-4">📶</div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">You're Currently Offline</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Network connection unavailable. Don't worry, your active pickup QR codes and token #FD-4827 are saved offline for counter validation.
              </p>
            </div>

            <button
              onClick={() => navigate('booking-confirmed', { bookingId: 'FD-4827' })}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
            >
              Open Cached QR Voucher
            </button>
          </>
        )}

      </div>

      {/* State Cards Grid */}
      <div className="max-w-4xl mx-auto w-full mt-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explore All System States</h4>
          <span className="text-[11px] text-slate-400">Click any card to activate preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveState('no-food')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs cursor-pointer space-y-2 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">STATE 02</span>
              <span>🍽️</span>
            </div>
            <h5 className="font-bold text-sm text-slate-900">No Food in Area</h5>
            <p className="text-[11px] text-slate-500 leading-tight">Empty state for when all neighborhood rescue dishes are sold out.</p>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
              View State <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveState('no-bookings')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs cursor-pointer space-y-2 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">STATE 03</span>
              <span>🛍️</span>
            </div>
            <h5 className="font-bold text-sm text-slate-900">No Bookings Yet</h5>
            <p className="text-[11px] text-slate-500 leading-tight">First-time empty bag state guiding diner to explore meals.</p>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
              View State <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => setActiveState('offline')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs cursor-pointer space-y-2 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">STATE 04</span>
              <span>📡</span>
            </div>
            <h5 className="font-bold text-sm text-slate-900">Offline & Disconnected</h5>
            <p className="text-[11px] text-slate-500 leading-tight">Network loss fallback ensuring access to cached pickup pass.</p>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
              View State <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
