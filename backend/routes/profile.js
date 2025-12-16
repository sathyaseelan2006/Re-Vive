import express from 'express';
import { supabase, getUserProfile, updateUserProfile, saveRecommendedSites, getRecommendedSites, getHeritageSites } from '../lib/supabase.js';

const router = express.Router();

// Middleware to verify authentication
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Get user profile
router.get('/profile/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure user can only access their own profile
        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const profile = await getUserProfile(userId);

        res.json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Check if first login
router.get('/first-login/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await getUserProfile(userId);

        res.json({
            success: true,
            isFirstLogin: profile?.is_first_login || false,
            fullName: profile?.full_name || 'User'
        });

    } catch (error) {
        console.error('First login check error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking first login status'
        });
    }
});

// Update user preferences
router.post('/preferences', authenticate, async (req, res) => {
    try {
        const { userId, preferences } = req.body;

        console.log('Preferences request:', { userId, preferences });

        if (!userId || !Array.isArray(preferences)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request data'
            });
        }

        // Ensure user can only update their own preferences
        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Handle clearing preferences
        if (preferences.length === 0) {
            console.log('Clearing preferences for user:', userId);

            // Get the user's token from the request
            const token = req.headers.authorization?.replace('Bearer ', '');

            // Create a Supabase client with the user's token for RLS
            const { createClient } = await import('@supabase/supabase-js');
            const userSupabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                }
            );

            // Update preferences using user's authenticated session
            const { data: updatedProfile, error: updateError } = await userSupabase
                .from('user_profiles')
                .update({
                    preferences: [],
                    emotional_profile: null,
                    last_preference_update: new Date().toISOString()
                })
                .eq('id', userId)
                .select();

            if (updateError) {
                console.error('Error updating profile:', updateError);
                throw updateError;
            }

            // Delete all recommendations for this user
            const { error: deleteError } = await userSupabase
                .from('recommended_sites')
                .delete()
                .eq('user_id', userId);

            if (deleteError) {
                console.error('Error deleting recommendations:', deleteError);
            }

            console.log('Preferences cleared successfully');

            return res.json({
                success: true,
                message: 'Preferences cleared successfully',
                data: {
                    profile: updatedProfile && updatedProfile.length > 0 ? updatedProfile[0] : null,
                    recommendations: []
                }
            });
        }

        // Determine emotional profile based on preferences
        const emotionalProfile = determineEmotionalProfile(preferences);

        // Generate recommendations based on preferences
        const allSites = await getHeritageSites({ state: 'Tamil Nadu' });
        const recommendations = generateRecommendations(preferences, emotionalProfile, allSites);

        // Get the user's token for authenticated operations
        const token = req.headers.authorization?.replace('Bearer ', '');

        // Create a Supabase client with the user's token for RLS
        const { createClient } = await import('@supabase/supabase-js');
        const userSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        // Update user profile using authenticated client
        const { data: updatedProfileData, error: profileError } = await userSupabase
            .from('user_profiles')
            .update({
                preferences,
                emotional_profile: emotionalProfile,
                is_first_login: false,
                last_preference_update: new Date().toISOString()
            })
            .eq('id', userId)
            .select();

        if (profileError) throw profileError;

        // Delete existing recommendations
        await userSupabase
            .from('recommended_sites')
            .delete()
            .eq('user_id', userId);

        // Insert new recommendations using authenticated client
        const { data: savedRecs, error: recsError } = await userSupabase
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

        if (recsError) throw recsError;

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: {
                profile: updatedProfileData && updatedProfileData.length > 0 ? updatedProfileData[0] : null,
                recommendations: recommendations
            }
        });

    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating preferences',
            error: error.message
        });
    }
});

// Get user recommendations
router.get('/recommendations/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure user can only access their own recommendations
        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Get recommendations from database
        const dbRecommendations = await getRecommendedSites(userId);

        // Get user profile for preferences
        const profile = await getUserProfile(userId);

        // Transform to match frontend format (camelCase)
        const recommendations = dbRecommendations.map(rec => ({
            siteName: rec.site_name,
            location: rec.location,
            district: rec.location, // Use location as district
            matchScore: rec.match_score,
            reason: rec.reason,
            urlPath: null // Will be handled by frontend
        }));

        res.json({
            success: true,
            recommendations: recommendations,
            preferences: profile?.preferences || []
        });

    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations'
        });
    }
});

// Helper function to determine emotional profile
function determineEmotionalProfile(preferences) {
    const profiles = {
        explorer: ['nature', 'architecture', 'cultural'],
        scholar: ['history', 'architecture'],
        romantic: ['romantic', 'nature', 'spiritual'],
        warrior: ['war', 'heroic', 'history'],
        seeker: ['spiritual', 'cultural']
    };

    let maxScore = 0;
    let selectedProfile = 'explorer';

    for (const [profile, tags] of Object.entries(profiles)) {
        const score = preferences.filter(pref => tags.includes(pref)).length;
        if (score > maxScore) {
            maxScore = score;
            selectedProfile = profile;
        }
    }

    return selectedProfile;
}

// Helper function to generate recommendations
function generateRecommendations(preferences, emotionalProfile, allSites) {
    const scoredSites = allSites.map(site => {
        let score = 0;

        // Match emotional tags
        if (site.emotional_tags) {
            const matchingTags = site.emotional_tags.filter(tag =>
                preferences.includes(tag)
            );
            score += matchingTags.length * 0.4;
        }

        // Bonus for matching emotional profile
        if (site.emotional_tags && site.emotional_tags.includes(emotionalProfile)) {
            score += 0.3;
        }

        return {
            ...site,
            matchScore: Math.round(Math.min(score, 1.0) * 100), // Convert to percentage
            reason: generateReason(preferences, site, emotionalProfile)
        };
    });

    // Sort by score and return top 6
    return scoredSites
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6)
        .map(site => ({
            siteName: site.site_name,
            location: site.location,
            matchScore: site.matchScore,
            reason: site.reason,
            highlights: site.highlights || []
        }));
}

// Helper function to generate personalized reason
function generateReason(preferences, site, emotionalProfile) {
    // Find matching tags between user preferences and site tags
    const matchingTags = site.emotional_tags?.filter(tag => preferences.includes(tag)) || [];

    // Create reason based on matching tags
    if (matchingTags.length > 0) {
        const tagDescriptions = {
            'spiritual': 'sacred temples and spiritual experiences',
            'history': 'rich historical heritage',
            'war': 'stories of battles and warriors',
            'heroic': 'tales of bravery and courage',
            'architecture': 'stunning architectural beauty',
            'cultural': 'vibrant cultural traditions',
            'nature': 'beautiful natural scenery',
            'romantic': 'peaceful and scenic atmosphere'
        };

        // Build description from matching tags
        const descriptions = matchingTags
            .map(tag => tagDescriptions[tag] || tag)
            .slice(0, 2); // Use top 2 matching tags

        if (descriptions.length === 1) {
            return `Perfect for those interested in ${descriptions[0]}.`;
        } else if (descriptions.length === 2) {
            return `Combines ${descriptions[0]} with ${descriptions[1]}.`;
        }
    }

    // Fallback to site highlights
    if (site.highlights && site.highlights.length > 0) {
        return `Discover ${site.highlights[0]}.`;
    }

    return `Explore the wonders of ${site.site_name}!`;
}

export default router;
