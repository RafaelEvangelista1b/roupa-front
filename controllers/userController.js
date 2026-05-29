const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

async function list(req, res, next) {
    try {
        const data = await userService.listUsers();
        return sendSuccess(res, 'Usuários listados com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    try {
        const data = await userService.updateUser(req.params.id, req.body);
        return sendSuccess(res, 'Usuário atualizado com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        const data = await userService.deleteUser(req.params.id);
        return sendSuccess(res, 'Usuário excluído com sucesso.', data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    list,
    update,
    remove
};
