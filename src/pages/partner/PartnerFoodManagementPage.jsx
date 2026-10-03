import React, { useState } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import {
  Utensils, PlusCircle, Search, SlidersHorizontal, Edit3,
  Trash2, CheckCircle2, Clock, AlertTriangle, Eye, ArrowRight
} from 'lucide-react';

export default function PartnerFoodManagementPage() {
  const { meals, updateMealStatus, deleteMeal, navigate, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const partnerMeals = meals.filter(m => m.restaurantId === 'rest-sharma');
  const filteredMeals = partnerMeals.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PartnerLayout activePage="food">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <span>Kitchen Inventory</span>
              <span>•</span>
              <span>Surplus Menu</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Surplus Food Listings</h1>
            <p className="text-sm text-gray-500">
              Manage items, update remaining portions in real time, and mark items as sold out.
            </p>
          </div>
          <button
            onClick={() => navigate('partner-add-food')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Surplus Food</span>
          </button>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search surplus listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">{filteredMeals.length} Total Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price & Discount</th>
                  <th className="py-3 px-3">Portions Left</th>
                  <th className="py-3 px-3">Pickup Window</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredMeals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{meal.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">#{meal.id}</div>
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
                      <div className="text-[10px] text-gray-400 line-through">₹{meal.originalPrice} (-{meal.discountPercent}%)</div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-800">
                      {meal.portionsLeft} portions
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {meal.pickupTime}
                    </td>
                    <td className="py-3.5 px-3">
                      {meal.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Paused
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const newStatus = meal.status === 'active' ? 'paused' : 'active';
                            updateMealStatus(meal.id, newStatus);
                          }}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          {meal.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="p-1 rounded-md text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
