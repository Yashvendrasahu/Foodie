import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import OpenStreetMap from '../../components/OpenStreetMap.jsx';
import { POPULAR_CITIES, formatDistance } from '../../lib/geoUtils.js';
import {
  Search, MapPin, SlidersHorizontal, Clock, Navigation, CheckCircle2,
  Leaf, ArrowRight, X, RotateCcw, ChevronDown, Sparkles, Map as MapIcon,
  LayoutGrid, SplitSquareVertical, LocateFixed, Loader2, Compass
} from 'lucide-react';

export default function ExploreFoodPage() {
  const {
    mealsWithDistance,
    userLocation,
    detectLocation,
    isDetectingLocation,
    setUserCity,
    navigate,
    setSelectedMealId,
    showToast
  } = useApp();

  // View Mode: 'grid' | 'map' | 'split'
  const [viewMode, setViewMode] = useState('grid');
  const [activeMealOnMap, setActiveMealOnMap] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('All Meals');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('All');
  const [distanceRadius, setDistanceRadius] = useState('Any Distance');
  const [pickupWindow, setPickupWindow] = useState('All');
  const [availableNowOnly, setAvailableNowOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Distance: Nearest');

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
    setSortBy('Distance: Nearest');
  };

  // Filter and sort meals
  const filteredMeals = useMemo(() => {
    let result = (mealsWithDistance || []).filter((meal) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (meal.name || '').toLowerCase().includes(q);
        const matchesRestaurant = (meal.restaurant || meal.restaurantName || '').toLowerCase().includes(q);
        const matchesDesc = (meal.description || '').toLowerCase().includes(q);
        const matchesCat = (meal.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesRestaurant && !matchesDesc && !matchesCat) return false;
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
      if (priceRange === '₹60 – ₹100' && (meal.rescuePrice < 60 || meal.rescuePrice > 100)) return false;
      if (priceRange === 'Above ₹100' && meal.rescuePrice <= 100) return false;

      // Distance (computed via real OpenStreetMap Haversine coordinates)
      if (distanceRadius === '< 1 km' && meal.distanceNum >= 1.0) return false;
      if (distanceRadius === 'Within 3 km' && meal.distanceNum > 3.0) return false;
      if (distanceRadius === 'Within 5 km' && meal.distanceNum > 5.0) return false;

      // Availability
      if (availableNowOnly && meal.portionsLeft <= 0) return false;

      // Urgent
      if (urgentOnly && (meal.portionsLeft > 3 || meal.portionsLeft === 0)) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'Distance: Nearest') {
        return (a.distanceNum || 99) - (b.distanceNum || 99);
      }
      if (sortBy === 'Price: Low to High') {
        return a.rescuePrice - b.rescuePrice;
      }
      if (sortBy === 'Price: High to Low') {
        return b.rescuePrice - a.rescuePrice;
      }
      if (sortBy === 'Highest Discount') {
        return (b.discountPercent || 0) - (a.discountPercent || 0);
      }
      if (sortBy === 'Portions Left: Low to High') {
        return a.portionsLeft - b.portionsLeft;
      }
      return 0;
    });

    return result;
  }, [
    mealsWithDistance,
    searchQuery,
    selectedDietary,
    selectedCategory,
    priceRange,
    distanceRadius,
    availableNowOnly,
    urgentOnly,
    sortBy
  ]);

  const handleSelectMeal = (meal) => {
    setActiveMealOnMap(meal);
    setSelectedMealId(meal.id);
    navigate('meal-detail', { mealId: meal.id });
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] pb-20">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Live Status Pill & Heading */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {filteredMeals.length} Surplus Meals Available in Your Area
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-100/60 font-medium px-2.5 py-0.5 rounded-full">
                  Real-time OpenStreetMap Verified
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Rescue Fresh Surplus Food <span className="text-emerald-700">Near You</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Hotels & restaurants list their closing fresh surplus at 50%–70% off. Find takeaway meals on OpenStreetMap and collect within the pickup window.
              </p>
            </div>

            {/* Impact Metric Cards */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Discount</span>
                <span className="text-xl font-extrabold text-amber-600">62% OFF</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meals Saved</span>
                <span className="text-xl font-extrabold text-emerald-700">14,280+</span>
              </div>
            </div>

          </div>

          {/* Search bar & Live Location Bar */}
          <div className="mt-6 bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
              
              {/* Search text */}
              <div className="lg:col-span-5 flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Thali, Biryani, Bakery Box, Restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-hidden"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* City Location Preset */}
              <div className="lg:col-span-4 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={userLocation.name}
                  onChange={(e) => setUserCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-700 focus:outline-hidden font-medium cursor-pointer"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live GPS Detection Button */}
              <div className="lg:col-span-3">
                <button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                    userLocation.isLiveGps
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                  title="Detect GPS coordinates using device location"
                >
                  {isDetectingLocation ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>{userLocation.isLiveGps ? 'GPS Active (Re-detect)' : 'Use Live GPS'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Quick Filter & Location Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-800">Current Anchor:</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium text-emerald-800">
                  {userLocation.name} [{userLocation.coords[0].toFixed(3)}, {userLocation.coords[1].toFixed(3)}]
                </span>
                {userLocation.isLiveGps && (
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                    Live GPS
                  </span>
                )}
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>Split Map</span>
                </button>

                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>OpenStreetMap View</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* FULL MAP VIEW */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Interactive OpenStreetMap Food Finder
                </h3>
                <span className="text-xs text-slate-500">
                  • Click any price marker to view rescue parcel details & reserve
                </span>
              </div>

              <button
                onClick={() => setViewMode('grid')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Switch to Grid View →
              </button>
            </div>

            <OpenStreetMap
              center={userLocation.coords}
              zoom={14}
              meals={filteredMeals}
              selectedMealId={activeMealOnMap?.id}
              onSelectMeal={handleSelectMeal}
              userCoords={userLocation.coords}
              height="580px"
              className="shadow-md"
            />
          </div>
        )}

        {/* SPLIT VIEW (Map Top/Side + Cards) */}
        {viewMode === 'split' && (
          <div className="space-y-6">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  Live OpenStreetMap Radar ({filteredMeals.length} listings in range)
                </span>
                <span className="text-[11px] text-slate-500">
                  Blue beacon = Your Location • Green pins = Available Food
                </span>
              </div>
              <OpenStreetMap
                center={userLocation.coords}
                zoom={14}
                meals={filteredMeals}
                selectedMealId={activeMealOnMap?.id}
                onSelectMeal={handleSelectMeal}
                userCoords={userLocation.coords}
                height="340px"
              />
            </div>
          </div>
        )}

        {/* CATALOG WITH SIDEBAR FILTERS (Visible in 'grid' and 'split' modes) */}
        {viewMode !== 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            
            {/* Left Sidebar Filters */}
            <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 space-y-6 shadow-xs sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* DISTANCE RADIUS (OpenStreetMap GPS powered) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Distance Radius
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    OSM GPS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {['< 1 km', 'Within 3 km', 'Within 5 km', 'Any Distance'].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setDistanceRadius(dist)}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
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
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
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

              {/* PRICE FILTER */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Max Rescue Price
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['All', 'Under ₹60', '₹60 – ₹100', 'Above ₹100'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriceRange(p)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        priceRange === p
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* AVAILABILITY TOGGLES */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-800">Only Available Now</span>
                  <input
                    type="checkbox"
                    checked={availableNowOnly}
                    onChange={(e) => setAvailableNowOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-800">Urgent (&lt; 3 Portions Left)</span>
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
                    Surplus Meals
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {filteredMeals.length} found
                  </span>

                  {/* Active Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap ml-2">
                    {distanceRadius !== 'Any Distance' && (
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        {distanceRadius} <X className="w-3 h-3 cursor-pointer" onClick={() => setDistanceRadius('Any Distance')} />
                      </span>
                    )}
                    {selectedDietary !== 'All Meals' && (
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        {selectedDietary} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDietary('All Meals')} />
                      </span>
                    )}
                    {priceRange !== 'All' && (
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        {priceRange} <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('All')} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
                  >
                    <option>Distance: Nearest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Discount</option>
                    <option>Portions Left: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Meals Grid */}
              {filteredMeals.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No surplus food listings match your filters</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try expanding your distance radius or changing dietary preference. Hotels typically list new surplus batches between 5 PM and 9 PM.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMeals.map((meal) => (
                    <div
                      key={meal.id}
                      onClick={() => handleSelectMeal(meal)}
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
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          {meal.portionsLeft === 0 ? (
                            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                              SOLD OUT
                            </span>
                          ) : (
                            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                              {meal.portionsLeft} left
                            </span>
                          )}
                          <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                            -{meal.discountPercent}% OFF
                          </span>
                        </div>

                        {/* Timing bottom badge */}
                        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{meal.pickupWindowStart || '6:00'} – {meal.pickupWindowEnd || '8:00'} PM</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span className="truncate max-w-[140px]">{meal.restaurant}</span>
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

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                            <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              <Navigation className="w-3 h-3 text-emerald-600" />
                              {meal.distance}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600 font-medium truncate">{meal.category}</span>
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
                              handleSelectMeal(meal);
                            }}
                            disabled={meal.portionsLeft === 0}
                            className={`text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors ${
                              meal.portionsLeft === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                            }`}
                          >
                            {meal.portionsLeft === 0 ? 'Sold Out' : 'Reserve Meal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Carbon emissions impact banner */}
              <div className="mt-8 bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <Leaf className="w-3.5 h-3.5" /> Environmental & Budget Impact
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Every rescued meal cuts food waste & helps someone eat well
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl font-normal">
                    Real-time platform linking commercial hotel kitchens with students, workers, and food conscious citizens.
                  </p>
                </div>

                <button
                  onClick={() => setViewMode('map')}
                  className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-sm transition-colors text-xs whitespace-nowrap flex items-center gap-2 cursor-pointer"
                >
                  <MapIcon className="w-4 h-4 text-emerald-700" />
                  View All on OpenStreetMap
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
