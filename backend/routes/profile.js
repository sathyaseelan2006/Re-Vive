import express from 'express';
import User from '../models/User.js';
import HeritageSite from '../models/HeritageSite.js';
import { tamilNaduSites } from '../data/tamilNaduSites.js';

const router = express.Router();

// Update user preferences (first login or preference change)
router.post('/preferences', async (req, res) => {
    try {
        const { userId, preferences } = req.body;

        if (!userId || !preferences || !Array.isArray(preferences)) {
            return res.status(400).json({
                success: false,
                message: 'User ID and preferences array are required'
            });
        }

        // Validate preferences
        const validPreferences = ['romantic', 'spiritual', 'war', 'heroic', 'history', 'architecture', 'nature', 'cultural'];
        const invalidPrefs = preferences.filter(p => !validPreferences.includes(p));
        
        if (invalidPrefs.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid preferences: ${invalidPrefs.join(', ')}`
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate recommendations based on preferences
        const recommendations = await generateRecommendations(preferences);
        const emotionalProfile = determineEmotionalProfile(preferences);

        // Update user
        user.preferences = preferences;
        user.emotionalProfile = emotionalProfile;
        user.recommendedSites = recommendations;
        user.lastPreferenceUpdate = new Date();
        user.isFirstLogin = false;
        
        await user.save();

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: {
                preferences: user.preferences,
                emotionalProfile: user.emotionalProfile,
                recommendedSites: user.recommendedSites
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

// Get user profile with recommendations
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                fullName: user.fullName,
                email: user.email,
                isFirstLogin: user.isFirstLogin,
                preferences: user.preferences,
                emotionalProfile: user.emotionalProfile,
                recommendedSites: user.recommendedSites,
                lastPreferenceUpdate: user.lastPreferenceUpdate
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// Check if first login
router.get('/first-login/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            isFirstLogin: user.isFirstLogin,
            fullName: user.fullName
        });

    } catch (error) {
        console.error('Check first login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking first login status',
            error: error.message
        });
    }
});

// Get recommendations for user
router.get('/recommendations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If no preferences set yet, return empty
        if (!user.preferences || user.preferences.length === 0) {
            return res.json({
                success: true,
                recommendations: [],
                message: 'Please set your preferences first'
            });
        }

        // If no recommendations stored or need refresh, generate new ones
        if (!user.recommendedSites || user.recommendedSites.length === 0) {
            const recommendations = await generateRecommendations(user.preferences);
            user.recommendedSites = recommendations;
            await user.save();
        }

        res.json({
            success: true,
            recommendations: user.recommendedSites,
            preferences: user.preferences || []
        });

    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
});

// AI-based recommendation generation
async function generateRecommendations(preferences) {
    try {
        // Try to get sites from database first
        let sites = await HeritageSite.find({ isActive: true });

        // If no sites in database, use static Tamil Nadu data
        if (sites.length === 0) {
            sites = tamilNaduSites;
        }

        const recommendations = [];

        // Score each site based on user preferences
        for (const site of sites) {
            let matchScore = 0;
            const matchedTags = [];

            // Calculate match score
            for (const pref of preferences) {
                if (site.emotionalTags && site.emotionalTags.includes(pref)) {
                    matchScore += 20; // Each matching tag adds 20 points
                    matchedTags.push(pref);
                }
            }

            // Only include sites with match score > 0
            if (matchScore > 0) {
                const reason = generateReason(matchedTags, site);

                recommendations.push({
                    siteName: site.siteName,
                    location: site.location,
                    district: site.district,
                    matchScore: Math.min(matchScore, 100), // Cap at 100%
                    reason: reason,
                    highlights: site.highlights || [],
                    period: site.period,
                    urlPath: site.urlPath
                });
            }
        }

        // Sort by match score (highest first)
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        // Return top 6 recommendations
        return recommendations.slice(0, 6);

    } catch (error) {
        console.error('Error generating recommendations:', error);
        return [];
    }
}

// Generate personalized reason based on emotional tags
function generateReason(matchedTags, site) {
    const reasons = {
        romantic: `Perfect for romantic souls - ${site.siteName} offers breathtaking beauty and serene atmosphere.`,
        spiritual: `A deeply spiritual experience awaits at ${site.siteName}, connecting you to divine energy.`,
        war: `Witness the military prowess and battle strategies at ${site.siteName}, where history was forged in battle.`,
        heroic: `Celebrate the valor and heroism at ${site.siteName}, a monument to courage and sacrifice.`,
        history: `Explore the rich historical legacy of ${site.siteName}, spanning centuries of Tamil civilization.`,
        architecture: `Marvel at the architectural brilliance of ${site.siteName}, a masterpiece of design and engineering.`,
        nature: `Immerse yourself in the natural beauty surrounding ${site.siteName}, where heritage meets nature.`,
        cultural: `Experience the vibrant cultural heritage of ${site.siteName}, a living tradition of Tamil Nadu.`
    };

    const primaryTag = matchedTags[0];
    return reasons[primaryTag] || `Discover the wonders of ${site.siteName}, perfectly matching your interests.`;
}

// Determine emotional profile based on preferences
function determineEmotionalProfile(preferences) {
    const profiles = {
        explorer: ['nature', 'cultural', 'history'],
        scholar: ['history', 'architecture', 'cultural'],
        romantic: ['romantic', 'spiritual', 'nature'],
        warrior: ['war', 'heroic', 'history'],
        seeker: ['spiritual', 'cultural', 'romantic']
    };

    let maxScore = 0;
    let dominantProfile = 'explorer';

    for (const [profile, tags] of Object.entries(profiles)) {
        let score = 0;
        for (const tag of tags) {
            if (preferences.includes(tag)) {
                score++;
            }
        }
        if (score > maxScore) {
            maxScore = score;
            dominantProfile = profile;
        }
    }

    return dominantProfile;
}

export default router;
