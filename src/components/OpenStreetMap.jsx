import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin, Navigation, Compass, Layers, ExternalLink,
  Info, Sparkles, Clock, AlertTriangle, ArrowRight, CheckCircle2
} from 'lucide-react';
import { calculateDistanceKm, formatDistance, getOsmDirectionsUrl } from '../lib/geoUtils.js';

export default function OpenStreetMap({
  center = [22.7245, 75.8640],
  zoom = 13,
  meals = [],
  selectedMealId = null,
  onSelectMeal = null,
  userCoords = null,
  singleLocation = null,
  isPicker = false,
  pickerLocation = null,
  onLocationSelect = null,
  height = '420px',
  showDirectionsBtn = true,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const pickerMarkerRef = useRef(null);

  const [activeTileLayer, setActiveTileLayer] = useState('standard'); // 'standard' | 'humanitarian'
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Guard against multiple initializations
    if (!mapInstanceRef.current) {
      const initialCenter = singleLocation
        ? [singleLocation.lat, singleLocation.lng]
        : center;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add default OpenStreetMap Tile Layer
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Attribution at bottom-right
      L.control.attribution({ position: 'bottomright', prefix: 'OpenStreetMap' }).addTo(map);

      // Marker layers container
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const routeLayer = L.layerGroup().addTo(map);
      routeLayerRef.current = routeLayer;

      mapInstanceRef.current = map;
      setMapReady(true);

      // Invalidate size after DOM layout settles
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Find and remove existing tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      activeTileLayer === 'humanitarian'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }, [activeTileLayer]);

  // Click-to-pick Location Mode (For Partners listing food or setting kitchen location)
  useEffect(() => {
    if (!mapInstanceRef.current || !isPicker) return;
    const map = mapInstanceRef.current;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      if (onLocationSelect) {
        onLocationSelect({
          lat: Math.round(lat * 1000000) / 1000000,
          lng: Math.round(lng * 1000000) / 1000000
        });
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPicker, onLocationSelect]);

  // Update Markers when Meals, Single Location, Picker Location, or User Coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapReady) return;

    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    const route = routeLayerRef.current;

    layer.clearLayers();
    if (route) route.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Add User Location Marker (if available)
    if (userCoords && userCoords[0] && userCoords[1]) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60"></span>
            <div class="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = L.marker([userCoords[0], userCoords[1]], { icon: userIcon })
        .bindTooltip('<b>Your Current Location</b>', { direction: 'top', offset: [0, -10] })
        .addTo(layer);

      bounds.extend([userCoords[0], userCoords[1]]);
    }

    // 2. Single Location Mode (Meal Detail or Partner view)
    if (singleLocation && singleLocation.lat && singleLocation.lng) {
      const loc = [singleLocation.lat, singleLocation.lng];
      bounds.extend(loc);

      const destIcon = L.divIcon({
        className: 'custom-single-marker',
        html: `
          <div class="flex flex-col items-center cursor-pointer group">
            <div class="bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 group-hover:scale-105 transition-transform">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>${singleLocation.price ? `₹${singleLocation.price}` : 'Pickup'}</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-700 drop-shadow-sm -mt-0.5"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 36]
      });

      const popupHtml = `
        <div class="p-1 min-w-[210px] text-slate-800 font-sans">
          <div class="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 mb-0.5">
            Verified Foodie Partner
          </div>
          <h4 class="font-bold text-sm text-slate-900 leading-tight mb-1">
            ${singleLocation.restaurant || singleLocation.name || 'Restaurant'}
          </h4>
          <p class="text-xs text-slate-600 mb-2 leading-relaxed">
            ${singleLocation.address || 'Commercial Hub, Indore'}
          </p>
          ${singleLocation.pickupCounter ? `
            <div class="text-[11px] bg-slate-50 border border-slate-200/80 rounded-md p-1.5 mb-2 font-medium text-slate-700">
              📍 <b>Pickup Bay:</b> ${singleLocation.pickupCounter}
            </div>
          ` : ''}
          ${userCoords ? `
            <div class="text-[11px] text-emerald-800 font-semibold mb-2">
              🚗 ${formatDistance(calculateDistanceKm(userCoords[0], userCoords[1], singleLocation.lat, singleLocation.lng))}
            </div>
          ` : ''}
          <a
            href="${getOsmDirectionsUrl(userCoords ? userCoords[0] : 22.72, userCoords ? userCoords[1] : 75.86, singleLocation.lat, singleLocation.lng)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition"
          >
            Open in OpenStreetMap Directions ↗
          </a>
        </div>
      `;

      const marker = L.marker(loc, { icon: destIcon })
        .bindPopup(popupHtml, { maxWidth: 280 })
        .addTo(layer);

      marker.openPopup();

      // Draw dashed route line between user and destination
      if (userCoords && userCoords[0] && route) {
        const polyline = L.polyline([userCoords, loc], {
          color: '#059669',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.8
        }).addTo(route);
      }

      map.setView(loc, zoom || 14);
      return;
    }

    // 3. Picker Location Mode (Partner setting custom coords)
    if (isPicker && pickerLocation && pickerLocation.lat && pickerLocation.lng) {
      const pickerIcon = L.divIcon({
        className: 'custom-picker-marker',
        html: `
          <div class="flex flex-col items-center">
            <div class="bg-amber-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow-xl border-2 border-white flex items-center gap-1 animate-bounce">
              <span>📍 Kitchen Here</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500 -mt-0.5"></div>
          </div>
        `,
        iconSize: [100, 44],
        iconAnchor: [50, 40]
      });

      const pickerMarker = L.marker([pickerLocation.lat, pickerLocation.lng], {
        icon: pickerIcon,
        draggable: true
      })
        .bindTooltip('Drag me or click anywhere on map', { permanent: true, direction: 'top' })
        .addTo(layer);

      pickerMarker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            lat: Math.round(lat * 1000000) / 1000000,
            lng: Math.round(lng * 1000000) / 1000000
          });
        }
      });

      pickerMarkerRef.current = pickerMarker;
      bounds.extend([pickerLocation.lat, pickerLocation.lng]);
    }

    // 4. Explore Mode: Multiple Surplus Meal Markers
    if (meals && meals.length > 0) {
      meals.forEach((meal) => {
        const lat = meal.lat || 22.7196;
        const lng = meal.lng || 75.8577;
        const isSelected = selectedMealId === meal.id;
        const isSoldOut = meal.portionsLeft === 0;

        bounds.extend([lat, lng]);

        const priceText = `₹${meal.rescuePrice || 59}`;
        const discountText = meal.discountPercent ? `${meal.discountPercent}%` : '50%';

        // Dynamic Pin Styling
        const pinBg = isSoldOut
          ? 'bg-slate-400 text-white'
          : isSelected
          ? 'bg-amber-600 text-white ring-4 ring-amber-300'
          : 'bg-emerald-700 text-white hover:bg-emerald-800';

        const customMarkerIcon = L.divIcon({
          className: 'custom-meal-marker',
          html: `
            <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
              <div class="${pinBg} font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1">
                <span>${isSoldOut ? 'Sold Out' : priceText}</span>
                ${!isSoldOut ? `<span class="bg-white/20 text-[9px] px-1 rounded-sm">${discountText}</span>` : ''}
              </div>
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${isSoldOut ? 'border-t-slate-400' : isSelected ? 'border-t-amber-600' : 'border-t-emerald-700'} -mt-0.5"></div>
            </div>
          `,
          iconSize: [90, 36],
          iconAnchor: [45, 32]
        });

        // Compute distance from user if userCoords available
        const distanceStr = userCoords
          ? formatDistance(calculateDistanceKm(userCoords[0], userCoords[1], lat, lng))
          : meal.distance || '1.4 km away';

        // Rich Interactive Popup
        const popupContent = document.createElement('div');
        popupContent.className = 'w-[250px] p-1 font-sans text-slate-800';
        popupContent.innerHTML = `
          <div class="relative rounded-xl overflow-hidden mb-2 shadow-xs">
            <img
              src="${meal.image || 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80'}"
              alt="${meal.name}"
              class="w-full h-28 object-cover"
              onerror="this.src='https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80'"
            />
            <div class="absolute top-1.5 left-1.5 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              ${meal.portionsLeft > 0 ? `${meal.portionsLeft} Portions Left` : 'Sold Out'}
            </div>
            <div class="absolute bottom-1.5 right-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              ${distanceStr}
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              ${meal.category || 'Surplus Meal'} • ${meal.dietary || 'Veg'}
            </div>
            <h4 class="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
              ${meal.name}
            </h4>
            <p class="text-xs text-slate-500 line-clamp-1">
              ${meal.restaurant}
            </p>

            <div class="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <div>
                <span class="text-base font-extrabold text-emerald-700">₹${meal.rescuePrice}</span>
                <span class="text-xs text-slate-400 line-through ml-1.5">₹${meal.originalPrice}</span>
              </div>
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                ${meal.discountPercent || 50}% OFF
              </span>
            </div>

            <div class="text-[10px] text-slate-500 pt-0.5 flex items-center gap-1">
              <span>🕒 ${meal.pickupWindow || 'Today: 6:00 PM – 8:00 PM'}</span>
            </div>

            <button
              id="view-meal-btn-${meal.id}"
              class="mt-2 w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>${meal.portionsLeft > 0 ? 'Reserve Meal Now' : 'View Food Details'}</span>
              <span>→</span>
            </button>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customMarkerIcon })
          .bindPopup(popupContent, { maxWidth: 280 })
          .addTo(layer);

        // Bind button click inside popup
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-meal-btn-${meal.id}`);
          if (btn && onSelectMeal) {
            btn.onclick = () => {
              onSelectMeal(meal);
            };
          }
        });

        // Click on marker
        marker.on('click', () => {
          if (onSelectMeal) {
            onSelectMeal(meal);
          }
        });

        // If this meal is specifically selected, auto-open popup
        if (isSelected) {
          marker.openPopup();
        }
      });
    }

    // Auto-fit bounds if multiple markers exist and not picking
    if (!isPicker && bounds.isValid() && bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 100) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [meals, selectedMealId, userCoords, singleLocation, isPicker, pickerLocation, mapReady]);

  // Center on User GPS Handler
  const handleCenterOnUser = () => {
    if (!mapInstanceRef.current) return;
    if (userCoords && userCoords[0] && userCoords[1]) {
      mapInstanceRef.current.setView(userCoords, 15, { animate: true });
    } else {
      mapInstanceRef.current.setView(center, 14, { animate: true });
    }
  };

  // Reset to Default City Center
  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    const target = singleLocation
      ? [singleLocation.lat, singleLocation.lng]
      : center;
    mapInstanceRef.current.setView(target, zoom, { animate: true });
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-slate-100 ${className}`}>
      {/* The Leaflet Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Floating Header Info Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-bold text-slate-800">
            OpenStreetMap Live
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 text-[11px]">
            {isPicker
              ? 'Click or drag pin to set kitchen'
              : singleLocation
              ? 'Verified Pickup Point'
              : `${meals.length} Surplus Meals Available`}
          </span>
        </div>
      </div>

      {/* Floating Bottom Left Controls */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 flex-wrap">
        {/* Layer Toggle */}
        <button
          onClick={() => setActiveTileLayer(prev => prev === 'standard' ? 'humanitarian' : 'standard')}
          className="bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
          title="Switch Map Tile Theme"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">{activeTileLayer === 'standard' ? 'OSM Standard' : 'OSM Humanitarian'}</span>
        </button>

        {/* Locate Me Button */}
        {userCoords && (
          <button
            onClick={handleCenterOnUser}
            className="bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
            title="Center on my location"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">My Location</span>
          </button>
        )}

        {/* Reset View */}
        <button
          onClick={handleResetCenter}
          className="bg-white/95 hover:bg-white text-slate-700 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
          title="Reset Zoom & Center"
        >
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>

      {/* Picker Mode Instruction Bar */}
      {isPicker && (
        <div className="absolute bottom-3 right-3 z-20 bg-amber-500 text-white px-3 py-1.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-pulse">
          <MapPin className="w-3.5 h-3.5" />
          <span>Click anywhere to place pickup point</span>
        </div>
      )}
    </div>
  );
}
