import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables or client localStorage configuration
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? (localStorage.getItem('supabase_project_url') || '') : '';
const storedKey = typeof window !== 'undefined' ? (localStorage.getItem('supabase_anon_key') || '') : '';

export const supabaseUrl = envUrl && !envUrl.includes('your-project-id') ? envUrl : storedUrl;
export const supabaseAnonKey = envKey && !envKey.includes('your-anon-public-key') ? envKey : storedKey;

// Validate whether Supabase credentials are valid
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
);

// Save credentials from UI modal
export function setSupabaseCredentials(url, anonKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_project_url', url.trim());
    localStorage.setItem('supabase_anon_key', anonKey.trim());
    window.location.reload();
  }
}

// Clear credentials
export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_project_url');
    localStorage.removeItem('supabase_anon_key');
    window.location.reload();
  }
}

// Create the Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ==========================================
// 1. SUPABASE REALTIME SUBSCRIPTIONS
// ==========================================
export function subscribeToTable(tableName, onInsert, onUpdate, onDelete) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel(`realtime:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        if (payload.eventType === 'INSERT' && onInsert) onInsert(payload.new);
        if (payload.eventType === 'UPDATE' && onUpdate) onUpdate(payload.new);
        if (payload.eventType === 'DELETE' && onDelete) onDelete(payload.old);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 2. SUPABASE AUTH & EMAIL VERIFICATION
// ==========================================

export async function authGetSession() {
  if (!isSupabaseConfigured || !supabase) return { data: { session: null }, error: null };
  return await supabase.auth.getSession();
}

export async function authGetUser() {
  if (!isSupabaseConfigured || !supabase) return { data: { user: null }, error: null };
  return await supabase.auth.getUser();
}

export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured || !supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

export async function authSignIn(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { user: { email, user_metadata: { role: 'diner' } } }, error: null };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function authSignUp(email, password, metadata = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: {
        user: {
          email,
          user_metadata: metadata,
          identities: [{ identity_data: { email_verified: false } }]
        }
      },
      error: null
    };
  }

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
    }
  });
}

export async function authResendVerificationEmail(email) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: {}, error: null };
  }
  return await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
    }
  });
}

export async function authResetPassword(email) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: {}, error: null };
  }
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
  });
}

export async function authUpdatePassword(newPassword) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: {}, error: null };
  }
  return await supabase.auth.updateUser({ password: newPassword });
}

export async function authSignOut() {
  if (!isSupabaseConfigured || !supabase) return { error: null };
  return await supabase.auth.signOut();
}

// Helper: Sanitize meal object for Supabase public.meals table
function sanitizeMealPayload(meal) {
  return {
    id: String(meal.id),
    name: String(meal.name || 'Surplus Meal'),
    sub_title: String(meal.subTitle || meal.sub_title || ''),
    restaurant: String(meal.restaurant || 'Restaurant'),
    restaurant_address: String(meal.restaurantAddress || meal.restaurant_address || ''),
    rating: Number(meal.rating) || 4.8,
    review_count: Number(meal.reviewsCount || meal.review_count) || 0,
    category: String(meal.category || 'Meals & Thalis'),
    original_price: Number(meal.originalPrice ?? meal.original_price) || 120,
    rescue_price: Number(meal.rescuePrice ?? meal.rescue_price) || 59,
    discount: String(meal.discount || `${meal.discountPercent || 50}% OFF`),
    pickup_window: String(meal.pickupWindow || meal.pickup_window || 'Today 6:00 PM – 8:00 PM'),
    pickup_counter: String(meal.pickupCounter || meal.pickup_counter || 'Takeaway Counter #1'),
    portion_count: Number(meal.portionsLeft ?? meal.portion_count ?? meal.totalPortions ?? 1),
    image: String(meal.image || ''),
    fssai_verified: true,
    fssai_number: String(meal.fssaiLic || meal.fssai_number || 'FSSAI #1001901100234'),
    dietary_type: String(meal.dietary || meal.dietary_type || 'Veg'),
    co2_saved_kg: Number(meal.co2SavedKg || meal.co2_saved_kg) || 2.1,
    latitude: Number(meal.lat ?? meal.latitude ?? 22.7196),
    longitude: Number(meal.lng ?? meal.longitude ?? 75.8577),
    status: String(meal.status || 'Available'),
  };
}

// Helper: Normalize Supabase meal row into App's meal model
function normalizeMeal(m) {
  if (!m) return m;
  const portions = Number(m.portion_count ?? m.portions_count ?? m.portionsLeft ?? 1);
  return {
    ...m,
    id: m.id,
    name: m.name,
    subTitle: m.sub_title || m.subTitle,
    restaurant: m.restaurant,
    restaurantAddress: m.restaurant_address || m.restaurantAddress,
    rating: Number(m.rating) || 4.8,
    reviewsCount: m.review_count || m.reviewsCount || 0,
    category: m.category,
    originalPrice: Number(m.original_price ?? m.originalPrice) || 0,
    rescuePrice: Number(m.rescue_price ?? m.rescuePrice) || 0,
    discountPercent: m.discount ? parseInt(m.discount, 10) : (m.discountPercent || 50),
    pickupWindow: m.pickup_window || m.pickupWindow,
    pickupCounter: m.pickup_counter || m.pickupCounter,
    portionsLeft: portions,
    totalPortions: portions,
    image: m.image,
    dietary: m.dietary_type || m.dietary || 'Pure Veg',
    fssaiLic: m.fssai_number || m.fssaiLic || '1001901100234',
    co2SavedKg: Number(m.co2_saved_kg ?? m.co2SavedKg) || 1.8,
    lat: Number(m.latitude ?? m.lat) || 22.7196,
    lng: Number(m.longitude ?? m.lng) || 75.8577,
    status: m.status || 'Available',
    tags: m.tags || ['Eco-Packaging', 'Fresh Today'],
    distance: m.distance || '1.4 km',
    distanceNum: m.distanceNum || 1.4,
  };
}

// Helper: Sanitize booking object for Supabase public.bookings table (NO extra camelCase columns!)
function sanitizeBookingPayload(b) {
  const payload = {
    id: String(b.id),
    token_code: String(b.tokenCode || b.token_code || b.id),
    otp: String(b.otp || '101 - 202'),
    meal_title: String(b.mealTitle || b.meal_title || 'Surplus Meal'),
    restaurant_name: String(b.restaurantName || b.restaurant_name || 'Restaurant'),
    restaurant_address: String(b.restaurantAddress || b.restaurant_address || 'Address'),
    customer_name: String(b.customerName || b.customer_name || 'Customer'),
    customer_phone: String(b.customerPhone || b.customer_phone || '+91 98765 43210'),
    portions: Number(b.portions) || 1,
    original_amount: Number(b.originalAmount ?? b.original_amount) || 0,
    meal_subtotal: Number(b.mealSubtotal ?? b.meal_subtotal) || 0,
    total_paid: Number(b.totalPaid ?? b.total_paid) || 0,
    status: String(b.status || 'Ready for Pickup'),
  };

  if (b.mealId || b.meal_id) payload.meal_id = String(b.mealId || b.meal_id);
  if (b.subTitle || b.sub_title) payload.sub_title = String(b.subTitle || b.sub_title);
  if (b.pickupCounter || b.pickup_counter) payload.pickup_counter = String(b.pickupCounter || b.pickup_counter);
  if (b.customerEmail || b.customer_email) payload.customer_email = String(b.customerEmail || b.customer_email);
  if (b.customerRescueTier || b.customer_rescue_tier) payload.customer_rescue_tier = String(b.customerRescueTier || b.customer_rescue_tier);
  if (b.packagingFee !== undefined || b.packaging_fee !== undefined) payload.packaging_fee = Number(b.packagingFee ?? b.packaging_fee) || 0;
  if (b.foodWasteCredit !== undefined || b.food_waste_credit !== undefined) payload.food_waste_credit = Number(b.foodWasteCredit ?? b.food_waste_credit) || 0;
  if (b.paymentMethod || b.payment_method) payload.payment_method = String(b.paymentMethod || b.payment_method);
  if (b.pickupWindow || b.pickup_window) payload.pickup_window = String(b.pickupWindow || b.pickup_window);
  if (b.expiresInText || b.pickup_countdown) payload.pickup_countdown = String(b.expiresInText || b.pickup_countdown);
  if (b.distance) payload.distance = String(b.distance);
  payload.fssai_verified = true;

  return payload;
}

// Helper: Normalize Supabase booking row into App's booking model
function normalizeBooking(b) {
  if (!b) return b;
  return {
    ...b,
    id: b.id,
    tokenCode: b.token_code || b.tokenCode || b.id,
    otp: b.otp,
    mealId: b.meal_id || b.mealId,
    mealTitle: b.meal_title || b.mealTitle,
    subTitle: b.sub_title || b.subTitle,
    restaurantName: b.restaurant_name || b.restaurantName,
    restaurantAddress: b.restaurant_address || b.restaurantAddress,
    pickupCounter: b.pickup_counter || b.pickupCounter || 'Takeaway Counter #1',
    customerName: b.customer_name || b.customerName,
    customerPhone: b.customer_phone || b.customerPhone,
    customerEmail: b.customer_email || b.customerEmail,
    customerRescueTier: b.customer_rescue_tier || b.customerRescueTier || 'Level 3 Rescuer',
    portions: Number(b.portions) || 1,
    originalAmount: Number(b.original_amount ?? b.originalAmount) || 0,
    mealSubtotal: Number(b.meal_subtotal ?? b.mealSubtotal) || 0,
    packagingFee: Number(b.packaging_fee ?? b.packagingFee) || 0,
    foodWasteCredit: Number(b.food_waste_credit ?? b.foodWasteCredit) || 0,
    totalPaid: Number(b.total_paid ?? b.totalPaid) || 0,
    paymentMethod: b.payment_method || b.paymentMethod || 'Paid via UPI',
    status: b.status || 'Ready for Pickup',
    pickupWindow: b.pickup_window || b.pickupWindow,
    pickupDeadline: b.pickup_countdown || b.pickupDeadline || '8:00 PM cutoff',
    expiresInText: b.pickup_countdown || b.expiresInText || '1h 30m',
    distance: b.distance || '1.4 km away',
    bookingDate: b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '02 October 2026',
    placedTimestamp: b.created_at ? new Date(b.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '6:00 PM',
    lifecycleStep: b.status === 'Completed' ? 5 : b.status === 'Ready for Pickup' ? 3 : b.status === 'Cancelled' || b.status === 'Expired' ? 0 : 2,
    co2SavedKg: 1.8,
    ecopoints: (Number(b.portions) || 1) * 6,
    qrValue: `FOODIE-RESCUE-${b.id}-VERIFIED`,
  };
}

// ==========================================
// 3. MEALS DATABASE OPERATIONS
// ==========================================
export async function dbGetMeals(fallbackData = []) {
  if (!isSupabaseConfigured || !supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch meals:', error.message);
      return fallbackData;
    }
    return data && data.length > 0 ? data.map(normalizeMeal) : fallbackData;
  } catch (err) {
    console.warn('Supabase error:', err);
    return fallbackData;
  }
}

export async function dbInsertMeal(meal) {
  if (!isSupabaseConfigured || !supabase) return meal;
  try {
    const payload = sanitizeMealPayload(meal);
    const { data, error } = await supabase
      .from('meals')
      .insert([payload])
      .select()
      .maybeSingle();
    if (error) throw error;
    return normalizeMeal(data) || meal;
  } catch (err) {
    console.warn('dbInsertMeal error:', err.message || err);
    return meal;
  }
}

export async function dbUpdateMeal(id, updates) {
  if (!isSupabaseConfigured || !supabase) return updates;
  try {
    const sanitizedUpdates = {};
    for (const [key, val] of Object.entries(updates)) {
      if (key === 'portions_count' || key === 'portionsLeft' || key === 'portion_count') {
        sanitizedUpdates.portion_count = val;
      } else if (key === 'rescuePrice') {
        sanitizedUpdates.rescue_price = val;
      } else if (key === 'originalPrice') {
        sanitizedUpdates.original_price = val;
      } else if (key === 'status') {
        sanitizedUpdates.status = val;
      } else {
        sanitizedUpdates[key] = val;
      }
    }

    const { data, error } = await supabase
      .from('meals')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      // If error is about portion_count not found, retry with portions_count
      if (error.code === 'PGRST204' && sanitizedUpdates.portion_count !== undefined) {
        const alt = { ...sanitizedUpdates };
        delete alt.portion_count;
        alt.portions_count = sanitizedUpdates.portion_count;
        const retry = await supabase.from('meals').update(alt).eq('id', id).select().maybeSingle();
        if (!retry.error) return normalizeMeal(retry.data);
      }
      console.warn('dbUpdateMeal error:', error.message || error);
      return updates;
    }
    return normalizeMeal(data) || updates;
  } catch (err) {
    console.warn('dbUpdateMeal error:', err.message || err);
    return updates;
  }
}

export async function dbDeleteMeal(id) {
  if (!isSupabaseConfigured || !supabase) return true;
  try {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) console.warn('dbDeleteMeal error:', error.message);
    return !error;
  } catch (err) {
    console.warn('dbDeleteMeal error:', err);
    return false;
  }
}

// ==========================================
// 4. BOOKINGS DATABASE OPERATIONS
// ==========================================
export async function dbGetBookings(fallbackData = []) {
  if (!isSupabaseConfigured || !supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch bookings:', error.message);
      return fallbackData;
    }
    return data && data.length > 0 ? data.map(normalizeBooking) : fallbackData;
  } catch (err) {
    console.warn('Supabase error:', err);
    return fallbackData;
  }
}

export async function dbCreateBooking(booking) {
  if (!isSupabaseConfigured || !supabase) return booking;
  try {
    const payload = sanitizeBookingPayload(booking);
    const { data, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('dbCreateBooking error:', error.message || error);
      return booking;
    }
    return normalizeBooking(data) || booking;
  } catch (err) {
    console.warn('dbCreateBooking error:', err.message || err);
    return booking;
  }
}

export async function dbUpdateBookingStatus(bookingId, status) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('dbUpdateBookingStatus error:', err);
    return null;
  }
}

// ==========================================
// 5. HOTEL VERIFICATIONS & KITCHENS
// ==========================================
export async function dbGetHotelVerifications(fallbackData = []) {
  if (!isSupabaseConfigured || !supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('hotel_verifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return fallbackData;
    return data && data.length > 0 ? data : fallbackData;
  } catch {
    return fallbackData;
  }
}

export async function dbUpdateHotelVerification(id, updates) {
  if (!isSupabaseConfigured || !supabase) return updates;
  try {
    const { data, error } = await supabase
      .from('hotel_verifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('dbUpdateHotelVerification error:', err);
    return updates;
  }
}

// ==========================================
// 6. USERS & PROFILES
// ==========================================
export async function dbGetUsers(fallbackData = []) {
  if (!isSupabaseConfigured || !supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return fallbackData;
    return data && data.length > 0 ? data : fallbackData;
  } catch {
    return fallbackData;
  }
}

export async function dbUpdateUser(id, updates) {
  if (!isSupabaseConfigured || !supabase) return updates;
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('dbUpdateUser error:', err);
    return updates;
  }
}

// ==========================================
// 7. SUPPORT TICKETS
// ==========================================
export async function dbGetSupportTickets(fallbackData = []) {
  if (!isSupabaseConfigured || !supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return fallbackData;
    return data && data.length > 0 ? data : fallbackData;
  } catch {
    return fallbackData;
  }
}

export async function dbUpdateSupportTicket(id, updates) {
  if (!isSupabaseConfigured || !supabase) return updates;
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('dbUpdateSupportTicket error:', err);
    return updates;
  }
}
