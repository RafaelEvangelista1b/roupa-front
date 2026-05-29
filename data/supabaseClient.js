require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://yczhzzpvzvijqcchxhza.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    })
    : null;

function ensureSupabase() {
    if (!supabase) {
        const error = new Error('Supabase não configurado. Defina SUPABASE_ANON_KEY nas variáveis de ambiente.');
        error.statusCode = 503;
        throw error;
    }

    return supabase;
}

module.exports = {
    supabase,
    ensureSupabase
};
