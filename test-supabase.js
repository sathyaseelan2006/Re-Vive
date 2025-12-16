import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Supabase configuration...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set ✓' : 'Missing ✗');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗');

try {
    const { createClient } = await import('@supabase/supabase-js');
    console.log('Supabase package imported successfully ✓');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing credentials');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created ✓');

    // Test connection
    const { data, error } = await supabase
        .from('heritage_sites')
        .select('count')
        .limit(1);

    if (error) {
        console.error('❌ Connection test failed:', error.message);
    } else {
        console.log('✅ Supabase connection successful!');
    }
} catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
}
