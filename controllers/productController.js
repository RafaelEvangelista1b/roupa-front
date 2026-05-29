const productService = require('../services/productService');
const { sendSuccess, sendError } = require('../utils/response');
const { requiredFields } = require('../utils/validators');

async function list(req, res, next) {
    try {
        const data = await productService.listProducts(req.query);
        return sendSuccess(res, 'Produtos listados com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function show(req, res, next) {
    try {
        const data = await productService.getProduct(req.params.id);
        if (!data) {
            return sendError(res, 'Produto não encontrado.', 404);
        }
        return sendSuccess(res, 'Produto encontrado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function create(req, res, next) {
    try {
        const missing = requiredFields(req.body, ['name', 'price', 'category']);
        if (missing.length) {
            return sendError(res, `Campos obrigatórios: ${missing.join(', ')}.`, 400);
        }

        const data = await productService.createProduct(req.body);
        return sendSuccess(res, 'Produto criado com sucesso.', data, 201);
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    try {
        const data = await productService.updateProduct(req.params.id, req.body);
        return sendSuccess(res, 'Produto atualizado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        const data = await productService.deleteProduct(req.params.id);
        return sendSuccess(res, 'Produto excluído com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    list,
    show,
    create,
    update,
    remove
};
