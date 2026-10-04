import React, { useState, useRef } from 'react';
import PartnerLayout from './PartnerLayout.jsx';
import { useApp } from '../../context/AppContext.jsx';
import OpenStreetMap from '../../components/OpenStreetMap.jsx';
import {
  PlusCircle, Upload, CheckCircle2, Clock, ShieldCheck, Leaf,
  Sparkles, Camera, ArrowLeft, Eye, Smartphone, AlertCircle, MapPin,
  Image as ImageIcon, RefreshCw, Trash2, Check, FileUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_FOOD_PHOTOS = [
  { name: 'North Indian Deluxe Thali', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', tag: 'Thalis' },
  { name: 'Dum Handi Biryani Box', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', tag: 'Biryani' },
  { name: 'Artisan Bakery Surprise Basket', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', tag: 'Bakery' },
  { name: 'South Indian Tiffin Feast', url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', tag: 'South Indian' },
  { name: 'Festive Mithai & Sweets Box', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80', tag: 'Desserts' },
  { name: 'Paneer Makhani & Jeera Rice', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', tag: 'Curries' }
];

export default function PartnerAddFoodPage() {
  const { addNewSurplusListing, navigate, showToast } = useApp();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Form states matching screenshot 5
  const [foodName, setFoodName] = useState('Fresh Deluxe Veg Thali');
  const [category, setCategory] = useState('Meals & Thalis');
  const [dietary, setDietary] = useState('Pure Veg');
  const [description, setDescription] = useState(
    'Includes fresh steamed basmati rice, yellow dal tadka, 2 whole wheat rotis, paneer sabzi, and fresh salad. Prepared fresh during today\'s lunch banquet service, strictly temperature monitored and packaged in compostable compartmentalized meal trays.'
  );
  const [portions, setPortions] = useState(15);
  const [maxPerDiner, setMaxPerDiner] = useState('3 portions max');
  const [retailPrice, setRetailPrice] = useState(120);
  const [rescuePrice, setRescuePrice] = useState(59);
  const [startTime, setStartTime] = useState('06:00 PM');
  const [endTime, setEndTime] = useState('08:00 PM');
  const [counterGuidance, setCounterGuidance] = useState(
    'Please collect the food from Takeaway Counter #2 near the main reception desk. Show your Foodie digital token or QR code to staff member Rajat.'
  );
  const [restaurantAddress, setRestaurantAddress] = useState('Plot 42, University Commercial Complex, Sector 4, MG Road, Indore');
  const [kitchenCoords, setKitchenCoords] = useState({ lat: 22.7245, lng: 75.8640 });
  const [safetyCertified, setSafetyCertified] = useState(true);
  
  // Real Photo Upload States
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80');
  const [uploadedFileName, setUploadedFileName] = useState('thali_lunch_surplus_batch4.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [photoTab, setPhotoTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Compress and read image file to high-efficiency data URL
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('Image file is too large (> 12MB). Please pick a smaller photo.', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);

        setPhotoUrl(compressedDataUrl);
        setUploadedFileName(file.name || 'custom_food_photo.jpg');
        setIsUploading(false);
        showToast(`📸 Photo "${file.name}" uploaded and optimized!`, 'success');
      };
      img.onerror = () => {
        setIsUploading(false);
        showToast('Failed to process image file.', 'error');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setIsUploading(false);
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleCustomUrlApply = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setPhotoUrl(customUrlInput.trim());
    setUploadedFileName('external_image_url.jpg');
    showToast('Photo URL updated!', 'success');
  };

  const discountPercent = Math.round(((retailPrice - rescuePrice) / retailPrice) * 100) || 51;
  const estimatedRevenue = rescuePrice * portions;
  const dinerSavings = retailPrice - rescuePrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!safetyCertified) {
      showToast('Please check the Kitchen Safety & Expiry Assurance certificate.', 'error');
      return;
    }

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 }
    });

    addNewSurplusListing({
      name: foodName,
      subTitle: 'Fresh Kitchen Surplus Box',
      category: category,
      dietary: dietary,
      description: description,
      portions: Number(portions),
      originalPrice: Number(retailPrice),
      rescuePrice: Number(rescuePrice),
      startTime: startTime,
      endTime: endTime,
      image: photoUrl,
      pickupCounter: counterGuidance ? 'Takeaway Counter #1' : 'Takeaway Counter #1',
      restaurantAddress: restaurantAddress,
      lat: kitchenCoords.lat,
      lng: kitchenCoords.lng
    });
  };

  return (
    <PartnerLayout activeTab="add-food">
      <div className="space-y-6 pb-12">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Food Listings</span>
              <span>&gt;</span>
              <span className="text-emerald-700 font-bold">Add Surplus Food</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Add Surplus Food
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              List your safe surplus food and make it available to Foodie users at an affordable discount before kitchen closing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live System Sync
            </span>
            <button
              onClick={() => navigate('partner-bookings')}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Form, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: 5 Steps */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Food Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Food Information</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Basic Metadata
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Food Name *</label>
                  <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Food Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-medium"
                    >
                      <option>Meals & Thalis</option>
                      <option>Biryani & Rice</option>
                      <option>Bowls & Curries</option>
                      <option>Bakery & Breads</option>
                      <option>Snacks & Starters</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Dietary Classification *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDietary('Pure Veg')}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                          dietary === 'Pure Veg' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Pure Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setDietary('Non-Veg')}
                        className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                          dietary === 'Non-Veg' ? 'bg-rose-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        Non-Veg
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Portion Description & Contents *</label>
                    <span className="text-[10px] text-slate-400">{description.length} / 500 characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-normal leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-700">Special Attributes & Compliance Tags</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Contains Dairy', 'Nut-Free', 'Eco-Packaging', 'FSSAI Certified'].map((tag) => (
                      <label key={tag} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 cursor-pointer">
                        <input type="checkbox" defaultChecked={tag !== 'Nut-Free'} className="rounded text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-[11px] font-medium text-slate-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Surplus Item Photography (Real Upload & Camera) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Surplus Item Photography</h3>
                    <p className="text-[11px] text-slate-500">Upload live kitchen photo or select high-resolution menu shot</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                  ⚡ 3.5x Higher Bookings
                </span>
              </div>

              {/* Hidden Real Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Photo Source Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-full max-w-md text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPhotoTab('upload')}
                  className={`flex-1 py-1.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    photoTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Upload & Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('presets')}
                  className={`flex-1 py-1.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    photoTab === 'presets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Food Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('url')}
                  className={`flex-1 py-1.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    photoTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Web Link</span>
                </button>
              </div>

              {/* TAB 1: Real File Upload & Live Camera */}
              {photoTab === 'upload' && (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative p-6 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                        : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs">
                      {isUploading ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                      ) : (
                        <Upload className="w-6 h-6 text-emerald-700" />
                      )}
                    </div>
                    <p className="font-extrabold text-xs text-slate-900">
                      {isUploading ? 'Compressing and optimizing food photo...' : 'Click to Browse Food Photo or Drag & Drop Here'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WEBP up to 10MB • Auto-optimized for instant mobile load
                    </p>

                    <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Take Live Camera Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Active Preview Bar */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-inner">
                        <img src={photoUrl} alt="Active Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-slate-500 text-[11px]">Ready for Discovery Feed • High-Res Display</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Replace
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(PRESET_FOOD_PHOTOS[0].url);
                          setUploadedFileName('default_thali.jpg');
                          showToast('Reset to default food photo', 'info');
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Curated Indian Food Presets */}
              {photoTab === 'presets' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-slate-500">
                    Select a chef-grade photo matching your kitchen's surplus batch:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_FOOD_PHOTOS.map((p) => {
                      const isSelected = photoUrl === p.url;
                      return (
                        <div
                          key={p.name}
                          onClick={() => {
                            setPhotoUrl(p.url);
                            setUploadedFileName(`${p.name}.jpg`);
                            showToast(`Selected "${p.name}" photo`, 'success');
                          }}
                          className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition ${
                            isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                              : 'border-slate-200 hover:border-emerald-400'
                          }`}
                        >
                          <div className="aspect-4/3 overflow-hidden bg-slate-100">
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          </div>
                          <div className="p-2 bg-white text-left">
                            <span className="text-[9px] font-bold uppercase text-emerald-700 block">{p.tag}</span>
                            <span className="text-[11px] font-extrabold text-slate-900 block truncate">{p.name}</span>
                          </div>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Direct Web Image Link */}
              {photoTab === 'url' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-medium text-slate-500">
                    Paste an image URL hosted on Unsplash, Cloudinary, or your website:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={handleCustomUrlApply}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Quantity & Pricing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Quantity & Pricing</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Surplus Economics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Available Surplus Portions *</label>
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPortions(Math.max(1, portions - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-sm hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-base text-slate-900">{portions}</span>
                    <button
                      type="button"
                      onClick={() => setPortions(portions + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-sm hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Packaged ready for dispatch</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Portions per Diner *</label>
                  <select
                    value={maxPerDiner}
                    onChange={(e) => setMaxPerDiner(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option>3 portions max</option>
                    <option>2 portions max</option>
                    <option>4 portions max</option>
                    <option>No limit</option>
                  </select>
                  <span className="text-[10px] text-slate-400">Prevents bulk hoard & promotes fair access</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Original Retail Dine-in Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(Number(e.target.value))}
                      className="w-full p-3 pl-7 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Normal menu price</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Foodie Rescue Price *</label>
                    <span className="text-[10px] text-emerald-700 font-bold">Min 40% OFF recommended</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={rescuePrice}
                      onChange={(e) => setRescuePrice(Number(e.target.value))}
                      className="w-full p-3 pl-7 bg-emerald-50/50 border border-emerald-300 rounded-xl font-extrabold text-emerald-800 text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">{discountPercent}% Discount applied</span>
                </div>
              </div>

              {/* Economics calculator card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs">
                    {discountPercent}% OFF
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">Diner saves ₹{dinerSavings} per meal</h5>
                    <p className="text-[11px] text-slate-500">Quick turnaround expected within 45 mins</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Revenue</span>
                  <span className="text-xl font-extrabold text-emerald-800">₹{estimatedRevenue}</span>
                </div>
              </div>
            </div>

            {/* Step 4: Pickup Window & Instructions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">Pickup Window & Instructions</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Logistics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pickup Date *</label>
                  <input
                    type="text"
                    defaultValue="Today, 02 Oct"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Time *</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Time (Cutoff) *</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Takeaway Counter & Staff Guidance *</label>
                <textarea
                  rows={2}
                  value={counterGuidance}
                  onChange={(e) => setCounterGuidance(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-normal"
                />
              </div>

              {/* Kitchen Pickup Address & OpenStreetMap Pinpoint */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Restaurant Street Address *</label>
                  <input
                    type="text"
                    value={restaurantAddress}
                    onChange={(e) => setRestaurantAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Pin Restaurant on OpenStreetMap *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      GPS: {kitchenCoords.lat.toFixed(4)}, {kitchenCoords.lng.toFixed(4)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Click anywhere on the map or drag the orange marker to place your kitchen takeaway point.
                  </p>
                  
                  <div className="mt-2">
                    <OpenStreetMap
                      isPicker={true}
                      pickerLocation={kitchenCoords}
                      onLocationSelect={(coords) => setKitchenCoords(coords)}
                      center={[kitchenCoords.lat, kitchenCoords.lng]}
                      zoom={14}
                      height="230px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Kitchen Safety & Expiry Assurance */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">Kitchen Safety & Expiry Assurance</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600 ml-auto" />
              </div>

              <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={safetyCertified}
                  onChange={(e) => setSafetyCertified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span className="leading-relaxed font-medium">
                  I certify this surplus food was prepared within the last 4 hours, meets FSSAI hygiene standards, and has been kept at safe holding temperatures.
                </span>
              </label>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>The listing will automatically turn inactive once the countdown reaches <strong>{endTime}</strong> or portions reach 0.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Publish Surplus Listing
              </button>

              <button
                type="button"
                onClick={() => showToast('Draft saved successfully.', 'info')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs transition-colors text-xs"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => navigate('partner-bookings')}
                className="text-slate-400 hover:text-slate-600 font-medium text-xs px-4 py-2"
              >
                Cancel
              </button>
            </div>

          </form>

          {/* Right Sidebar: Live Diner Preview (Mobile App Frame) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" /> Live Diner Preview
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                Mobile App View
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              This is how your surplus meal card will appear in real-time to hungry diners searching within 3 km of your location.
            </p>

            {/* Mobile Device Frame */}
            <div className="bg-slate-900 rounded-[32px] p-3 shadow-2xl border-4 border-slate-800 max-w-[320px] mx-auto text-slate-900">
              
              {/* Phone Notch & Status */}
              <div className="flex items-center justify-between text-white text-[10px] font-bold px-3 py-1">
                <span>05:42 PM</span>
                <div className="flex items-center gap-1.5">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl overflow-hidden mt-2 shadow-inner">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                    <span className="bg-slate-900/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {portions} Left
                    </span>
                  </div>

                  <span className="absolute top-2 right-2 bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    ● {dietary}
                  </span>

                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-medium p-1 rounded flex items-center justify-between">
                    <span>⏱ Pickup Tonight • {startTime} – {endTime}</span>
                    <span>1.8 km</span>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">Sharma Restaurant & Banquets</span>
                    <span className="font-bold text-slate-800">★ 4.7 (184)</span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{foodName}</h4>

                  <div className="flex items-center gap-1 text-[9px] text-slate-500 flex-wrap">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Paneer</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Dal</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">Rotis</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">🌿 Eco tray</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-emerald-700">₹{rescuePrice}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{retailPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      Reserve Meal ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* CO2e Impact Callout */}
              <div className="mt-3 bg-emerald-950/90 text-emerald-200 p-2.5 rounded-xl text-[10px] flex items-start gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">CO2e Impact</span>
                  <p className="opacity-80">Publishing this prevents ~{(portions * 2.5).toFixed(1)} kg of greenhouse emissions from food waste.</p>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 text-center py-2">
                🔒 Verified Foodie Merchant Sandbox Preview
              </div>
            </div>

          </div>

        </div>

      </div>
    </PartnerLayout>
  );
}
