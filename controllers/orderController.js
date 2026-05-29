const orderService = require('../services/orderService');
const { sendSuccess, sendError } = require('../utils/response');
const { requiredFields } = require('../utils/validators');

async function list(req, res, next) {
    try {
        const data = await orderService.listOrders(req.user);
        return sendSuccess(res, 'Pedidos listados com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function create(req, res, next) {
    try {
        const missing = requiredFields(req.body, ['items', 'subtotal', 'total']);
        if (missing.length) {
            return sendError(res, `Campos obrigatórios: ${missing.join(', ')}.`, 400);
        }

        if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
            return sendError(res, 'Informe ao menos um item no pedido.', 400);
        }

        const data = await orderService.createOrder(req.body, req.user);
        return sendSuccess(res, 'Pedido criado com sucesso.', data, 201);
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    try {
        const data = await orderService.updateOrder(req.params.id, req.body);
        return sendSuccess(res, 'Pedido atualizado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        const data = await orderService.deleteOrder(req.params.id);
        return sendSuccess(res, 'Pedido excluído com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    list,
    create,
    update,
    remove
};
