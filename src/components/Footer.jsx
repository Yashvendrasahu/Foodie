import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ShieldCheck, CheckCircle2, Share2, Globe, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const { navigate, switchRole } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-16 pb-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 3a9 9 0 0 0-9 9v1h18v-1a9 9 0 0 0-9-9zm-1-2h2v2h-2V1zm-9 14h20v2H2v-2zm3 4h14v2H5v-2z" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Foodie</span>
            </div>

            <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200/60">
              Good Food. Less Waste. Better Prices.
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Connecting local hotels and restaurants with community members to rescue delicious, high-quality surplus meals at up to 70% off.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => alert('Shared Foodie rescue movement link copied!')}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center text-slate-500 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center text-slate-500 transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('profile')}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center text-slate-500 transition-colors"
                title="Contact"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('admin-complaints')}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center text-slate-500 transition-colors"
                title="Support Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EXPLORE FOOD */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Explore Food</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Today's Meals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Student Specials
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Nearby Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Mystery Bags
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Fresh Bakery
                </button>
              </li>
            </ul>
          </div>

          {/* FOR PARTNERS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">For Partners</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('partner-add-food')} className="hover:text-emerald-700 transition-colors">
                  List Surplus Food
                </button>
              </li>
              <li>
                <button onClick={() => switchRole('partner')} className="hover:text-emerald-700 transition-colors">
                  Partner Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-hotels')} className="hover:text-emerald-700 transition-colors">
                  Food Safety Standards
                </button>
              </li>
              <li>
                <button onClick={() => switchRole('partner')} className="hover:text-emerald-700 transition-colors">
                  Partner Success Stories
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY & TRUST */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-emerald-700 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-reports')} className="hover:text-emerald-700 transition-colors">
                  Our Environmental Impact
                </button>
              </li>
              <li>
                <button onClick={() => navigate('home')} className="hover:text-emerald-700 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('system-states')} className="hover:text-emerald-700 transition-colors">
                  Community Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-emerald-700 transition-colors">
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* SUPPORT & LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Support & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('admin-complaints')} className="hover:text-emerald-700 transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => navigate('profile')} className="hover:text-emerald-700 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('system-states')} className="hover:text-emerald-700 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('system-states')} className="hover:text-emerald-700 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('system-states')} className="hover:text-emerald-700 transition-colors">
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 Foodie Technologies Inc. All rights reserved. Fighting food waste, one delicious meal at a time.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe Food Certified</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Inspected</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
