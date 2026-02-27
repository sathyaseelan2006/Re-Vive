/**
 * Re:Vive Supabase Client
 * Handles authentication, preferences, and recommendations via Supabase.
 * 
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars (set in Vercel).
 * Falls back to import.meta.env values injected at build time by Vite.
 */

// Supabase configuration — Vite replaces import.meta.env.VITE_* at build time
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
    ? import.meta.env.VITE_SUPABASE_URL
    : '';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : '';

/**
 * Lightweight Supabase REST client (no SDK dependency).
 * Uses the PostgREST API and GoTrue auth endpoints directly.
 */
class SupabaseClient {
    constructor(url, anonKey) {
        this.url = url.replace(/\/$/, ''); // trim trailing slash
        this.anonKey = anonKey;
        this.restUrl = `${this.url}/rest/v1`;
        this.authUrl = `${this.url}/auth/v1`;
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;

        // Restore session from localStorage
        this._restoreSession();
    }

    // ─── Internal helpers ──────────────────────────────────────────

    _headers(auth = true) {
        const h = {
            'apikey': this.anonKey,
            'Content-Type': 'application/json',
        };
        if (auth && this.accessToken) {
            h['Authorization'] = `Bearer ${this.accessToken}`;
        } else {
            h['Authorization'] = `Bearer ${this.anonKey}`;
        }
        return h;
    }

    _saveSession(data) {
        if (data.access_token) {
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token || this.refreshToken;
            this.user = data.user || this.user;
            localStorage.setItem('sb-access-token', this.accessToken);
            localStorage.setItem('sb-refresh-token', this.refreshToken || '');
            localStorage.setItem('sb-user', JSON.stringify(this.user));
            // Also store in the format the app expects
            localStorage.setItem('user', JSON.stringify({
                id: this.user.id,
                email: this.user.email,
                fullName: this.user.user_metadata?.full_name || this.user.email
            }));
        }
    }

    _restoreSession() {
        try {
            this.accessToken = localStorage.getItem('sb-access-token');
            this.refreshToken = localStorage.getItem('sb-refresh-token');
            const userStr = localStorage.getItem('sb-user');
            if (userStr) this.user = JSON.parse(userStr);
        } catch (e) {
            console.warn('Failed to restore session:', e);
        }
    }

    _clearSession() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-user');
        localStorage.removeItem('user');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('emotionalProfile');
        localStorage.removeItem('recommendedSites');
        localStorage.removeItem('token');
    }

    // ─── Auth ──────────────────────────────────────────────────────

    async signUp(email, password, fullName) {
        const res = await fetch(`${this.authUrl}/signup`, {
            method: 'POST',
            headers: this._headers(false),
            body: JSON.stringify({
                email,
                password,
                data: { full_name: fullName }
            })
        });
        const data = await res.json();
        if (data.error || res.status >= 400) {
            throw new Error(data.error_description || data.msg || data.error?.message || 'Sign up failed');
        }
        // After signup, create user_profiles row
        if (data.access_token) {
            this._saveSession(data);
            await this._createProfile(data.user.id, fullName);
        }
        return data;
    }

    async signIn(email, password) {
        const res = await fetch(`${this.authUrl}/token?grant_type=password`, {
            method: 'POST',
            headers: this._headers(false),
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.error || res.status >= 400) {
            throw new Error(data.error_description || data.msg || data.error?.message || 'Login failed');
        }
        this._saveSession(data);

        // Update last_login
        await this._updateLastLogin();

        return data;
    }

    async signOut() {
        try {
            await fetch(`${this.authUrl}/logout`, {
                method: 'POST',
                headers: this._headers(true)
            });
        } catch (e) { /* ignore */ }
        this._clearSession();
    }

    getUser() {
        return this.user;
    }

    isLoggedIn() {
        return !!this.accessToken && !!this.user;
    }

    // ─── Profile ───────────────────────────────────────────────────

    async _createProfile(userId, fullName) {
        try {
            await fetch(`${this.restUrl}/user_profiles`, {
                method: 'POST',
                headers: {
                    ...this._headers(true),
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    id: userId,
                    full_name: fullName,
                    is_first_login: true,
                    preferences: [],
                    created_at: new Date().toISOString()
                })
            });
        } catch (e) {
            console.warn('Profile creation may have failed (could already exist):', e);
        }
    }

    async _updateLastLogin() {
        if (!this.user) return;
        try {
            await fetch(`${this.restUrl}/user_profiles?id=eq.${this.user.id}`, {
                method: 'PATCH',
                headers: {
                    ...this._headers(true),
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    last_login: new Date().toISOString()
                })
            });
        } catch (e) {
            console.warn('Failed to update last_login:', e);
        }
    }

    async getProfile() {
        if (!this.user) return null;
        const res = await fetch(`${this.restUrl}/user_profiles?id=eq.${this.user.id}&select=*`, {
            headers: this._headers(true)
        });
        const data = await res.json();
        return data[0] || null;
    }

    async isFirstLogin() {
        const profile = await this.getProfile();
        return profile ? profile.is_first_login : true;
    }

    // ─── Preferences ──────────────────────────────────────────────

    async savePreferences(preferences) {
        if (!this.user) throw new Error('Not logged in');

        const emotionalProfile = this._determineEmotionalProfile(preferences);

        // Update user_profiles
        const res = await fetch(`${this.restUrl}/user_profiles?id=eq.${this.user.id}`, {
            method: 'PATCH',
            headers: {
                ...this._headers(true),
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                preferences: preferences,
                emotional_profile: emotionalProfile,
                is_first_login: false,
                last_preference_update: new Date().toISOString()
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Failed to save preferences');
        }

        // Generate and store recommendations
        const recommendations = await this._generateAndStoreRecommendations(preferences);

        // Update localStorage
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        localStorage.setItem('emotionalProfile', emotionalProfile);
        localStorage.setItem('recommendedSites', JSON.stringify(recommendations));

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.isFirstLogin = false;
        localStorage.setItem('user', JSON.stringify(user));

        return {
            preferences,
            emotionalProfile,
            recommendedSites: recommendations
        };
    }

    // ─── Recommendations ──────────────────────────────────────────

    async getRecommendations() {
        if (!this.user) return { recommendations: [], preferences: [] };

        // Get user profile with preferences
        const profile = await this.getProfile();
        if (!profile || !profile.preferences || profile.preferences.length === 0) {
            return { recommendations: [], preferences: [] };
        }

        // Try to get stored recommendations from Supabase
        const res = await fetch(
            `${this.restUrl}/recommended_sites?user_id=eq.${this.user.id}&select=*&order=match_score.desc&limit=6`,
            { headers: this._headers(true) }
        );
        let storedRecs = [];
        if (res.ok) {
            storedRecs = await res.json();
        }

        if (storedRecs.length > 0) {
            // Map to the format the frontend expects
            const recommendations = storedRecs.map(r => ({
                siteName: r.site_name,
                location: r.location,
                district: r.location,
                matchScore: Math.round((r.match_score || 0) * 100),
                reason: r.reason || '',
                urlPath: r.url_path || '',
                period: r.period || ''
            }));
            return { recommendations, preferences: profile.preferences };
        }

        // No stored recommendations — generate them from heritage_sites table
        const recs = await this._generateAndStoreRecommendations(profile.preferences);
        return { recommendations: recs, preferences: profile.preferences };
    }

    async _generateAndStoreRecommendations(preferences) {
        // Fetch all active heritage sites
        let sites = [];
        try {
            const res = await fetch(
                `${this.restUrl}/heritage_sites?is_active=eq.true&select=*`,
                { headers: this._headers(true) }
            );
            if (res.ok) {
                sites = await res.json();
            }
        } catch (e) {
            console.warn('Failed to fetch heritage_sites from Supabase:', e);
        }

        // Fallback to embedded data if Supabase has no sites
        if (sites.length === 0) {
            sites = FALLBACK_HERITAGE_SITES;
        }

        const recommendations = [];

        for (const site of sites) {
            let matchScore = 0;
            const matchedTags = [];

            for (const pref of preferences) {
                if (site.emotional_tags && site.emotional_tags.includes(pref)) {
                    matchScore += 20;
                    matchedTags.push(pref);
                }
                // Also check camelCase version (from fallback data)
                if (site.emotionalTags && site.emotionalTags.includes(pref)) {
                    matchScore += 20;
                    matchedTags.push(pref);
                }
            }

            if (matchScore > 0) {
                const siteName = site.site_name || site.siteName;
                const reason = this._generateReason(matchedTags, siteName);
                recommendations.push({
                    siteName: siteName,
                    location: site.location,
                    district: site.district || site.location,
                    matchScore: Math.min(matchScore, 100),
                    reason: reason,
                    period: site.period || '',
                    urlPath: site.url_path || site.urlPath || ''
                });
            }
        }

        // Sort by score descending
        recommendations.sort((a, b) => b.matchScore - a.matchScore);
        const topRecs = recommendations.slice(0, 6);

        // Store in Supabase recommended_sites table
        await this._storeRecommendations(topRecs);

        return topRecs;
    }

    async _storeRecommendations(recommendations) {
        if (!this.user || recommendations.length === 0) return;

        try {
            // Delete old recommendations first
            await fetch(`${this.restUrl}/recommended_sites?user_id=eq.${this.user.id}`, {
                method: 'DELETE',
                headers: this._headers(true)
            });

            // Insert new ones
            const rows = recommendations.map(r => ({
                user_id: this.user.id,
                site_name: r.siteName,
                location: r.location,
                match_score: r.matchScore / 100, // Store as 0-1 decimal
                reason: r.reason
            }));

            await fetch(`${this.restUrl}/recommended_sites`, {
                method: 'POST',
                headers: {
                    ...this._headers(true),
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(rows)
            });
        } catch (e) {
            console.warn('Failed to store recommendations in Supabase:', e);
        }
    }

    // ─── Helpers ───────────────────────────────────────────────────

    _generateReason(matchedTags, siteName) {
        const reasons = {
            romantic: `Perfect for romantic souls — ${siteName} offers breathtaking beauty and serene atmosphere.`,
            spiritual: `A deeply spiritual experience awaits at ${siteName}, connecting you to divine energy.`,
            war: `Witness the military prowess and battle strategies at ${siteName}, where history was forged in battle.`,
            heroic: `Celebrate the valor and heroism at ${siteName}, a monument to courage and sacrifice.`,
            history: `Explore the rich historical legacy of ${siteName}, spanning centuries of Tamil civilization.`,
            architecture: `Marvel at the architectural brilliance of ${siteName}, a masterpiece of design and engineering.`,
            nature: `Immerse yourself in the natural beauty surrounding ${siteName}, where heritage meets nature.`,
            cultural: `Experience the vibrant cultural heritage of ${siteName}, a living tradition of Tamil Nadu.`
        };
        const primaryTag = matchedTags[0];
        return reasons[primaryTag] || `Discover the wonders of ${siteName}, perfectly matching your interests.`;
    }

    _determineEmotionalProfile(preferences) {
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
                if (preferences.includes(tag)) score++;
            }
            if (score > maxScore) {
                maxScore = score;
                dominantProfile = profile;
            }
        }
        return dominantProfile;
    }
}

// ─── Fallback heritage sites data (used if Supabase table is empty) ────

const FALLBACK_HERITAGE_SITES = [
    { siteName: "Brihadeeswarar Temple", location: "Thanjavur", district: "Thanjavur", period: "1003-1010 CE", emotionalTags: ["spiritual", "architecture", "history", "cultural"], urlPath: "/tamil-nadu/thanjavur/index.html" },
    { siteName: "Shore Temple", location: "Mahabalipuram", district: "Kanchipuram", period: "700-728 CE", emotionalTags: ["romantic", "architecture", "history", "nature"], urlPath: "/tamil-nadu/mahabalipuram/index.html" },
    { siteName: "Meenakshi Temple", location: "Madurai", district: "Madurai", period: "12th-17th Century", emotionalTags: ["spiritual", "architecture", "cultural", "romantic"], urlPath: "/tamil-nadu/madurai/index.html" },
    { siteName: "Rameswaram Temple", location: "Rameswaram", district: "Ramanathapuram", period: "12th Century", emotionalTags: ["spiritual", "heroic", "history", "cultural"], urlPath: "/tamil-nadu/rameswaram/index.html" },
    { siteName: "Kanchipuram Temples", location: "Kanchipuram", district: "Kanchipuram", period: "7th-9th Century", emotionalTags: ["spiritual", "architecture", "history", "cultural"], urlPath: "/tamil-nadu/kanchipuram/index.html" },
    { siteName: "Chidambaram Temple", location: "Chidambaram", district: "Cuddalore", period: "10th Century", emotionalTags: ["spiritual", "cultural", "architecture", "history"], urlPath: "/tamil-nadu/chidambaram/index.html" },
    { siteName: "Gingee Fort", location: "Gingee", district: "Villupuram", period: "9th-16th Century", emotionalTags: ["war", "heroic", "history", "architecture"], urlPath: "/tamil-nadu/gingee-fort/index.html" },
    { siteName: "Fort St. George", location: "Chennai", district: "Chennai", period: "1644 CE", emotionalTags: ["history", "war", "cultural"], urlPath: "/tamil-nadu/fort-st-george/index.html" },
    { siteName: "Keeladi Archaeological Site", location: "Keeladi", district: "Sivaganga", period: "6th Century BCE", emotionalTags: ["history", "cultural"], urlPath: "/tamil-nadu/keeladi/index.html" },
    { siteName: "Palani Murugan Temple", location: "Palani", district: "Dindigul", period: "Medieval", emotionalTags: ["spiritual", "nature"], urlPath: "/tamil-nadu/palani/index.html" },
    { siteName: "Rockfort Temple", location: "Tiruchirappalli", district: "Tiruchirappalli", period: "Pallava Dynasty", emotionalTags: ["spiritual", "history", "nature"], urlPath: "/tamil-nadu/rockfort-tiruchirappalli/index.html" },
    { siteName: "Nilgiris - Ooty", location: "Nilgiris", district: "Nilgiris", period: "Colonial period", emotionalTags: ["nature", "romantic", "cultural", "history"], urlPath: "/tamil-nadu/nilgiris-ooty/index.html" },
    { siteName: "Kanyakumari", location: "Kanyakumari", district: "Kanyakumari", period: "Modern era", emotionalTags: ["spiritual", "nature", "romantic", "cultural"], urlPath: "/tamil-nadu/kanyakumari/index.html" },
    { siteName: "Chettinad Heritage", location: "Karaikudi", district: "Sivagangai", period: "19th-20th Century", emotionalTags: ["cultural", "architecture", "history"], urlPath: "/tamil-nadu/chettinad/index.html" },
    { siteName: "Airavatesvara Temple", location: "Darasuram", district: "Thanjavur", period: "12th Century", emotionalTags: ["spiritual", "history", "architecture"], urlPath: "/tamil-nadu/darasuram/index.html" },
    { siteName: "Gangaikonda Cholapuram", location: "Ariyalur", district: "Ariyalur", period: "11th Century", emotionalTags: ["spiritual", "history", "architecture", "heroic"], urlPath: "/tamil-nadu/gangaikonda-cholapuram/index.html" },
    { siteName: "Sri Ranganathaswamy Temple", location: "Srirangam", district: "Tiruchirappalli", period: "Medieval", emotionalTags: ["spiritual", "cultural", "architecture"], urlPath: "/tamil-nadu/srirangam/index.html" },
    { siteName: "Annamalaiyar Temple", location: "Tiruvannamalai", district: "Tiruvannamalai", period: "Ancient", emotionalTags: ["spiritual", "nature", "cultural"], urlPath: "/tamil-nadu/tiruvannamalai/index.html" },
    { siteName: "Thiruchendur Murugan Temple", location: "Thiruchendur", district: "Thoothukudi", period: "Medieval", emotionalTags: ["spiritual", "nature", "romantic"], urlPath: "/tamil-nadu/thiruchendur/index.html" },
    { siteName: "Andal Temple", location: "Srivilliputhur", district: "Virudhunagar", period: "Medieval", emotionalTags: ["spiritual", "cultural", "architecture"], urlPath: "/tamil-nadu/srivilliputhur/index.html" },
    { siteName: "Vellore Fort", location: "Vellore", district: "Vellore", period: "16th Century", emotionalTags: ["war", "history", "architecture"], urlPath: "/tamil-nadu/vellore-fort/index.html" }
];

// ─── Singleton instance ────────────────────────────────────────────

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in HTML script tags (attached to window) and ES modules
if (typeof window !== 'undefined') {
    window.supabase = supabase;
    window.SupabaseClient = SupabaseClient;
}

export { supabase, SupabaseClient, FALLBACK_HERITAGE_SITES };
export default supabase;
