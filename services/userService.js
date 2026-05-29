const { supabase, hasSupabaseConfig } = require('../config/supabase');
const bcrypt = require('bcryptjs');

async function listUsers() {
    if (!hasSupabaseConfig) {
        return [
            { id: 'demo-admin', name: 'Admin', email: 'admin@admin.com', role: 'admin' }
        ];
    }

    const { data, error } = await supabase
        .from('users')
        .select('id,name,email,role,created_at')
        .order('created_at', { ascending: false });

    if (error) {
        const serviceError = new Error('Erro ao listar usuários.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function updateUser(id, payload) {
    const userPayload = { ...payload };
    delete userPayload.password;

    if (payload.password) {
        userPayload.password_hash = await bcrypt.hash(payload.password, 10);
    }

    if (!hasSupabaseConfig) {
        return { id, ...userPayload };
    }

    const { data, error } = await supabase
        .from('users')
        .update(userPayload)
        .eq('id', id)
        .select('id,name,email,role,created_at')
        .single();

    if (error) {
        const serviceError = new Error('Erro ao atualizar usuário.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function deleteUser(id) {
    if (!hasSupabaseConfig) {
        return { id };
    }

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
        const serviceError = new Error('Erro ao excluir usuário.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return { id };
}

module.exports = {
    listUsers,
    updateUser,
    deleteUser
};
