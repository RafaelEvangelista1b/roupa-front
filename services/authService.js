const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { supabase, hasSupabaseConfig } = require('../config/supabase');

const demoUser = {
    id: 'demo-admin',
    name: 'Admin',
    email: 'admin@admin.com',
    role: 'admin',
    password: '123456'
};

function sanitizeUser(user) {
    if (!user) return null;
    const { password, password_hash, ...safeUser } = user;
    return safeUser;
}

function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role || 'user'
        },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );
}

async function login(email, password) {
    const normalizedEmail = String(email).trim().toLowerCase();

    if (hasSupabaseConfig) {
        const { data, error } = await supabase
            .from('users')
            .select('id,name,email,role,password_hash,created_at')
            .eq('email', normalizedEmail)
            .single();

        if (error || !data) {
            const authError = new Error('Credenciais inválidas.');
            authError.statusCode = 401;
            throw authError;
        }

        const passwordMatches = await bcrypt.compare(password, data.password_hash || '');
        if (!passwordMatches) {
            const authError = new Error('Credenciais inválidas.');
            authError.statusCode = 401;
            throw authError;
        }

        const user = sanitizeUser(data);
        return {
            user,
            token: createToken(user)
        };
    }

    if (normalizedEmail !== demoUser.email || password !== demoUser.password) {
        const authError = new Error('Credenciais inválidas.');
        authError.statusCode = 401;
        throw authError;
    }

    const user = sanitizeUser(demoUser);
    return {
        user,
        token: createToken(user)
    };
}

async function register(payload) {
    const normalizedEmail = String(payload.email).trim().toLowerCase();
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const userPayload = {
        name: payload.name,
        email: normalizedEmail,
        role: payload.role || 'user',
        password_hash: passwordHash
    };

    if (!hasSupabaseConfig) {
        const user = {
            id: `local-${Date.now()}`,
            name: userPayload.name,
            email: userPayload.email,
            role: userPayload.role
        };
        return {
            user,
            token: createToken(user)
        };
    }

    const { data, error } = await supabase
        .from('users')
        .insert(userPayload)
        .select('id,name,email,role,created_at')
        .single();

    if (error) {
        const registerError = new Error('Não foi possível cadastrar usuário.');
        registerError.statusCode = 400;
        registerError.details = error.message;
        throw registerError;
    }

    return {
        user: data,
        token: createToken(data)
    };
}

async function requestPasswordReset(email) {
    if (hasSupabaseConfig) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            const resetError = new Error('Não foi possível enviar recuperação de senha.');
            resetError.statusCode = 400;
            resetError.details = error.message;
            throw resetError;
        }
    }

    return { email };
}

module.exports = {
    login,
    register,
    requestPasswordReset
};
