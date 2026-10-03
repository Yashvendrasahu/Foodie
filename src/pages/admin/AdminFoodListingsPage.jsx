import React, { useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Utensils, Search, SlidersHorizontal, CheckCircle2, Clock, AlertTriangle,
  Flame, Leaf, ShieldCheck, Eye, Edit3, Trash2, Check, X, ShieldAlert,
  Download, Plus, RefreshCw, Star, Info, ArrowUpRight
} from 'lucide-react';

export default function AdminFoodListingsPage() {
  const { meals, updateMealStatus, deleteMeal, showToast, navigate } = useApp();
  const [selectedMealId, setSelectedMealId] = useState(meals[0]?.id || 'meal-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedMeal = meals.find(m => m.id === selectedMealId) || meals[0];

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meal.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meal.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && meal.status === 'active') ||
                          (statusFilter === 'paused' && meal.status === 'paused') ||
                          (statusFilter === 'expired' && meal.status === 'expired') ||
                          (statusFilter === 'sold_out' && meal.status === 'sold_out');
    const matchesCategory = categoryFilter === 'all' || meal.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <AdminLayout activePage="food">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Admin Management</span>
              <span>•</span>
              <span>Live Food Auditing</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Surplus Food Listings Ledger</h1>
            <p className="text-sm text-gray-500">
              Audit, approve, monitor safety parameters, and manage live surplus inventory across all certified kitchens.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Refreshed inventory ledger', 'info')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-xs transition"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => showToast('Exporting live food ledger (.CSV)', 'success')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-xs transition"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                navigate('partner-add-food');
                showToast('Switched to Kitchen Food Creation form', 'info');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Surplus</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Live Active Listings</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{meals.filter(m => m.status === 'active').length}</div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4 this hour</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Total Portions Available</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-emerald-700">
                {meals.reduce((sum, m) => sum + (m.status === 'active' ? m.portionsLeft : 0), 0)}
              </div>
              <span className="text-xs font-medium text-gray-500">portions</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Safety Certified Today</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-blue-700">100%</div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">FSSAI Checked</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="text-xs font-semibold text-gray-500 uppercase">Flagged / Expired</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-amber-600">{meals.filter(m => m.status === 'expired' || m.status === 'paused').length}</div>
              <span className="text-xs font-medium text-gray-400">auto-delisted</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by food name, restaurant, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="inline-flex bg-gray-100 p-1 rounded-lg text-xs font-medium text-gray-600">
              {['all', 'active', 'paused', 'expired', 'sold_out'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md capitalize transition ${
                    statusFilter === st ? 'bg-white text-gray-900 font-bold shadow-xs' : 'hover:text-gray-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Meals & Thalis">Meals & Thalis</option>
              <option value="Biryani & Rice">Biryani & Rice</option>
              <option value="Bakery & Desserts">Bakery & Desserts</option>
              <option value="Continental & Italian">Continental & Italian</option>
              <option value="Healthy & Salads">Healthy & Salads</option>
            </select>
          </div>
        </div>

        {/* Master Ledger Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Surplus Listings ({filteredMeals.length})</h2>
              <span className="text-xs text-gray-500">Click a row to inspect safety specs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Item & Restaurant</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Stock & Price</th>
                    <th className="py-3 px-3">Pickup Window</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredMeals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-400">
                        No food listings match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMeals.map((meal) => {
                      const isSelected = selectedMeal?.id === meal.id;
                      return (
                        <tr
                          key={meal.id}
                          onClick={() => setSelectedMealId(meal.id)}
                          className={`cursor-pointer transition hover:bg-emerald-50/40 ${
                            isSelected ? 'bg-emerald-50/70 font-medium' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={meal.image}
                                alt={meal.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{meal.name}</span>
                                  {meal.dietary === 'Pure Veg' && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Pure Veg" />
                                  )}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <span>{meal.restaurantName}</span>
                                  <span>•</span>
                                  <span className="font-mono text-gray-400">#{meal.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold">
                              {meal.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-emerald-700">₹{meal.discountedPrice}</div>
                            <div className="text-[10px] text-gray-400 line-through">₹{meal.originalPrice}</div>
                            <div className="text-[10px] text-gray-600 font-semibold mt-0.5">{meal.portionsLeft} left</div>
                          </td>
                          <td className="py-3.5 px-3 text-[11px]">
                            <div className="flex items-center gap-1 text-gray-800 font-medium">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              <span>{meal.pickupTime}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{meal.pickupWindowText}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            {meal.status === 'active' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Active
                              </span>
                            )}
                            {meal.status === 'paused' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Paused
                              </span>
                            )}
                            {meal.status === 'expired' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                                Expired
                              </span>
                            )}
                            {meal.status === 'sold_out' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                Sold Out
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {meal.status === 'active' ? (
                                <button
                                  title="Pause listing"
                                  onClick={() => updateMealStatus(meal.id, 'paused')}
                                  className="p-1 rounded-md text-amber-600 hover:bg-amber-50"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  title="Approve / Activate"
                                  onClick={() => updateMealStatus(meal.id, 'active')}
                                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                title="Delete listing"
                                onClick={() => deleteMeal(meal.id)}
                                className="p-1 rounded-md text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Inspector Side Drawer (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Food Inspector Deep-Dive
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedMeal?.name}</h3>
                <p className="text-xs text-gray-500 font-mono">UUID: {selectedMeal?.id}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-700">₹{selectedMeal?.discountedPrice}</span>
                <span className="block text-xs font-medium text-rose-600">-{selectedMeal?.discountPercent}% OFF</span>
              </div>
            </div>

            {/* Photo & Food Safety Badge */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
              <img
                src={selectedMeal?.image}
                alt={selectedMeal?.name}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <div className="text-white">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Certified Kitchen Safety Protocol Active</span>
                  </div>
                  <p className="text-[11px] text-gray-200">
                    Prepared at {selectedMeal?.preparedTime || '1:15 PM'} • Packaged in eco-sealed container
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Source & FSSAI Verification */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">{selectedMeal?.restaurantName}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Verified
                </span>
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <span>📍 {selectedMeal?.location}</span>
                <span>•</span>
                <span>⭐ {selectedMeal?.rating} rating</span>
              </p>
            </div>

            {/* Kitchen Safety Parameters */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Food Safety & Dispatch Parameters</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Cooking / Prep Time</span>
                  <span className="font-bold text-gray-800">{selectedMeal?.preparedTime || 'Today, 1:15 PM'}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Safety Expiry Cutoff</span>
                  <span className="font-bold text-rose-600">{selectedMeal?.expiryTime || 'Today, 4:00 PM'}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Dietary Type</span>
                  <span className="font-bold text-gray-800">{selectedMeal?.dietary}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Storage Method</span>
                  <span className="font-bold text-gray-800">{selectedMeal?.storageTemp || 'Hot Case (>65°C)'}</span>
                </div>
              </div>
            </div>

            {/* Packaging & Allergen Information */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Packaging Type:</span>
                <span className="font-semibold text-gray-800">{selectedMeal?.packaging || 'Biodegradable Sugarcane Box'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Allergen Notice:</span>
                <span className="font-semibold text-gray-800">{selectedMeal?.allergens || 'Contains Dairy (Paneer/Butter)'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Portions Remaining:</span>
                <span className="font-bold text-emerald-700">{selectedMeal?.portionsLeft} portions left</span>
              </div>
            </div>

            {/* Quick Audit Action Controls */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {selectedMeal?.status === 'active' ? (
                  <button
                    onClick={() => updateMealStatus(selectedMeal.id, 'paused')}
                    className="flex-1 py-2 px-3 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                  >
                    Pause Listing (Hold)
                  </button>
                ) : (
                  <button
                    onClick={() => updateMealStatus(selectedMeal.id, 'active')}
                    className="flex-1 py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                  >
                    Approve & Make Live
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate('explore');
                    showToast(`Viewing ${selectedMeal?.name} in Diner Storefront`, 'info');
                  }}
                  className="py-2 px-3 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <button
                onClick={() => {
                  deleteMeal(selectedMeal?.id);
                  showToast('Surplus meal listing permanently deleted from master ledger', 'warning');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove & Mark as Disposed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
