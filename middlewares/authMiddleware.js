const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { sendError } = require('../utils/response');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return sendError(res, 'Token de autenticação não informado.', 401);
    }

    try {
        req.user = jwt.verify(token, env.jwtSecret);
        return next();
    } catch (error) {
        return sendError(res, 'Token inválido ou expirado.', 401);
    }
}

module.exports = authenticate;
