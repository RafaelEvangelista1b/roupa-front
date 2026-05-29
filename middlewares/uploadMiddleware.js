const multer = require('multer');
const { sendError } = require('../utils/response');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter(req, file, callback) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(new Error('Tipo de arquivo não permitido.'));
        }
        return callback(null, true);
    }
});

function handleUploadError(error, req, res, next) {
    if (!error) {
        return next();
    }
    return sendError(res, error.message || 'Erro ao processar upload.', 400);
}

module.exports = {
    upload,
    handleUploadError
};
