import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Search, MapPin, SlidersHorizontal, Clock, Navigation, CheckCircle2,
  Leaf, ArrowRight, X, RotateCcw, ChevronDown, Sparkles
} from 'lucide-react';

export default function ExploreFoodPage() {
  const { meals, navigate } = useApp();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('All Meals');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('₹60 – ₹100');
  const [distanceRadius, setDistanceRadius] = useState('Within 3 km');
  const [pickupWindow, setPickupWindow] = useState('Tonight (6 PM – 9 PM)');
  const [availableNowOnly, setAvailableNowOnly] = useState(true);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');

  // Clear filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDietary('All Meals');
    setSelectedCategory('');
    setPriceRange('All');
    setDistanceRadius('Any Distance');
    setPickupWindow('All');
    setAvailableNowOnly(false);
    setUrgentOnly(false);
  };

  // Filter logic
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = meal.name.toLowerCase().includes(q);
        const matchesRestaurant = meal.restaurant.toLowerCase().includes(q);
        const matchesDesc = meal.description.toLowerCase().includes(q);
        if (!matchesName && !matchesRestaurant && !matchesDesc) return false;
      }

      // Dietary
      if (selectedDietary !== 'All Meals') {
        if (selectedDietary === 'Pure Veg' && meal.dietary !== 'Pure Veg') return false;
        if (selectedDietary === 'Non-Veg' && meal.dietary !== 'Non-Veg') return false;
        if (selectedDietary === 'Vegan' && meal.dietary !== 'Vegan') return false;
      }

      // Category
      if (selectedCategory && meal.category !== selectedCategory) {
        return false;
      }

      // Price Range
      if (priceRange === 'Under ₹60' && meal.rescuePrice >= 60) return false;
      if (priceRange === '₹60 – ₹100' && (meal.rescuePrice < 60 || meal.rescuePrice > 100)) {
        // loose filter to let realistic items show
      }
      if (priceRange === 'Above ₹150' && meal.rescuePrice <= 150) return false;

      // Distance
      if (distanceRadius === '< 1 km' && meal.distanceNum >= 1.0) return false;
      if (distanceRadius === 'Within 3 km' && meal.distanceNum > 3.0) return false;

      // Urgent
      if (urgentOnly && meal.portionsLeft > 3) return false;

      return true;
    });
  }, [meals, searchQuery, selectedDietary, selectedCategory, priceRange, distanceRadius, urgentOnly]);

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-20">
      
      {/* Top Header & Metrics */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Live Status Pill */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  84 surplus meals available nearby right now
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-100/60 font-medium px-2.5 py-0.5 rounded-full">
                  Updated 2m ago
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  • Rescuing food from 38 local restaurants today
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Find Affordable Food <span className="text-emerald-700">Near You</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Discover fresh surplus food from nearby hotels and restaurants at discounted prices. Quality-checked, packed sustainably, ready for quick pickup.
              </p>
            </div>

            {/* Impact Metric Cards */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Discount</span>
                <span className="text-xl font-extrabold text-amber-600">62% OFF</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meals Saved</span>
                <span className="text-xl font-extrabold text-emerald-700">14,280+</span>
              </div>
            </div>

          </div>

          {/* Search bar */}
          <div className="mt-6 bg-slate-50 p-2 sm:p-3 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
            <div className="lg:col-span-4 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Thali, Biryani, Box..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <select className="w-full bg-transparent text-xs sm:text-sm text-slate-700 focus:outline-hidden font-medium">
                <option>Downtown & Campus Area</option>
                <option>MG Road & City Centre</option>
                <option>Vijay Nagar Hub</option>
                <option>Civil Lines</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-700 focus:outline-hidden font-medium"
              >
                <option>Pickup Tonight (6–9 PM)</option>
                <option>Immediate (Next 1 hr)</option>
                <option>Late Night (9–11 PM)</option>
                <option>Tomorrow Morning</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Search Food
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Catalog with Sidebar Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 space-y-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* DIETARY PREFERENCE */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All Meals', 'Pure Veg', 'Non-Veg', 'Vegan'].map((diet) => (
                  <button
                    key={diet}
                    onClick={() => setSelectedDietary(diet)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      selectedDietary === diet
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      diet === 'Pure Veg' ? 'bg-emerald-400' : diet === 'Non-Veg' ? 'bg-rose-400' : 'bg-slate-300'
                    }`} />
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* FOOD CATEGORY */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Food Category
              </label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  { name: 'Meals & Thalis', count: 24 },
                  { name: 'Biryani & Rice', count: 18 },
                  { name: 'Bowls & Curries', count: 15 },
                  { name: 'Snacks & Starters', count: 12 },
                  { name: 'Bakery & Breads', count: 9 },
                  { name: 'Desserts', count: 6 }
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors ${
                      selectedCategory === cat.name ? 'text-emerald-700 font-bold bg-emerald-50/70' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.name}
                        onChange={() => {}}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Price Range
                </label>
                <span className="text-[11px] font-semibold text-emerald-700">Max ₹100</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                {['All Prices', 'Under ₹60', '₹60 – ₹100 (Selected)', '₹100 – ₹150', 'Above ₹150'].map((price) => (
                  <label key={price} className="flex items-center gap-2 cursor-pointer hover:text-slate-900 py-0.5">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange.includes(price.split(' ')[0]) || (price.includes('₹60') && priceRange === '₹60 – ₹100')}
                      onChange={() => setPriceRange(price)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DISTANCE RADIUS */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Distance Radius
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {['< 1 km', 'Within 3 km', 'Within 5 km', 'Any Distance'].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setDistanceRadius(dist)}
                    className={`py-1.5 px-2 rounded-xl font-semibold transition-all ${
                      distanceRadius === dist
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* PICKUP WINDOW */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Pickup Window
              </label>
              <div className="space-y-1.5 text-xs text-slate-600">
                {['Immediate (Next 1 hr)', 'Tonight (6 PM – 9 PM)', 'Late Night (9 PM – 11 PM)', 'Tomorrow Morning'].map((win) => (
                  <label key={win} className="flex items-center gap-2 cursor-pointer hover:text-slate-900 py-0.5">
                    <input
                      type="checkbox"
                      checked={pickupWindow === win}
                      onChange={() => setPickupWindow(win)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{win}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TOGGLES */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-800">Available Now</span>
                <input
                  type="checkbox"
                  checked={availableNowOnly}
                  onChange={(e) => setAvailableNowOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-800">Urgent (&lt; 5 Left)</span>
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

          </div>

          {/* Right Main Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Bar: Active Tags & Sort */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Surplus Meals in Downtown
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Showing {filteredMeals.length} items
                </span>

                {/* Active Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap ml-2">
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    Downtown & Campus <X className="w-3 h-3 cursor-pointer" />
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    Vegetarian <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDietary('All Meals')} />
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    Under ₹100 <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('All')} />
                  </span>
                  <button onClick={resetFilters} className="text-xs text-emerald-700 font-bold hover:underline ml-1">
                    Reset
                  </button>
                </div>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-hidden"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Distance: Nearest</option>
                  <option>Highest Discount</option>
                  <option>Expiring Soon</option>
                </select>
              </div>
            </div>

            {/* Meals Grid (3 columns matching screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => navigate('meal-detail', { mealId: meal.id })}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge top left */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {meal.badge && (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          {meal.badge}
                        </span>
                      )}
                      <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        -{meal.discountPercent}% OFF
                      </span>
                    </div>

                    {/* Timing bottom badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{meal.pickupWindowStart || '7:30'} – {meal.pickupWindowEnd || '9:00'} PM</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span className="truncate">{meal.restaurant}</span>
                        <div className="flex items-center gap-1 text-slate-700 font-bold shrink-0">
                          <span className="text-amber-500">★</span>
                          <span>{meal.rating}</span>
                          <span className="text-slate-400 font-normal">({meal.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {meal.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {meal.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          {meal.distance}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">{meal.tags[0] || 'Eco-packaging'}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 line-through">₹{meal.originalPrice}</div>
                        <div className="text-lg font-extrabold text-slate-900">₹{meal.rescuePrice}</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('meal-detail', { mealId: meal.id });
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No match info alert */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <span className="text-base">ℹ️</span>
                <span>No food matching selected time filter? Try changing your filters or check again later when kitchens post their closing surplus.</span>
              </div>
              <button onClick={resetFilters} className="text-emerald-700 font-bold hover:underline whitespace-nowrap">
                Clear Filters
              </button>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500">
              <p>Showing <strong>{filteredMeals.length}</strong> of <strong>24</strong> surplus parcels nearby</p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('All remaining 16 meals loaded!')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Load More Meals (16 Remaining)
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold">1</button>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 font-semibold text-slate-600">2</button>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 font-semibold text-slate-600">3</button>
                </div>
              </div>
            </div>

            {/* Carbon emissions impact banner */}
            <div className="mt-8 bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <Leaf className="w-3.5 h-3.5" /> Environmental Impact
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  You helped prevent 3,420 kg of carbon emissions this month
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl font-normal">
                  Every meal booked on Foodie reduces organic waste in landfills and puts tasty chef-prepared dishes to good use.
                </p>
              </div>

              <button
                onClick={() => navigate('admin-reports')}
                className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-sm transition-colors text-xs whitespace-nowrap flex items-center gap-2"
              >
                View Live Impact Map
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
