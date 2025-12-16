import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import chatbotRoutes from './routes/chatbot.js';
import { supabase } from './lib/supabase.js';

dotenv.config();

const app = express();

// Security & Middleware
// Use helmet to set a sane set of security headers (CSP configured below)
app.use(helmet({
    contentSecurityPolicy: false // Disable for now, configure properly in production
}));

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://127.0.0.1:5502',
    'http://127.0.0.1:5503',
    'http://127.0.0.1:5504',
    'http://127.0.0.1:5505',
    'http://127.0.0.1:5506',
    'http://127.0.0.1:5507',
    'http://127.0.0.1:5508',
    process.env.FRONTEND_ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the status page)
app.use(express.static('public'));

// Test Supabase connection
async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('heritage_sites')
            .select('count')
            .limit(1);

        if (error) throw error;
        console.log('✅ Supabase Connected Successfully');
    } catch (err) {
        console.error('❌ Supabase Connection Error:', err.message);
        console.log('⚠️  Make sure your Supabase credentials are correct in .env');
    }
}

testSupabaseConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Re:Vive API is running',
        database: 'Supabase',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
}

// Export for Vercel serverless
export default app;
