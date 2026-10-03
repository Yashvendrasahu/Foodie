import React, { useState } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Store, MapPin, Phone, Mail, Clock, ShieldCheck,
  CreditCard, Save, CheckCircle2, Building2
} from 'lucide-react';

export default function PartnerProfilePage() {
  const { showToast } = useApp();
  const [profile, setProfile] = useState({
    name: 'Sharma Pure Veg Restaurant & Sweets',
    type: 'Fine Dining / Pure Veg Thali & Sweets',
    owner: 'Satish Sharma',
    phone: '+91 98765 43210',
    email: 'sharma.veg@foodie-partner.in',
    address: 'Shop 12-14, Ground Floor, Heritage Square, MG Road, Pune 411001',
    fssai: '11521034000128',
    gstin: '27AABCS1429B1Z8',
    bankAccount: 'HDFC0001289 - 5010048291039',
    operatingHours: '11:00 AM - 11:30 PM (Daily)',
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Restaurant profile updated successfully', 'success');
  };

  return (
    <PartnerLayout activePage="profile">
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <span>Storefront Settings</span>
            <span>•</span>
            <span>Kitchen Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Commercial Partner Profile</h1>
          <p className="text-sm text-gray-500">
            Keep your kitchen address, pickup point instructions, and bank payout coordinates up to date.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Verified Food Safety Level 4</h4>
                <p className="text-xs text-emerald-800">FSSAI License #{profile.fssai} verified active.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
              Active Seller
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Kitchen / Cuisine Type</label>
              <input
                type="text"
                value={profile.type}
                onChange={(e) => setProfile({ ...profile, type: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Counter Contact Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Pickup Counter Physical Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Escrow Bank Account (for Payouts)</label>
              <input
                type="text"
                value={profile.bankAccount}
                onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Daily Pickup Hours</label>
              <input
                type="text"
                value={profile.operatingHours}
                onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Kitchen Profile</span>
            </button>
          </div>
        </form>
      </div>
    </PartnerLayout>
  );
}
