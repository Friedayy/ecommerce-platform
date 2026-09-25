const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;