const { sendSuccess } = require('../utils/response');

function health(req, res) {
    return sendSuccess(res, 'API online.', {
        status: 'ok',
        service: 'B7 Admin API',
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    health
};
