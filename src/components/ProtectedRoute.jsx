import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { dbGetProfile } from '../lib/supabaseClient.js';
import {
  ShieldAlert, Lock, ArrowRight, User, Store, Shield,
  ArrowLeft, RefreshCw, CheckCircle2, LogIn, AlertTriangle
} from 'lucide-react';

/**
 * ProtectedRoute Component
 * Restricts access to dashboard components based on user authentication
 * and user role stored in Supabase 'profiles' table / auth metadata.
 * 
 * @param {Array<string>|string} allowedRoles - e.g. ['diner'], ['partner'], ['admin']
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string} portalName - Optional human-readable name of the portal
 */
export default function ProtectedRoute({
  allowedRoles = ['diner'],
  children,
  portalName
}) {
  const {
    isLoggedIn,
    authUser,
    currentRole,
    navigate,
    performLogin,
    showToast
  } = useApp();

  const [dbRole, setDbRole] = useState(null);
  const [isVerifyingRole, setIsVerifyingRole] = useState(false);

  // Normalize allowed roles list
  const normalizedAllowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(r => {
    const lower = String(r).toLowerCase().trim();
    if (lower === 'customer') return 'diner';
    if (lower === 'business' || lower === 'restaurant') return 'partner';
    if (lower === 'superadmin') return 'admin';
    return lower;
  });

  // Verify role from Supabase 'profiles' table whenever authUser changes
  useEffect(() => {
    let isMounted = true;
    async function checkDatabaseProfile() {
      if (!authUser) {
        setDbRole(null);
        return;
      }

      const identifier = authUser.id || authUser.email;
      if (!identifier) return;

      try {
        setIsVerifyingRole(true);
        const profile = await dbGetProfile(identifier);
        if (isMounted && profile?.role) {
          const fetchedRole = String(profile.role).toLowerCase().trim();
          setDbRole(fetchedRole);
        }
      } catch (err) {
        console.warn('ProtectedRoute profile lookup:', err);
      } finally {
        if (isMounted) setIsVerifyingRole(false);
      }
    }

    checkDatabaseProfile();
    return () => {
      isMounted = false;
    };
  }, [authUser]);

  // Determine active effective role
  const effectiveRole = (
    dbRole ||
    authUser?.user_metadata?.role ||
    currentRole ||
    'diner'
  ).toLowerCase().trim();

  // 1. If not authenticated at all -> Show Login Required state
  if (!isLoggedIn || !authUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#f8faf9]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
          
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-amber-50 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
              Authentication Required
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Please Sign In
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Access to {portalName || 'this dashboard'} requires an authenticated account.
              Please login with your credentials to continue.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('login')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email & Password</span>
            </button>

            {/* Quick Demo Login Option based on required role */}
            <button
              onClick={() => {
                const targetRole = normalizedAllowed[0] || 'diner';
                if (targetRole === 'partner') {
                  const demoPartner = {
                    id: 'usr-sharma-partner',
                    email: 'sharma@restaurant.com',
                    user_metadata: {
                      full_name: 'Sharma Sweets & Restaurant',
                      restaurant_name: 'Sharma Sweets & Restaurant',
                      role: 'partner'
                    }
                  };
                  performLogin(demoPartner, 'partner');
                  showToast('Signed in as Kitchen Partner (Sharma Sweets)!', 'success');
                  navigate('partner-dashboard');
                } else if (targetRole === 'admin') {
                  const demoAdmin = {
                    id: 'usr-admin-super',
                    email: 'admin@foodie.org',
                    user_metadata: {
                      full_name: 'Super Admin',
                      role: 'admin'
                    }
                  };
                  performLogin(demoAdmin, 'admin');
                  showToast('Signed in as Platform Admin!', 'success');
                  navigate('admin-dashboard');
                } else {
                  const demoDiner = {
                    id: 'USR-9021',
                    email: 'rahul.sharma@example.com',
                    user_metadata: {
                      full_name: 'Rahul Sharma',
                      role: 'diner'
                    }
                  };
                  performLogin(demoDiner, 'diner');
                  showToast('Signed in as Diner (Rahul Sharma)!', 'success');
                  navigate('dashboard');
                }
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span className="text-emerald-700">⚡</span>
              <span>1-Click Demo Login as {normalizedAllowed[0] === 'partner' ? 'Kitchen Partner' : normalizedAllowed[0] === 'admin' ? 'Admin' : 'Customer'}</span>
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. Check if user role matches allowed roles
  const hasAccess = normalizedAllowed.includes(effectiveRole);

  // 3. If role mismatch -> Show Access Restricted state
  if (!hasAccess) {
    const requiredRoleDisplay = normalizedAllowed
      .map(r => r === 'diner' ? 'Customer / Diner' : r === 'partner' ? 'Food Business / Partner' : 'Platform Admin')
      .join(' or ');

    const currentRoleDisplay = effectiveRole === 'partner'
      ? 'Food Business / Kitchen Partner'
      : effectiveRole === 'admin'
      ? 'Platform Super Admin'
      : 'Customer / Diner';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#f8faf9]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
          
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
            <ShieldAlert className="w-8 h-8 text-rose-700" />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-rose-50 text-rose-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
              Access Restricted • Role Mismatch
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Interface Restricted
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              This interface is restricted to <strong>{requiredRoleDisplay}</strong> accounts.
              Your account is currently registered as <strong>{currentRoleDisplay}</strong>.
            </p>
          </div>

          {/* Role status info box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Logged-in User:</span>
              <span className="font-bold text-slate-900 truncate max-w-[180px]">
                {authUser?.email || authUser?.user_metadata?.full_name || 'Current User'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Your Database Role:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 uppercase text-[10px]">
                {effectiveRole}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Required Role:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase text-[10px]">
                {normalizedAllowed.join(', ')}
              </span>
            </div>
          </div>

          {/* Action routing */}
          <div className="space-y-2.5 pt-2">
            {effectiveRole === 'partner' ? (
              <button
                onClick={() => navigate('partner-dashboard')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Go to Your Kitchen Partner Dashboard</span>
              </button>
            ) : effectiveRole === 'admin' ? (
              <button
                onClick={() => navigate('admin-dashboard')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Go to Platform Admin Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('dashboard')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Go to Your Customer Bookings Dashboard</span>
              </button>
            )}

            <button
              onClick={() => navigate('login')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Switch Account / Sign In with Different Role</span>
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold text-center hover:underline cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 4. Access Granted -> Render authorized component
  return children;
}
