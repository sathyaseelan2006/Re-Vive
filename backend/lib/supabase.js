import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Helper function to get user from session
export const getUserFromSession = async (token) => {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
};

// Helper function to update user profile
export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select();

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
};

// Helper function to get heritage sites
export const getHeritageSites = async (filters = {}) => {
    let query = supabase
        .from('heritage_sites')
        .select('*')
        .eq('is_active', true);

    if (filters.state) {
        query = query.eq('state', filters.state);
    }

    if (filters.district) {
        query = query.eq('district', filters.district);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

// Helper function to get recommended sites for user
export const getRecommendedSites = async (userId) => {
    const { data, error } = await supabase
        .from('recommended_sites')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false });

    if (error) throw error;
    return data;
};

// Helper function to save recommended sites
export const saveRecommendedSites = async (userId, recommendations) => {
    // First, delete existing recommendations
    await supabase
        .from('recommended_sites')
        .delete()
        .eq('user_id', userId);

    // Insert new recommendations
    const { data, error } = await supabase
        .from('recommended_sites')
        .insert(
            recommendations.map(rec => ({
                user_id: userId,
                site_name: rec.siteName,
                location: rec.location,
                match_score: rec.matchScore,
                reason: rec.reason
            }))
        )
        .select();

    if (error) throw error;
    return data;
};

export default supabase;
