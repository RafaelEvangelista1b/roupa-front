const { supabase, hasSupabaseConfig } = require('../config/supabase');

async function createOrder(payload, user) {
    const orderPayload = {
        user_id: user.id,
        items: payload.items,
        customer: payload.customer || null,
        shipping_address: payload.shipping_address || null,
        subtotal: payload.subtotal,
        shipping: payload.shipping || 0,
        total: payload.total,
        status: 'pending'
    };

    if (!hasSupabaseConfig) {
        return {
            id: `local-order-${Date.now()}`,
            ...orderPayload,
            created_at: new Date().toISOString()
        };
    }

    const { data, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('*')
        .single();

    if (error) {
        const serviceError = new Error('Erro ao criar pedido.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function listOrders(user) {
    if (!hasSupabaseConfig) {
        return [];
    }

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (user.role !== 'admin') {
        query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
        const serviceError = new Error('Erro ao listar pedidos.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function updateOrder(id, payload) {
    if (!hasSupabaseConfig) {
        return { id, ...payload };
    }

    const { data, error } = await supabase
        .from('orders')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    if (error) {
        const serviceError = new Error('Erro ao atualizar pedido.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function deleteOrder(id) {
    if (!hasSupabaseConfig) {
        return { id };
    }

    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
        const serviceError = new Error('Erro ao excluir pedido.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return { id };
}

module.exports = {
    createOrder,
    listOrders,
    updateOrder,
    deleteOrder
};
