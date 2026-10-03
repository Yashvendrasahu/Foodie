import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  User, Mail, Phone, MapPin, Shield, Bell, Lock, Download, Trash2,
  CheckCircle2, Sparkles, Share2, Edit3, Key, Smartphone, Laptop,
  HelpCircle, LogOut, ChevronRight, Leaf
} from 'lucide-react';

export default function AccountProfilePage() {
  const { dinerProfile, setDinerProfile, showToast, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [name, setName] = useState(dinerProfile.name);
  const [email, setEmail] = useState(dinerProfile.email);
  const [phone, setPhone] = useState(dinerProfile.phone);
  const [location, setLocation] = useState(dinerProfile.location);
  const [dietary, setDietary] = useState(dinerProfile.dietaryPreference);
  const [radius, setRadius] = useState(dinerProfile.preferredRadius);
  const [timePref, setTimePref] = useState('Evening (6 PM – 9 PM)');

  // Notification toggles
  const [notifs, setNotifs] = useState(dinerProfile.notifications);

  const handleSavePersonal = (e) => {
    e.preventDefault();
    setDinerProfile(prev => ({
      ...prev,
      name,
      email,
      phone,
      location,
      dietaryPreference: dietary,
      preferredRadius: radius,
      notifications: notifs
    }));
    showToast('Account preferences updated successfully!', 'success');
  };

  const toggleNotif = (key) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#fafcfb] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>FOODIE ACCOUNT HUB</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Settings & Impact Profile</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Account Preferences
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Activity Log: 15 meals collected safely from 6 partner restaurants.')}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
            >
              View Activity Log
            </button>
            <button
              onClick={() => showToast('Exporting impact metrics to PDF...', 'info')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Metrics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Nav links */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'profile' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-emerald-700" />
                Profile & Impact
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-slate-400" />
                Personal Information
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  My Bookings
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2 Active
                </span>
              </button>
              <button
                onClick={() => showToast('9 saved restaurant venues in Indore.', 'info')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Saved Venues
                </span>
                <span className="text-slate-400 text-[11px]">9</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Leaf className="w-4 h-4 text-slate-400" />
                Rescue Preferences
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-400" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                Security & Sessions
              </button>
              <button
                onClick={() => navigate('admin-complaints')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Help & Support
              </button>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate('login')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Rescue Meter Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Rescue Meter</span>
                <span className="font-extrabold text-emerald-700">Level 3</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-slate-900">15 rescued</span>
                <span className="text-[11px] text-slate-400 font-semibold">5 to Level 4</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-700 h-2 rounded-full w-3/4" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-emerald-50/70 p-2.5 rounded-xl text-center">
                  <div className="text-sm font-extrabold text-emerald-800">31.5 kg</div>
                  <div className="text-[10px] text-emerald-700 font-medium">CO2 Prevented</div>
                </div>
                <div className="bg-amber-50/70 p-2.5 rounded-xl text-center">
                  <div className="text-sm font-extrabold text-amber-900">₹3,420</div>
                  <div className="text-[10px] text-amber-700 font-medium">Money Saved</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Main Content Sections */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Top User Badge Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{name}</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Diner
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>✉ {email}</span>
                    <span>📞 {phone}</span>
                    <span>📅 Member Since September 2026</span>
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-lg">
                    <span>🌱</span>
                    <span>Level 3 Food Rescuer (15 Meals Saved)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Profile edit mode enabled.', 'info')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
                <button
                  onClick={() => showToast('Badge image link copied to clipboard!', 'info')}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Share Badge
                </button>
              </div>
            </div>

            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-500">Update your core diner identity and preferred pickup contact points</p>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Email Address *</label>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Default Pickup Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Last modified: Yesterday, 7:42 PM</span>
                <button
                  onClick={handleSavePersonal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Section 2: Food Preferences & Rescue Settings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Food Preferences & Rescue Settings</h3>
                  <p className="text-xs text-slate-500">Tailor recommendations to match your palate, dietary lifestyle, and commute window</p>
                </div>
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Dietary preference pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Dietary Preference</label>
                <div className="flex flex-wrap items-center gap-2">
                  {['Pure Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggitarian'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietary(diet)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        dietary === diet
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Food Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Preferred Food Categories</label>
                  <span className="text-[11px] text-slate-400">4 Selected</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Meals & Thalis', 'Biryani & Rice', 'Artisan Bakery', 'Snacks & Chaat'].map((cat) => (
                    <div key={cat} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span className="font-medium text-slate-800 truncate">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius & Time Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Preferred Pickup Radius</label>
                    <span className="text-[11px] font-semibold text-emerald-700">3 km active</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {['1 km', '3 km', '5 km', '10 km'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRadius(r)}
                        className={`py-2 rounded-xl font-bold transition-all ${
                          radius === r ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Pickup Time Preference</label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      onClick={() => setTimePref('Evening (6 PM – 9 PM)')}
                      className={`p-2 rounded-xl font-bold text-left transition-all ${
                        timePref.includes('Evening') ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="block text-[11px] uppercase opacity-80">Evening Window</span>
                      <span>6 PM – 9 PM</span>
                    </button>
                    <button
                      onClick={() => setTimePref('Lunch (12 PM – 3 PM)')}
                      className={`p-2 rounded-xl font-bold text-left transition-all ${
                        timePref.includes('Lunch') ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="block text-[11px] uppercase opacity-80">Lunch Window</span>
                      <span>12 PM – 3 PM</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Section 3: Notification Channels & Alerts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Notification Channels & Alerts</h3>
                  <p className="text-xs text-slate-500">Stay on top of live rescue alerts without unwanted noise</p>
                </div>
                <Bell className="w-5 h-5 text-amber-600" />
              </div>

              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h5 className="font-bold text-slate-900">Booking Confirmations</h5>
                    <p className="text-slate-500 text-[11px]">Instant SMS and push notification when booking is confirmed by the restaurant</p>
                  </div>
                  <button
                    onClick={() => toggleNotif('bookingConfirmations')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifs.bookingConfirmations ? 'bg-emerald-700' : 'bg-slate-200'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifs.bookingConfirmations ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="font-bold text-slate-900">Pickup Reminders</h5>
                    <p className="text-slate-500 text-[11px]">Alert 45 minutes and 15 minutes before pickup window closes</p>
                  </div>
                  <button
                    onClick={() => toggleNotif('pickupReminders')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifs.pickupReminders ? 'bg-emerald-700' : 'bg-slate-200'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifs.pickupReminders ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="font-bold text-slate-900">Expiring Food Alerts</h5>
                    <p className="text-slate-500 text-[11px]">Get notified when favorites have surplus ready for rescue with 50–70% markdowns</p>
                  </div>
                  <button
                    onClick={() => toggleNotif('expiringFoodAlerts')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifs.expiringFoodAlerts ? 'bg-emerald-700' : 'bg-slate-200'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifs.expiringFoodAlerts ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h5 className="font-bold text-slate-900">New Food Near Me</h5>
                    <p className="text-slate-500 text-[11px]">Daily evening digest of restaurants listing nearby surplus within 3 km</p>
                  </div>
                  <button
                    onClick={() => toggleNotif('newFoodNearMe')}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifs.newFoodNearMe ? 'bg-emerald-700' : 'bg-slate-200'}`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifs.newFoodNearMe ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 4: Security & Login Sessions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Security & Login Sessions</h3>
                  <p className="text-xs text-slate-500">Protect your account access tokens and monitor active connections</p>
                </div>
                <Shield className="w-5 h-5 text-emerald-700" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Key className="w-4 h-4 text-slate-500" /> Change Password
                  </div>
                  <input type="password" placeholder="Current Password" className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl" />
                  <input type="password" placeholder="New Password (min 8 characters)" className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl" />
                  <button onClick={() => showToast('Password updated successfully!', 'success')} className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl w-full">
                    Update Password
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" /> 2-Factor Authentication
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Enabled
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your login is protected with code prompts sent via Google Authenticator & backup SMS.
                    </p>
                  </div>
                  <button onClick={() => alert('2FA Reconfiguration code generated.')} className="text-xs font-bold text-emerald-700 hover:underline text-left mt-3">
                    Reconfigure
                  </button>
                </div>
              </div>

              {/* Active Logged-in Devices */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-slate-600" />
                  <div>
                    <h5 className="font-bold text-slate-900">Chrome on macOS • Indore, India</h5>
                    <p className="text-[11px] text-slate-500">Current Active Session • IP: 103.21.***.4</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  ● Active Now
                </span>
              </div>
            </div>

            {/* Section 5: Account Data & Danger Zone */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Account Data & Danger Zone</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Download className="w-4 h-4 text-slate-600" /> Download My Data
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Download a machine-readable JSON/CSV archive containing all your past bookings, ratings, and ecological metric logs.
                  </p>
                  <button onClick={() => showToast('Archive requested. Download link sent to your email.', 'info')} className="bg-white border border-slate-200 hover:bg-slate-100 font-bold px-3.5 py-2 rounded-xl w-full">
                    Request Archive File
                  </button>
                </div>

                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <Trash2 className="w-4 h-4 text-rose-600" /> Delete Account
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    Permanently deactivate your profile, forfeiting your rescue credentials, badge progress, and active wallet credits.
                  </p>
                  <button onClick={() => alert('Account deletion confirmation sent.')} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2 rounded-xl w-full">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Need Help with an Order Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Need Help with an Order?</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Contact Foodie 24/7 diner support if you have any questions regarding your pickup window, payment receipts, or partner venue directions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate('admin-complaints')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => alert('FAQ: How do I collect food? Head to the counter and show your QR code.')}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-200 shadow-xs"
                >
                  FAQs
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
