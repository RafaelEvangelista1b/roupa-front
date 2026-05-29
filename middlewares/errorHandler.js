const { sendError } = require('../utils/response');

function notFoundHandler(req, res) {
    return sendError(res, 'Rota não encontrada.', 404);
}

function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    return sendError(res, error.message || 'Erro interno do servidor.', statusCode, error.details || error.message);
}

module.exports = {
    notFoundHandler,
    errorHandler
};
