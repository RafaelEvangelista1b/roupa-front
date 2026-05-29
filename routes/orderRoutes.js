const express = require('express');
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, orderController.list);
router.post('/', authenticate, orderController.create);
router.put('/:id', authenticate, orderController.update);
router.delete('/:id', authenticate, orderController.remove);

module.exports = router;
