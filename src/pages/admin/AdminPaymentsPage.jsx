import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  CreditCard, Search, Download, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, RefreshCw, ShieldCheck, DollarSign
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { transactions, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.party.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout activePage="payments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Financial Infrastructure</span>
              <span>•</span>
              <span>Escrow & Settlements</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Escrow Ledger</h1>
            <p className="text-sm text-gray-500">
              Audit secure holding escrow, automated restaurant payouts upon token OTP redemption, and refund ledger.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Triggered Automated Escrow Release Batch', 'success')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Run Payout Batch</span>
            </button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Escrow Held Today</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">₹14,820</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Backed by verified bookings</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Disbursed to Kitchens</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">₹88,450</div>
            <div className="text-[11px] text-gray-500 mt-0.5">92% completion rate</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Platform Fee (10%)</div>
            <div className="mt-1 text-2xl font-bold text-purple-700">₹9,820</div>
            <div className="text-[11px] text-purple-600 font-medium mt-0.5">Net revenue</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Refunds Processed</div>
            <div className="mt-1 text-2xl font-bold text-gray-600">₹420</div>
            <div className="text-[11px] text-gray-400 mt-0.5">0.4% low dispute rate</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction ID or party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700"
              >
                <option value="all">All Types</option>
                <option value="escrow_hold">Escrow Inflow</option>
                <option value="payout">Partner Payout</option>
                <option value="refund">Refund</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Txn ID & Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Party</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-gray-900">{tx.id}</div>
                      <div className="text-[10px] text-gray-400">{tx.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize font-semibold text-gray-800">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">{tx.party}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">₹{tx.amount}</td>
                    <td className="py-3 px-3 text-gray-600">{tx.method}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
