import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Users, Search, ShieldCheck, UserX, UserCheck, Mail, Phone,
  Calendar, Award, Leaf, Download, RefreshCw, Star, CheckCircle2,
  DollarSign, ShoppingBag, Shield
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, toggleUserStatus, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || 'user-1');

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout activePage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Account Management</span>
              <span>•</span>
              <span>User Directory & Impact</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Registered Diners & Eco-Warriors</h1>
            <p className="text-sm text-gray-500">
              Audit consumer accounts, rescue statistics, verified badges, account statuses, and transaction history.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Exported diner directory (.CSV)', 'success')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-xs transition"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export Diners CSV</span>
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Total Diners</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Active</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Collective Meals Rescued</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-emerald-700">
                {users.reduce((sum, u) => sum + (u.mealsSaved || 0), 0)}
              </div>
              <span className="text-xs font-medium text-gray-400">meals</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Total Diner Savings</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-blue-700">
                ₹{users.reduce((sum, u) => sum + (u.moneySaved || 0), 0)}
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Saved</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Suspended / Flagged</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-400">
                {users.filter(u => u.status === 'suspended').length}
              </div>
              <span className="text-xs font-medium text-gray-400">0 Flags</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Filter Tier:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden"
            >
              <option value="all">All Tiers & Roles</option>
              <option value="diner">Consumer / Diner</option>
              <option value="partner">Restaurant Partner</option>
              <option value="admin">Platform Admin</option>
            </select>
          </div>
        </div>

        {/* Master Table & Sidebar Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main User Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Diner Directory ({filteredUsers.length})</h2>
              <span className="text-xs text-gray-500">Select diner to view carbon & rescue history</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-3">Role & Tier</th>
                    <th className="py-3 px-3">Meals Saved</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`cursor-pointer transition hover:bg-emerald-50/40 ${
                          isSelected ? 'bg-emerald-50/70 font-medium' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                              </div>
                              <div className="text-[11px] text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <Leaf className="w-3 h-3" /> {user.tier}
                          </span>
                          <div className="text-[10px] text-gray-400 mt-0.5 capitalize">{user.role}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-emerald-700">{user.mealsSaved || 0} meals</div>
                          <div className="text-[10px] text-gray-500">₹{user.moneySaved || 0} saved</div>
                        </td>
                        <td className="py-3.5 px-3">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                              user.status === 'active'
                                ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Profile Drawer (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <img
                src={selectedUser?.avatar}
                alt={selectedUser?.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser?.name}</h3>
                <p className="text-xs text-gray-500">{selectedUser?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    {selectedUser?.tier}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">ID: {selectedUser?.id}</span>
                </div>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-center">
                <div className="text-xs text-gray-500 font-medium">Meals Rescued</div>
                <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{selectedUser?.mealsSaved || 0}</div>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-center">
                <div className="text-xs text-gray-500 font-medium">CO2 Prevented</div>
                <div className="text-xl font-extrabold text-blue-700 mt-0.5">{selectedUser?.co2Saved || '28.4 kg'}</div>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-center">
                <div className="text-xs text-gray-500 font-medium">Wallet Saved</div>
                <div className="text-xl font-extrabold text-amber-700 mt-0.5">₹{selectedUser?.moneySaved || 0}</div>
              </div>
            </div>

            {/* Personal & Contact Specs */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider">Account Specifications</h4>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phone Number:</span>
                  <span className="font-semibold text-gray-800">{selectedUser?.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Member Since:</span>
                  <span className="font-semibold text-gray-800">{selectedUser?.memberSince}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Primary Location:</span>
                  <span className="font-semibold text-gray-800">{selectedUser?.city || 'Downtown Central'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Dietary Preference:</span>
                  <span className="font-semibold text-gray-800">{selectedUser?.preferences?.dietary || 'Vegetarian / Eco-Flex'}</span>
                </div>
              </div>
            </div>

            {/* Account Status Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => toggleUserStatus(selectedUser?.id)}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition ${
                  selectedUser?.status === 'active'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                {selectedUser?.status === 'active' ? 'Suspend Diner Account' : 'Reactivate Diner Account'}
              </button>
              <button
                onClick={() => showToast(`Password reset link emailed to ${selectedUser?.email}`, 'info')}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 text-xs font-bold rounded-lg transition"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
