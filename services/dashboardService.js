const { supabase, hasSupabaseConfig } = require('../config/supabase');

async function getStats() {
    if (!hasSupabaseConfig) {
        return {
            sales: 1284,
            users: 9842,
            orders: 742,
            satisfaction: 96,
            revenue: 84000,
            growth: 18,
            weeklyPerformance: [42, 66, 51, 78, 88, 58, 70],
            recentActivity: [
                { type: 'order', message: 'Novo pedido aprovado', time: 'há 2 min' },
                { type: 'goal', message: 'Meta diária alcançada', time: 'há 18 min' },
                { type: 'user', message: 'Usuário premium criado', time: 'há 42 min' },
                { type: 'report', message: 'Relatório exportado', time: 'há 1 hora' }
            ]
        };
    }

    const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id,total', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact', head: true })
    ]);

    if (productsResult.error || ordersResult.error || usersResult.error) {
        const serviceError = new Error('Erro ao carregar dashboard.');
        serviceError.statusCode = 400;
        serviceError.details = productsResult.error?.message || ordersResult.error?.message || usersResult.error?.message;
        throw serviceError;
    }

    const revenue = (ordersResult.data || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
        sales: productsResult.count || 0,
        users: usersResult.count || 0,
        orders: ordersResult.count || 0,
        satisfaction: 96,
        revenue,
        growth: 18,
        weeklyPerformance: [42, 66, 51, 78, 88, 58, 70],
        recentActivity: [
            { type: 'order', message: 'Pedidos sincronizados com Supabase', time: 'agora' }
        ]
    };
}

module.exports = {
    getStats
};
