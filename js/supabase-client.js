// Supabase Client Configuration for Frontend
// This replaces localhost API calls with direct Supabase integration

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables
// In production (Vercel), these will be set in the Vercel dashboard
// In development, these come from .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Helper function to get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
}

// Helper function to get user profile
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error getting profile:', error);
        return null;
    }
    return data;
}

// Helper function to update user preferences
export async function updateUserPreferences(userId, preferences) {
    const { data, error } = await supabase
        .from('user_profiles')
        .update({ preferences })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
    return data;
}

// Helper function to save recommended sites
export async function saveRecommendedSites(userId, sites) {
    const { data, error } = await supabase
        .from('user_profiles')
        .update({ recommended_sites: sites })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error saving recommended sites:', error);
        throw error;
    }
    return data;
}
