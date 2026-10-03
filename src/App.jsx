import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Diner Pages
import HomePage from './pages/diner/HomePage.jsx';
import ExploreFoodPage from './pages/diner/ExploreFoodPage.jsx';
import MealDetailPage from './pages/diner/MealDetailPage.jsx';
import BookingConfirmedPage from './pages/diner/BookingConfirmedPage.jsx';
import DinerDashboardPage from './pages/diner/DinerDashboardPage.jsx';
import AccountProfilePage from './pages/diner/AccountProfilePage.jsx';

// Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// System States Page
import SystemStatesPage from './pages/system/SystemStatesPage.jsx';

// Partner Pages
import PartnerDashboardPage from './pages/partner/PartnerDashboardPage.jsx';
import PartnerFoodManagementPage from './pages/partner/PartnerFoodManagementPage.jsx';
import PartnerAddFoodPage from './pages/partner/PartnerAddFoodPage.jsx';
import PartnerBookingsPage from './pages/partner/PartnerBookingsPage.jsx';
import PartnerBookingDetailPage from './pages/partner/PartnerBookingDetailPage.jsx';
import PartnerAnalyticsPage from './pages/partner/PartnerAnalyticsPage.jsx';
import PartnerProfilePage from './pages/partner/PartnerProfilePage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminFoodListingsPage from './pages/admin/AdminFoodListingsPage.jsx';
import AdminHotelsPage from './pages/admin/AdminHotelsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage.jsx';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

function AppContent() {
  const { currentRoute, currentRole, toast } = useApp();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const renderRoute = () => {
    switch (currentRoute) {
      // Diner Routes
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExploreFoodPage />;
      case 'meal-detail':
        return <MealDetailPage />;
      case 'booking-confirmed':
        return <BookingConfirmedPage />;
      case 'dashboard':
        return <DinerDashboardPage />;
      case 'profile':
        return <AccountProfilePage />;

      // Auth Routes
      case 'login':
        return <LoginPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'reset-password':
        return <ResetPasswordPage />;

      // System State Showcase
      case 'system-states':
        return <SystemStatesPage />;

      // Partner Routes
      case 'partner-dashboard':
        return <PartnerDashboardPage />;
      case 'partner-food':
        return <PartnerFoodManagementPage />;
      case 'partner-add-food':
        return <PartnerAddFoodPage />;
      case 'partner-bookings':
        return <PartnerBookingsPage />;
      case 'partner-booking-detail':
        return <PartnerBookingDetailPage />;
      case 'partner-analytics':
        return <PartnerAnalyticsPage />;
      case 'partner-profile':
        return <PartnerProfilePage />;

      // Admin Routes
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-food':
        return <AdminFoodListingsPage />;
      case 'admin-hotels':
        return <AdminHotelsPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-bookings':
        return <AdminBookingsPage />;
      case 'admin-payments':
        return <AdminPaymentsPage />;
      case 'admin-complaints':
        return <AdminComplaintsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;

      default:
        return <HomePage />;
    }
  };

  const isDinerExperience = [
    'home',
    'explore',
    'meal-detail',
    'booking-confirmed',
    'dashboard',
    'profile',
  ].includes(currentRoute);

  const isAuthPage = ['login', 'forgot-password', 'reset-password'].includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFDFB] text-gray-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Diner Standard Navbar (Only on Diner Views) */}
      {isDinerExperience && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Diner Standard Footer */}
      {isDinerExperience && <Footer />}

      {/* Global Interactive Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce shadow-2xl">
          <div
            className={`px-4 py-3 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : toast.type === 'info'
                ? 'bg-blue-900 text-blue-100 border-blue-700'
                : 'bg-emerald-900 text-emerald-100 border-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
