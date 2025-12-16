import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName, confirmPassword } = req.body;

        // Validation
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Create user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: authError.message
            });
        }

        // Check if user was created
        if (!authData.user) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create user account'
            });
        }

        // Create user profile using the new user's session
        if (authData.session) {
            // Create a new supabase client with the user's session
            const { createClient } = await import('@supabase/supabase-js');
            const userSupabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${authData.session.access_token}`
                        }
                    }
                }
            );

            const { data: profileData, error: profileError } = await userSupabase
                .from('user_profiles')
                .insert([
                    {
                        id: authData.user.id,
                        full_name: fullName,
                        is_first_login: true,
                        is_active: true
                    }
                ])
                .select()
                .single();

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Continue anyway, profile might be created by trigger
            }
        }

        res.json({
            success: true,
            message: 'Account created successfully',
            token: authData.session?.access_token || '',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                fullName: fullName
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error('Login error from Supabase:', authError);
            return res.status(401).json({
                success: false,
                message: authError.message || 'Invalid email or password'
            });
        }

        if (!authData.user) {
            console.error('No user data returned from Supabase');
            return res.status(401).json({
                success: false,
                message: 'Login failed - no user data'
            });
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
        }

        // Update last login
        await supabase
            .from('user_profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', authData.user.id);

        res.json({
            success: true,
            message: 'Login successful',
            token: authData.session.access_token,
            user: {
                id: authData.user.id,
                email: authData.user.email,
                fullName: profile?.full_name || authData.user.user_metadata?.full_name || 'User',
                isFirstLogin: profile?.is_first_login || false
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Verify token route
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: profile?.full_name || user.user_metadata?.full_name || 'User'
            }
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
});

// Logout route (client-side handles most of this)
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            await supabase.auth.signOut();
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

export default router;
