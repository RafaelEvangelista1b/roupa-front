const dashboardService = require('../services/dashboardService');
const { sendSuccess } = require('../utils/response');

async function stats(req, res, next) {
    try {
        const data = await dashboardService.getStats();
        return sendSuccess(res, 'Dashboard carregado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    stats
};
