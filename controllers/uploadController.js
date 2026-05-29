const uploadService = require('../services/uploadService');
const { sendSuccess } = require('../utils/response');

async function upload(req, res, next) {
    try {
        const data = await uploadService.uploadFile(req.file, req.body.folder || 'uploads');
        return sendSuccess(res, 'Arquivo enviado com sucesso.', data, 201);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    upload
};
