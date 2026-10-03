import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Settings, Shield, Bell, Save, CheckCircle2, Sliders, Database, Key
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { platformSettings, updatePlatformSettings, showToast } = useApp();
  const [formData, setFormData] = useState({ ...platformSettings });

  const handleSave = (e) => {
    e.preventDefault();
    updatePlatformSettings(formData);
    showToast('Platform configuration saved successfully', 'success');
  };

  return (
    <AdminLayout activePage="settings">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <span>System Parameters</span>
            <span>•</span>
            <span>Global Rules</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Global Settings</h1>
          <p className="text-sm text-gray-500">
            Configure default commission cuts, minimum discount rules, FSSAI verification mandate, and SLA timers.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Deducted automatically before partner escrow payout.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Minimum Surplus Discount Mandate (%)
              </label>
              <input
                type="number"
                value={formData.minDiscountPercent}
                onChange={(e) => setFormData({ ...formData, minDiscountPercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Enforces minimum affordability for diners.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Pickup Buffer Period (Minutes)
              </label>
              <input
                type="number"
                value={formData.pickupBufferMinutes}
                onChange={(e) => setFormData({ ...formData, pickupBufferMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Grace period before unclaimed meals auto-expire.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Default Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoVerify"
                checked={formData.autoVerifyFSSAI}
                onChange={(e) => setFormData({ ...formData, autoVerifyFSSAI: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded-md border-gray-300 focus:ring-emerald-500"
              />
              <label htmlFor="autoVerify" className="text-xs font-bold text-gray-800">
                Automate Instant API Verification for Indian FSSAI Licenses
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
