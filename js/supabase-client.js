// Supabase Client Configuration for Frontend using CDN
// This file provides Supabase client for browser use

const SUPABASE_URL = 'https://lmxshtqwtapzrvnjbdsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxteHNodHF3dGFwenJ2bmpiZHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODkwMTYsImV4cCI6MjA4MTQ2NTAxNn0.bo7SGaBK76yLjsaqnfUXmZPOuZujEQGc-JcRFT3admA';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase configuration');
}

// Create Supabase client using the global supabase object from CDN
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
