const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, userController.list);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.remove);

module.exports = router;
