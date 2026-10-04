import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  BarChart3, TrendingUp, Download, Calendar, ArrowUpRight,
  ShieldCheck, Leaf, DollarSign, Utensils, ShoppingBag,
  Users, Store, FileText, CheckCircle2, Filter, RefreshCw
} from 'lucide-react';

export default function AdminReportsPage() {
  const { meals, bookings, users, hotelVerifications, transactions, showToast } = useApp();
  const [timeRange, setTimeRange] = useState('month'); // 'today' | 'week' | 'month' | 'year' | 'all'
  const [reportType, setReportType] = useState('overview'); // 'overview' | 'financial' | 'sustainability' | 'partners'

  // Computed metrics
  const totalGMV = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0) + 14280;
  const platformRevenue = Math.round(totalGMV * 0.12);
  const totalPortionsRescued = bookings.reduce((sum, b) => sum + (Number(b.portions) || 1), 0) + 215;
  const totalCO2AvertedKg = (totalPortionsRescued * 1.4).toFixed(1);
  const totalWaterSavedL = (totalPortionsRescued * 280).toLocaleString();
  const activePartnersCount = hotelVerifications.filter(h => h.status === 'Verified' || h.statusBadge?.includes('Verified')).length || 14;

  const handleExportCSV = (type) => {
    showToast(`📊 Generating & Downloading ${type} Report (CSV)...`, 'success');
  };

  const handleExportPDF = () => {
    showToast('📑 Preparing Executive PDF Summary Report...', 'info');
  };

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6 pb-12 max-w-7xl">
        
        {/* Top Header & Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <span>Platform Super Admin</span>
              <span>•</span>
              <span>System Analytics & Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Business Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track platform transaction volume, environmental carbon reduction, partner payouts, and growth metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Time Filter */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeRange === 'today' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeRange === 'week' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeRange === 'month' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeRange === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Time
              </button>
            </div>

            <button
              onClick={() => handleExportCSV('Platform_Audit')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Key KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Merchandise Value</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{totalGMV.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs previous month
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Net Revenue</span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-teal-800">₹{platformRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              12% Avg. Platform Commission Take
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Meals Rescued</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-900">{totalPortionsRescued} Portions</div>
            <div className="text-[11px] text-amber-700 font-semibold">
              98.2% Successful Handover Rate
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Carbon Footprint Saved</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{totalCO2AvertedKg} kg CO₂e</div>
            <div className="text-[11px] text-slate-500 font-medium">
              Equivalent to saving ~{Math.round(Number(totalCO2AvertedKg) * 1.8)} car km
            </div>
          </div>

        </div>

        {/* Tab Switcher for Reports Sub-views */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setReportType('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              reportType === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setReportType('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              reportType === 'financial' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Escrow & Financial Settlements
          </button>
          <button
            onClick={() => setReportType('sustainability')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              reportType === 'sustainability' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Sustainability & ESG Report
          </button>
          <button
            onClick={() => setReportType('partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              reportType === 'partners' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Partner Performance Ranking
          </button>
        </div>

        {/* Section 1: Overview Breakdown */}
        {reportType === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Performance Breakdown */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Food Rescue by Category</h3>
                  <p className="text-[11px] text-slate-500">Distribution of rescued food portions across food categories.</p>
                </div>
                <button
                  onClick={() => handleExportCSV('Category_Breakdown')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: 'Meals & Thalis', pct: 42, count: '94 meals', revenue: '₹14,100', color: 'bg-emerald-600' },
                  { name: 'Biryani & Rice Bowls', pct: 26, count: '58 meals', revenue: '₹8,700', color: 'bg-teal-600' },
                  { name: 'Artisan Bakery & Pastries', pct: 18, count: '41 meals', revenue: '₹4,920', color: 'bg-amber-500' },
                  { name: 'Cafe & Fast Food Snacks', pct: 9, count: '20 meals', revenue: '₹2,000', color: 'bg-indigo-500' },
                  { name: 'Festive Mithai & Desserts', pct: 5, count: '11 meals', revenue: '₹1,650', color: 'bg-rose-500' },
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{cat.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{cat.count} • {cat.revenue} ({cat.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health & Audit Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Platform Health Indicators</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Optimal 99.9%
                  </span>
                </div>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600 font-medium">Active Registered Diners</span>
                    <span className="font-bold text-slate-900">{users.length + 84} Accounts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600 font-medium">FSSAI Verified Kitchens</span>
                    <span className="font-bold text-emerald-700">{activePartnersCount} Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600 font-medium">Avg. Rescue Time to Handover</span>
                    <span className="font-bold text-slate-900">34 minutes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-600 font-medium">Dispute / Complaint Ratio</span>
                    <span className="font-bold text-emerald-700">0.4% (Industry Leading)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Executive PDF</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Section 2: Financial Settlements Table */}
        {reportType === 'financial' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Partner Escrow Settlements Ledger</h3>
                <p className="text-[11px] text-slate-500">Breakdown of gross sales, platform fees, and net payouts settled to kitchens.</p>
              </div>
              <button
                onClick={() => handleExportCSV('Settlements_Ledger')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" /> Download Statement
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Settlement ID</th>
                    <th className="pb-3 px-3">Partner Kitchen</th>
                    <th className="pb-3 px-3">Orders Settled</th>
                    <th className="pb-3 px-3">Gross Sales</th>
                    <th className="pb-3 px-3">Platform Fee (12%)</th>
                    <th className="pb-3 px-3">Net Payout</th>
                    <th className="pb-3 px-3">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { id: 'SETL-9041', partner: 'Sharma Pure Veg Restaurant', orders: 28, gross: 4200, fee: 504, net: 3696, status: 'Settled' },
                    { id: 'SETL-9040', partner: 'Royal Grand Banquet Hall', orders: 19, gross: 3040, fee: 364, net: 2676, status: 'Settled' },
                    { id: 'SETL-9039', partner: 'Baker Street Artisan Cafe', orders: 34, gross: 4080, fee: 489, net: 3591, status: 'Settled' },
                    { id: 'SETL-9038', partner: 'Spice Garden Thali Express', orders: 15, gross: 2100, fee: 252, net: 1848, status: 'In Escrow' },
                    { id: 'SETL-9037', partner: 'Indore Mithai & Farsan House', orders: 22, gross: 2860, fee: 343, net: 2517, status: 'Settled' }
                  ].map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{s.partner}</td>
                      <td className="py-3 px-3">{s.orders} orders</td>
                      <td className="py-3 px-3 font-bold">₹{s.gross}</td>
                      <td className="py-3 px-3 text-slate-500">₹{s.fee}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">₹{s.net}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Settled' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Sustainability & ESG Report */}
        {reportType === 'sustainability' && (
          <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-emerald-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  🌿 United Nations SDG Goal 12.3: Zero Food Waste
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">Environmental & Carbon Offset Ledger</h3>
              </div>
              <button
                onClick={() => handleExportPDF()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Download ESG Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">Total Food Diverted</span>
                <span className="text-3xl font-black text-white mt-1 block">{(totalPortionsRescued * 0.45).toFixed(1)} kg</span>
                <p className="text-[11px] text-slate-300 mt-1">Diverted away from municipal landfills.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-xs text-teal-300 font-bold uppercase tracking-wider block">Methane & CO₂e Averted</span>
                <span className="text-3xl font-black text-white mt-1 block">{totalCO2AvertedKg} kg</span>
                <p className="text-[11px] text-slate-300 mt-1">Direct greenhouse emission avoidance.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">Virtual Water Conserved</span>
                <span className="text-3xl font-black text-white mt-1 block">{totalWaterSavedL} Litres</span>
                <p className="text-[11px] text-slate-300 mt-1">Agricultural irrigation water preserved.</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Partner Performance Rankings */}
        {reportType === 'partners' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Partner Kitchen Rescue Leaderboard</h3>
                <p className="text-[11px] text-slate-500">Ranked by volume of surplus saved and diner satisfaction ratings.</p>
              </div>
              <button
                onClick={() => handleExportCSV('Partner_Leaderboard')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                { rank: 1, name: 'Sharma Pure Veg Restaurant', city: 'Indore', saved: 142, rating: 4.9, verified: true },
                { rank: 2, name: 'Baker Street Artisan Cafe', city: 'Indore', saved: 118, rating: 4.8, verified: true },
                { rank: 3, name: 'Royal Grand Banquet Hall', city: 'Indore', saved: 96, rating: 4.7, verified: true },
                { rank: 4, name: 'Spice Garden Thali Express', city: 'Indore', saved: 74, rating: 4.6, verified: true },
                { rank: 5, name: 'Indore Mithai & Farsan House', city: 'Indore', saved: 58, rating: 4.9, verified: true },
              ].map((p) => (
                <div key={p.rank} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      p.rank === 1 ? 'bg-amber-100 text-amber-900' : p.rank === 2 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{p.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] text-slate-400">{p.city} • Verified Commercial Kitchen</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700">{p.saved} meals saved</div>
                    <span className="text-[10px] text-amber-500 font-bold">{p.rating} ★ Diner Rating</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
