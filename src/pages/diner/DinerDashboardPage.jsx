import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  ShoppingBag, Heart, User, HelpCircle, LogOut, Compass,
  CheckCircle2, Clock, Leaf, QrCode, ArrowRight, Eye, ChevronRight,
  Sparkles, ShieldCheck, MapPin
} from 'lucide-react';

export default function DinerDashboardPage() {
  const { bookings, navigate, dinerProfile } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const activeBookings = bookings.filter(b => b.status === 'Ready for Pickup' || b.status === 'Confirmed');
  
  const pastBookings = [
    {
      id: 'FD-4720',
      title: 'Hyderabadi Chicken Biryani Box',
      restaurant: 'Novotel Grand Kitchen',
      date: '28 Sep 2026',
      amount: 79,
      status: 'Completed'
    },
    {
      id: 'FD-4690',
      title: 'Paneer Rice & Roasted Veg Bowl',
      restaurant: 'Green Meadow Bistro',
      date: '24 Sep 2026',
      amount: 65,
      status: 'Completed'
    },
    {
      id: 'FD-4611',
      title: 'Bakery Surprise Croissant Box',
      restaurant: 'Artisan Breadworks',
      date: '19 Sep 2026',
      amount: 50,
      status: 'Completed'
    },
    {
      id: 'FD-4580',
      title: 'Dal Rice Comfort Combo',
      restaurant: 'Annapurna Kitchen',
      date: '12 Sep 2026',
      amount: 49,
      status: 'Expired'
    }
  ];

  const filteredPast = pastBookings.filter(b => {
    if (activeFilter === 'All') return true;
    return b.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                  RS
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {dinerProfile.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Eco Hero Level 2</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Links */}
              <nav className="mt-6 space-y-1 text-xs font-semibold">
                <button
                  onClick={() => navigate('dashboard')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2.5 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('explore')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  Explore Food
                </button>
                <button
                  onClick={() => navigate('dashboard')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    My Bookings
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeBookings.length}
                  </span>
                </button>
                <button
                  onClick={() => navigate('explore')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  Favorites
                </button>
                <button
                  onClick={() => navigate('profile')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile
                </button>
                <button
                  onClick={() => navigate('admin-complaints')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Help & Support
                </button>
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate('login')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Green Citizen Perk Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-600" /> Green Citizen
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                You are <strong>3 rescues away</strong> from unlocking the <strong>Master Rescuer</strong> perk!
              </p>
              <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-700 h-2 rounded-full w-4/5 transition-all duration-500" />
              </div>
            </div>

          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Good evening, Rahul <span className="text-2xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Find affordable food and manage your bookings.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">{dinerProfile.location.split('-')[0]}</span>
                <button onClick={() => navigate('profile')} className="text-emerald-700 font-bold hover:underline ml-1">
                  Change
                </button>
              </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-emerald-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-xs sm:text-sm font-bold">
                  1 order ready for pickup tonight before 8:00 PM!
                </span>
              </div>

              <button
                onClick={() => navigate('booking-confirmed', { bookingId: 'FD-4827' })}
                className="text-xs font-bold text-emerald-100 hover:text-white flex items-center gap-1 hover:underline"
              >
                View details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Pickup tonight
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 pt-2">{activeBookings.length}</div>
                <div className="text-xs text-slate-500 font-medium">Active Bookings</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Total orders</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 pt-2">12</div>
                <div className="text-xs text-slate-500 font-medium">Completed Orders</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    32 kg CO2 abated
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 pt-2">15</div>
                <div className="text-xs text-slate-500 font-medium">Meals Saved</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    ₹
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Avg 62% saved
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 pt-2">₹1,240</div>
                <div className="text-xs text-slate-500 font-medium">Money Saved</div>
              </div>
            </div>

            {/* Active Bookings Cards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">Active Bookings</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {activeBookings.length} pending pickup
                  </span>
                </div>
                <button onClick={() => alert('Pickup Rules: Show QR at counter, arrive within window.')} className="text-xs text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1">
                  Rules & Timings <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      {/* Image header */}
                      <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-3">
                        <img src={b.image} alt={b.mealTitle} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                            {b.pickupWindow}
                          </span>
                          <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            51% OFF
                          </span>
                        </div>
                        <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'Ready for Pickup' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          ● {b.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{b.restaurantName}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {b.distance}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 mt-1">{b.mealTitle}</h4>
                      <p className="text-xs text-slate-500">ID: {b.id} • {b.portions} Portion{b.portions > 1 ? 's' : ''}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900">₹{b.totalPaid}</span>
                          <span className="text-xs text-slate-400 line-through">₹{b.originalAmount}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          You saved ₹{b.originalAmount - b.totalPaid}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate('booking-confirmed', { bookingId: b.id })}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        View Token & QR
                      </button>
                    </div>

                    <div className="bg-slate-50 px-3 py-2 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{b.pickupCounter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">Recent Bookings</h3>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  {['All', 'Completed', 'Expired', 'Cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        activeFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] text-slate-400 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3">Meal Item & Restaurant</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Paid</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPast.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block">{item.title}</span>
                          <span className="text-[11px] text-slate-400">{item.restaurant}</span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-600">{item.date}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">₹{item.amount}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            ● {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => alert(`Receipt for ${item.title} (#${item.id}): ₹${item.amount} settled.`)}
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hungry for dinner banner */}
            <div className="bg-emerald-800 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center shrink-0">
                  🍽️
                </div>
                <div>
                  <h4 className="font-extrabold text-base">Hungry for dinner?</h4>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Fresh hotel buffets are listing delicious surplus right now with up to 70% off.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('explore')}
                className="bg-white text-emerald-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-colors whitespace-nowrap"
              >
                Explore More Food ↗
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
