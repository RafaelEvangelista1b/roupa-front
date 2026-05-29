require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    frontendUrl: process.env.FRONTEND_URL || '*',
    jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY
};
