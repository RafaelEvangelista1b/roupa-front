const express = require('express');
const uploadController = require('../controllers/uploadController');
const authenticate = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', authenticate, upload.single('file'), handleUploadError, uploadController.upload);

module.exports = router;
