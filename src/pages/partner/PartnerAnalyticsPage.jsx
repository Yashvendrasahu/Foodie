import React, { useState } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  BarChart3, TrendingUp, Leaf, Download, FileText, CheckCircle2,
  Clock, ShieldCheck, Award, ArrowUpRight, ChevronRight, Sparkles
} from 'lucide-react';

export default function PartnerAnalyticsPage() {
  const { showToast } = useApp();
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <PartnerLayout activeTab="analytics">
      <div className="space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">
              Performance Analytics • <span className="text-emerald-700 font-bold">Sharma Restaurant (MG Road)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Analytics & Reports
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your food listings, bookings, verified revenue, and real-time organic food waste reduction.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
              {['Today', 'Last 7 Days', 'Last 30 Days'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeRange === t ? 'bg-emerald-700 text-white shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => showToast('Exporting consolidated partner report package...', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export All Reports
            </button>
          </div>
        </div>

        {/* 5 Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</span>
              <span className="text-emerald-700">💰</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">₹24,850</div>
            <span className="text-[10px] text-emerald-700 font-semibold block">↗ +34.9% vs last month</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Food Listings</span>
              <span>📋</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">128</div>
            <span className="text-[10px] text-emerald-700 font-semibold block">↗ +33.3% vs last month</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Portions Sold</span>
              <span>🥡</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">436</div>
            <span className="text-[10px] text-emerald-700 font-semibold block">● 92.8% fill rate</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Food Rescued</span>
              <span className="text-emerald-700">🍃</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">436 <span className="text-xs font-normal">portions</span></div>
            <span className="text-[10px] text-slate-500 block">312 kg CO2 avoided</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Discount</span>
              <span>%</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-600">48%</div>
            <span className="text-[10px] text-slate-500 block">Optimal pricing band</span>
          </div>
        </div>

        {/* Charts & Rescue Velocity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Trends Graph */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Bookings & Revenue Trends</h3>
                <p className="text-[11px] text-slate-500">Weekly performance breakdown for September 2026</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Peak Velocity</span>
                <span className="text-xs font-extrabold text-emerald-700">₹24,850 (+34.9%)</span>
              </div>
            </div>

            {/* Simulated Line/Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-100">
              {[
                { week: 'Week 1', rev: '₹4,800', bks: '84 bks', h: '45%' },
                { week: 'Week 2', rev: '₹5,950', bks: '106 bks', h: '60%' },
                { week: 'Week 3', rev: '₹6,400', bks: '114 bks', h: '72%' },
                { week: 'Week 4 (Peak)', rev: '₹7,700', bks: '132 bks', h: '95%' }
              ].map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {w.rev}
                  </span>
                  <div
                    style={{ height: w.h }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                      idx === 3 ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-md' : 'bg-slate-200 group-hover:bg-emerald-300'
                    }`}
                  />
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-800 block">{w.week}</span>
                    <span className="text-[9px] text-slate-400">{w.bks}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Operational Peak Window: 7:00 PM – 8:30 PM</strong> generates 64% of total orders. We advise stocking thalis 15 minutes before 7 PM.
              </span>
            </div>
          </div>

          {/* Right: Rescue Velocity Radial / Donut */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Rescue Velocity</h3>
                <p className="text-[11px] text-slate-500">Portion collection & waste conversion</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                92.8% Rescued
              </span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="py-2 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 stroke-current"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-700 stroke-current"
                    strokeDasharray="92.8, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-slate-900 block">436</span>
                  <span className="text-[10px] text-slate-400 font-medium">Portions Saved</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Total Listed Portions
                </span>
                <span className="font-bold text-slate-900">470 (100%)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Booked & Collected
                </span>
                <span className="font-bold text-emerald-700">436 (92.8%)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Sold Out Before Cutoff
                </span>
                <span className="font-bold text-slate-900">82% of listings</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Expired / Unclaimed
                </span>
                <span className="font-bold text-rose-600">34 (7.2%) <span className="text-[10px] text-slate-400 font-normal">Down from 18% in Aug</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* Top Performing Food & Impact Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Top Food Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Top Performing Food</h3>
                <p className="text-[11px] text-slate-500">Ranked by volume, portion turnaround, and client ratings</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">5 Items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Rank & Food Item</th>
                    <th className="py-2.5 px-2">Listings</th>
                    <th className="py-2.5 px-2">Sold</th>
                    <th className="py-2.5 px-2">Revenue</th>
                    <th className="py-2.5 px-3 text-right">Fill Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { rank: '#1', name: 'Veg Thali (Eco Box)', cat: 'Pure Veg • Thali', list: 24, sold: 120, rev: '₹7,080', rate: '82%' },
                    { rank: '#2', name: 'Chicken Biryani', cat: 'Non-Veg • Rice Bowl', list: 18, sold: 94, rev: '₹8,366', rate: '76%' },
                    { rank: '#3', name: 'Paneer Rice Bowl', cat: 'High Protein • Bowl', list: 15, sold: 71, rev: '₹4,189', rate: '71%' },
                    { rank: '#4', name: 'Dal Makhani Combo', cat: 'North Indian • Combo', list: 12, sold: 58, rev: '₹2,842', rate: '68%' },
                    { rank: '#5', name: 'Artisan Bakery Box', cat: 'Bakery • Surprise Bag', list: 10, sold: 45, rev: '₹2,475', rate: '90%' }
                  ].map((f) => (
                    <tr key={f.rank} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-400 text-[10px] mr-1">{f.rank}</span>
                        <span className="font-bold text-slate-900">{f.name}</span>
                        <span className="text-[10px] text-slate-400 block">{f.cat}</span>
                      </td>
                      <td className="py-3 px-2 font-medium">{f.list}</td>
                      <td className="py-3 px-2 font-bold text-slate-900">{f.sold}</td>
                      <td className="py-3 px-2 font-bold text-emerald-800">{f.rev}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700">{f.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Impact Scorecard */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Zero-Waste Kitchen Gold Partner
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">Impact Scorecard</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
                Direct ecological and community contribution logged through verified customer pickups.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-2xl font-extrabold text-white block">436</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Portions Rescued</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-2xl font-extrabold text-amber-300 block">~218 kg</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Solid Waste Diverted</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-2xl font-extrabold text-white block">436</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">Student Diners</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                <span className="text-2xl font-extrabold text-emerald-300 block">312 kg</span>
                <span className="text-[10px] text-emerald-200 uppercase font-bold">CO2 Abated</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-700/60 text-xs text-emerald-200/90 italic">
              "Your restaurant has saved an estimated ₹34,200 in raw stock disposal costs."
            </div>
          </div>

        </div>

        {/* Download Reports & Export Center */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Download Reports & Export Center</h3>
            <p className="text-xs text-slate-500">Download audit-ready bookkeeping and sustainability verification files</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-lg">📄</span>
                <h5 className="font-bold text-xs text-slate-900 mt-1">Booking Report</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Detailed customer pickup logs, timestamps, and claim codes.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast('Downloading CSV...', 'info')} className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex-1">.CSV</button>
                <button onClick={() => showToast('Downloading PDF...', 'info')} className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-1">.PDF</button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-lg">📊</span>
                <h5 className="font-bold text-xs text-slate-900 mt-1">Revenue & GST Report</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Tax breakup, platform fees (10%), net payouts & bank refs.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast('Downloading CSV...', 'info')} className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex-1">.CSV</button>
                <button onClick={() => showToast('Downloading PDF...', 'info')} className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-1">.PDF</button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-lg">🍽️</span>
                <h5 className="font-bold text-xs text-slate-900 mt-1">Food Listing Report</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Expiry time performance, initial stock count vs claim rates.</p>
              </div>
              <button onClick={() => showToast('Downloading Food Listing CSV...', 'info')} className="bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg w-full">
                Download .CSV
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex flex-col justify-between space-y-3">
              <div>
                <span className="text-lg">🏆</span>
                <h5 className="font-bold text-xs text-emerald-950 mt-1">ESG Impact Certificate</h5>
                <p className="text-[10px] text-emerald-800/80 mt-0.5">Official monthly digital certificate for showroom / brand wall.</p>
              </div>
              <button onClick={() => showToast('Exporting ESG Certificate...', 'success')} className="bg-emerald-800 text-white text-xs font-bold py-1.5 rounded-lg w-full">
                Export Certificate (.PDF)
              </button>
            </div>
          </div>
        </div>

      </div>
    </PartnerLayout>
  );
}
