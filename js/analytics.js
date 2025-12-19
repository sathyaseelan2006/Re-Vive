/**
 * Vercel Analytics Integration
 * Tracks page views and user interactions across the Re:Vive Heritage Platform
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject({
    mode: 'production', // Use 'auto' to enable in development as well
    debug: false // Set to true for debugging
});

console.log('✅ Vercel Analytics initialized');
