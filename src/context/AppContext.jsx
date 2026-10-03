import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MEALS,
  INITIAL_BOOKINGS,
  INITIAL_USERS,
  INITIAL_HOTEL_VERIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_TRANSACTIONS,
  INITIAL_PLATFORM_SETTINGS
} from '../data/mockData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current Role: 'diner' | 'partner' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('foodie_role') || 'diner';
  });

  // Navigation route:
  // Diner: 'home', 'explore', 'meal-detail', 'booking-confirmed', 'dashboard', 'profile', 'login', 'signup', 'forgot-password', 'reset-password', 'system-states'
  // Partner: 'partner-bookings', 'partner-booking-detail', 'partner-add-food', 'partner-analytics', 'partner-listings'
  // Admin: 'admin-bookings', 'admin-listings', 'admin-hotels', 'admin-users', 'admin-payments', 'admin-reports', 'admin-complaints', 'admin-settings'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('foodie_view') || 'home';
  });

  // Selected item contexts
  const [selectedMealId, setSelectedMealId] = useState('meal-1');
  const [selectedBookingId, setSelectedBookingId] = useState('FD-4827');
  const [selectedTicketId, setSelectedTicketId] = useState('TKT-3901');
  const [selectedHotelAppId, setSelectedHotelAppId] = useState('APP-8841');
  const [selectedUserId, setSelectedUserId] = useState('USR-9021');

  // Core collections
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('foodie_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('foodie_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('foodie_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [hotelVerifications, setHotelVerifications] = useState(() => {
    const saved = localStorage.getItem('foodie_verifications');
    return saved ? JSON.parse(saved) : INITIAL_HOTEL_VERIFICATIONS;
  });

  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('foodie_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('foodie_txns');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem('foodie_settings');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
  });

  // Diner Profile
  const [dinerProfile, setDinerProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    location: 'Indore, Madhya Pradesh - 452001',
    rescueTier: 'Level 3 Food Rescuer (15 Meals Saved)',
    dietaryPreference: 'Pure Vegetarian',
    preferredCategories: ['Meals & Thalis', 'Biryani & Rice', 'Artisan Bakery', 'Snacks & Chaat'],
    preferredRadius: '3 km',
    pickupTimePreference: 'Evening (6 PM – 9 PM)',
    twoFactorEnabled: true,
    notifications: {
      bookingConfirmations: true,
      pickupReminders: true,
      expiringFoodAlerts: true,
      newFoodNearMe: true,
      promotionalImpact: false
    }
  });

  // Global Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('foodie_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('foodie_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('foodie_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('foodie_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('foodie_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('foodie_verifications', JSON.stringify(hotelVerifications));
  }, [hotelVerifications]);

  useEffect(() => {
    localStorage.setItem('foodie_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('foodie_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // Navigate helper
  const navigate = (view, extraParams = {}) => {
    if (extraParams.mealId) setSelectedMealId(extraParams.mealId);
    if (extraParams.bookingId) setSelectedBookingId(extraParams.bookingId);
    if (extraParams.ticketId) setSelectedTicketId(extraParams.ticketId);
    if (extraParams.hotelAppId) setSelectedHotelAppId(extraParams.hotelAppId);
    if (extraParams.userId) setSelectedUserId(extraParams.userId);
    
    // Auto switch role if navigating to admin or partner
    if (view.startsWith('partner-')) {
      setCurrentRole('partner');
    } else if (view.startsWith('admin-')) {
      setCurrentRole('admin');
    } else if (['home', 'explore', 'meal-detail', 'booking-confirmed', 'dashboard', 'profile', 'login', 'signup', 'forgot-password', 'reset-password', 'system-states'].includes(view)) {
      if (currentRole === 'admin' || currentRole === 'partner') {
        // preserve role or allow switching
      }
    }
    
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch role and go to default landing for that role
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'diner') {
      setCurrentView('home');
    } else if (newRole === 'partner') {
      setCurrentView('partner-bookings');
    } else if (newRole === 'admin') {
      setCurrentView('admin-bookings');
    }
    showToast(`Switched to ${newRole === 'diner' ? 'Diner Portal' : newRole === 'partner' ? 'Restaurant Partner Hub' : 'Platform Super Admin'}`, 'info');
  };

  // Actions: Booking a meal
  const bookMeal = (meal, portions = 1, specialNote = '') => {
    const bookingId = `FD-${Math.floor(4800 + Math.random() * 900)}`;
    const otp = `${Math.floor(100 + Math.random() * 900)} - ${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = meal.rescuePrice * portions;
    const packagingFee = 0;
    const totalPaid = subtotal + packagingFee;
    const co2Saved = Number((meal.co2SavedKg * portions).toFixed(1));

    const newBooking = {
      id: bookingId,
      tokenCode: bookingId,
      otp: otp,
      mealId: meal.id,
      mealTitle: meal.name,
      subTitle: `${portions} portion${portions > 1 ? 's' : ''} (${meal.subTitle || 'Packed meal'})`,
      restaurantName: meal.restaurant,
      restaurantAddress: meal.restaurantAddress,
      pickupCounter: meal.pickupCounter || 'Takeaway Counter #1',
      customerName: dinerProfile.name,
      customerPhone: dinerProfile.phone,
      customerEmail: dinerProfile.email,
      customerRescueTier: 'Level 3 Rescuer',
      portions: portions,
      originalAmount: meal.originalPrice * portions,
      mealSubtotal: subtotal,
      packagingFee: packagingFee,
      foodWasteCredit: 0,
      totalPaid: totalPaid,
      paymentMethod: 'Paid via UPI',
      paymentDetails: `UPI Ref #UPI-${Date.now().toString().slice(-8)} • Escrow Cleared`,
      status: 'Ready for Pickup',
      bookingDate: '02 October 2026, 6:00 PM',
      placedTimestamp: '02 October 2026 6:00 PM',
      pickupWindow: meal.pickupWindow || 'Today, 6:00 PM – 8:00 PM',
      pickupDeadline: '8:00 PM cutoff',
      expiresInText: '01h 58m 30s',
      distance: `${meal.distance} away • ~6 min drive`,
      specialNote: specialNote || 'Please pack with eco-cutlery. Thank you!',
      co2SavedKg: co2Saved,
      ecopoints: portions * 6,
      waterSavedL: meal.waterSavedL * portions,
      qrValue: `FOODIE-RESCUE-${bookingId}-SECURE-UPI${totalPaid}`,
      image: meal.image,
      lifecycleStep: 3
    };

    // Update meal portion count
    setMeals(prev => prev.map(m => {
      if (m.id === meal.id) {
        const left = Math.max(0, m.portionsLeft - portions);
        return { ...m, portionsLeft: left, soldCount: m.soldCount + portions };
      }
      return m;
    }));

    // Add to bookings
    setBookings(prev => [newBooking, ...prev]);
    setSelectedBookingId(bookingId);

    // Add to transactions
    const newTxn = {
      txnId: `TXN-${Math.floor(984000 + Math.random() * 999)}`,
      gatewayRef: `rzp_live_${Math.random().toString(36).slice(2, 8)}`,
      bookingId: bookingId,
      items: `${portions}x ${meal.name}`,
      customerName: dinerProfile.name,
      customerPhone: dinerProfile.phone,
      customerTier: 'Lv.3 Rescuer',
      restaurantName: meal.restaurant,
      counter: meal.pickupCounter,
      amount: totalPaid,
      savedAmount: (meal.originalPrice * portions) - totalPaid,
      discountPercent: meal.discountPercent,
      paymentMode: 'UPI • GPay',
      timestamp: 'Just now',
      pickupTime: meal.pickupWindow,
      escrowStatus: 'Successful',
      statusBadge: 'Successful'
    };
    setTransactions(prev => [newTxn, ...prev]);

    showToast(`🎉 Booking confirmed! Digital Token #${bookingId} issued.`, 'success');
    navigate('booking-confirmed', { bookingId });
  };

  // Actions: Cancel booking
  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled', lifecycleStep: 0 };
      }
      return b;
    }));
    showToast(`Booking #${bookingId} cancelled. Refund credited to original source.`, 'info');
  };

  // Partner Actions: Token Handover / Pickup complete
  const markBookingHandedOver = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Completed', lifecycleStep: 5 };
      }
      return b;
    }));
    showToast(`✅ Food handed over! Escrow payout of booking #${bookingId} released.`, 'success');
  };

  const markBookingReady = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Ready for Pickup', lifecycleStep: 3 };
      }
      return b;
    }));
    showToast(`Meal marked Ready for Pickup! Diner notified via WhatsApp & SMS.`, 'success');
  };

  // Partner: Add new surplus listing
  const addNewSurplusListing = (listingData) => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: listingData.name || 'Fresh Surplus Special',
      subTitle: listingData.subTitle || 'Eco-Box Rescue Meal',
      category: listingData.category || 'Meals & Thalis',
      dietary: listingData.dietary || 'Pure Veg',
      restaurant: listingData.restaurant || 'Sharma Restaurant & Banquets',
      restaurantAddress: 'Plot 42, University Commercial Complex, MG Road, Indore',
      pickupCounter: listingData.pickupCounter || 'Counter 2 (Takeaway Desk)',
      distance: '1.8 km',
      distanceNum: 1.8,
      area: 'Downtown & Campus Area',
      rating: 4.8,
      reviewsCount: 1,
      fssaiLic: '1001901100234',
      originalPrice: Number(listingData.originalPrice) || 120,
      rescuePrice: Number(listingData.rescuePrice) || 59,
      discountPercent: Math.round(((Number(listingData.originalPrice) - Number(listingData.rescuePrice)) / Number(listingData.originalPrice)) * 100) || 50,
      portionsLeft: Number(listingData.portions) || 15,
      totalPortions: Number(listingData.portions) || 15,
      soldCount: 0,
      pickupWindow: `Today: ${listingData.startTime || '6:00 PM'} – ${listingData.endTime || '8:00 PM'}`,
      pickupWindowStart: listingData.startTime || '18:00',
      pickupWindowEnd: listingData.endTime || '20:00',
      windowStatus: `Pickup ${listingData.startTime || '6:00 PM'} - ${listingData.endTime || '8:00 PM'}`,
      urgencyTag: `${listingData.portions || 15} portions available`,
      badge: 'Fresh Today',
      image: listingData.image || 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        listingData.image || 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
      ],
      description: listingData.description || 'Surplus prepared fresh by hotel chefs today, strictly temperature controlled and packaged in food-grade biodegradable sugarcane pulp containers.',
      co2SavedKg: 1.4,
      waterSavedL: 300,
      contents: [
        { name: 'Fresh Kitchen Surplus Pack', desc: listingData.description || 'Delicious chef special meal', icon: 'Utensils' }
      ],
      tags: listingData.tags || ['Contains Dairy', 'Eco-Packaging', 'FSSAI Certified'],
      ecoPackaging: true,
      sensorTemp: '65°C Verified',
      cookTime: 'Cooked fresh today.'
    };

    setMeals(prev => [newMeal, ...prev]);
    showToast('✨ New surplus batch published successfully! Live on diner discovery feed.', 'success');
    navigate('partner-bookings');
  };

  // Admin Actions: Approve Hotel
  const approveHotel = (appId) => {
    setHotelVerifications(prev => prev.map(h => {
      if (h.id === appId) {
        return { ...h, status: 'Verified', statusBadge: 'Verified Partner' };
      }
      return h;
    }));
    showToast(`Hotel #${appId} approved & FSSAI verified! Listing privileges enabled.`, 'success');
  };

  const rejectHotel = (appId) => {
    setHotelVerifications(prev => prev.map(h => {
      if (h.id === appId) {
        return { ...h, status: 'Rejected', statusBadge: 'Rejected' };
      }
      return h;
    }));
    showToast(`Hotel application #${appId} rejected.`, 'info');
  };

  // Admin Actions: Resolve Complaint Ticket
  const resolveTicket = (ticketId, refund = false) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'Resolved' };
      }
      return t;
    }));
    showToast(refund ? `Ticket #${ticketId} resolved with ₹89 refund processed to diner.` : `Ticket #${ticketId} marked as resolved.`, 'success');
  };

  // Meal Management
  const updateMealStatus = (mealId, newStatus) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, status: newStatus } : m));
    showToast(`Meal status updated to ${newStatus}.`, 'info');
  };

  const deleteMeal = (mealId) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
    showToast('Meal removed from inventory ledger.', 'warning');
  };

  const updateHotelVerification = (hotelId, status) => {
    setHotelVerifications(prev => prev.map(h => h.id === hotelId ? { ...h, status } : h));
    showToast(`Hotel verification updated to ${status}.`, 'info');
  };

  const updatePlatformSettings = (newSettings) => {
    setPlatformSettings(newSettings);
    showToast('Platform settings saved.', 'success');
  };

  // Admin Actions: Suspend User
  const toggleUserSuspension = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' || u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast(`User status updated.`, 'info');
  };

  const value = {
    currentRole,
    switchRole,
    currentView,
    currentRoute: currentView,
    navigate,
    selectedMealId,
    setSelectedMealId,
    selectedBookingId,
    setSelectedBookingId,
    selectedTicketId,
    setSelectedTicketId,
    selectedHotelAppId,
    setSelectedHotelAppId,
    selectedUserId,
    setSelectedUserId,
    meals,
    setMeals,
    updateMealStatus,
    deleteMeal,
    bookings,
    setBookings,
    users,
    setUsers,
    hotelVerifications,
    setHotelVerifications,
    updateHotelVerification,
    supportTickets,
    setSupportTickets,
    transactions,
    setTransactions,
    platformSettings,
    setPlatformSettings,
    updatePlatformSettings,
    dinerProfile,
    setDinerProfile,
    toastMessage,
    toast: toastMessage,
    showToast,
    bookMeal,
    cancelBooking,
    markBookingHandedOver,
    markBookingReady,
    addNewSurplusListing,
    approveHotel,
    rejectHotel,
    resolveTicket,
    toggleUserSuspension,
    toggleUserStatus: toggleUserSuspension
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
