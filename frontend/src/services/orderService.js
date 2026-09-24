import api from './api';

/**
 * Create a new order
 * @param {Object} orderData - Order details (items, shippingAddress, paymentMethod, totalAmount)
 * @returns {Promise} Order response with order ID
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Get all orders for the logged-in user
 * @returns {Promise} Array of user's orders
 */
export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} Order details
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Get all orders (Admin only)
 * @returns {Promise} Array of all orders
 */
export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} orderStatus - New order status
 * @returns {Promise} Updated order
 */
export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await api.put(`/orders/${orderId}`, { orderStatus });
  return response.data;
};
