const { supabase, hasSupabaseConfig } = require('../config/supabase');

const fallbackProducts = [
    {
        id: 'camiseta-css-azul',
        name: 'Camisa CSS - Azul',
        slug: 'camisa-css-azul',
        price: 59.9,
        old_price: 79.9,
        category: 'Camisetas',
        technology: 'CSS',
        image_url: 'assets/images/products/camiseta-css.png',
        description: 'Camiseta confortável feita em algodão, com estampa exclusiva para quem ama tecnologia e programação.',
        stock: 48,
        active: true
    }
];

async function listProducts(filters = {}) {
    if (!hasSupabaseConfig) {
        return fallbackProducts;
    }

    let query = supabase.from('products').select('*').eq('active', true);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.technology) query = query.eq('technology', filters.technology);
    if (filters.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        const serviceError = new Error('Erro ao listar produtos.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function getProduct(id) {
    if (!hasSupabaseConfig) {
        return fallbackProducts.find((product) => product.id === id || product.slug === id) || null;
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

    if (error) return null;
    return data;
}

async function createProduct(payload) {
    if (!hasSupabaseConfig) {
        return {
            id: `local-product-${Date.now()}`,
            ...payload,
            active: payload.active !== false
        };
    }

    const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select('*')
        .single();

    if (error) {
        const serviceError = new Error('Erro ao criar produto.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function updateProduct(id, payload) {
    if (!hasSupabaseConfig) {
        return {
            id,
            ...payload
        };
    }

    const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

    if (error) {
        const serviceError = new Error('Erro ao atualizar produto.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return data;
}

async function deleteProduct(id) {
    if (!hasSupabaseConfig) {
        return { id };
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        const serviceError = new Error('Erro ao excluir produto.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    return { id };
}

module.exports = {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
