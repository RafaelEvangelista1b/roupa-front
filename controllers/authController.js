const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');
const { isValidEmail, requiredFields } = require('../utils/validators');

async function login(req, res, next) {
    try {
        const missing = requiredFields(req.body, ['email', 'password']);
        if (missing.length) {
            return sendError(res, `Campos obrigatórios: ${missing.join(', ')}.`, 400);
        }

        if (!isValidEmail(req.body.email)) {
            return sendError(res, 'Email inválido.', 400);
        }

        if (String(req.body.password).length < 6) {
            return sendError(res, 'A senha deve ter no mínimo 6 caracteres.', 400);
        }

        const data = await authService.login(req.body.email, req.body.password);
        return sendSuccess(res, 'Login realizado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function register(req, res, next) {
    try {
        const missing = requiredFields(req.body, ['name', 'email', 'password']);
        if (missing.length) {
            return sendError(res, `Campos obrigatórios: ${missing.join(', ')}.`, 400);
        }

        if (!isValidEmail(req.body.email)) {
            return sendError(res, 'Email inválido.', 400);
        }

        if (String(req.body.password).length < 6) {
            return sendError(res, 'A senha deve ter no mínimo 6 caracteres.', 400);
        }

        const data = await authService.register(req.body);
        return sendSuccess(res, 'Cadastro realizado com sucesso.', data, 201);
    } catch (error) {
        return next(error);
    }
}

async function me(req, res) {
    return sendSuccess(res, 'Usuário autenticado.', { user: req.user });
}

async function logout(req, res) {
    return sendSuccess(res, 'Logout realizado com sucesso.');
}

async function forgotPassword(req, res, next) {
    try {
        const missing = requiredFields(req.body, ['email']);
        if (missing.length) {
            return sendError(res, 'Email obrigatório.', 400);
        }

        if (!isValidEmail(req.body.email)) {
            return sendError(res, 'Email inválido.', 400);
        }

        const data = await authService.requestPasswordReset(req.body.email);
        return sendSuccess(res, 'Se o email existir, enviaremos instruções de recuperação.', data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    login,
    register,
    me,
    logout,
    forgotPassword
};
