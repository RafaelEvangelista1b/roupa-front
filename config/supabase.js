const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);

const supabase = hasSupabaseConfig
    ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    })
    : null;

module.exports = {
    supabase,
    hasSupabaseConfig
};
