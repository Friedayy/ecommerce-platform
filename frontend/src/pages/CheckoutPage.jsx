import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { isAuthenticated } from '../services/authService';
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  CheckCircle,
  CreditCard,
  MapPin,
  LogIn,
  Tag,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  // Get cart and coupon tools from context
  const {
    cart,
    getTotalPrice,
    clearCart,
    appliedCoupon,
    getDiscountAmount,
    getShippingCost,
    getGrandTotal
  } = useContext(CartContext);
  const navigate = useNavigate();

  // Form state for shipping address
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Loading and success states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Calculate totals including discounts
  const totalPrice = getTotalPrice();
  const discountAmount = getDiscountAmount(totalPrice);
  const taxableAmount = Math.max(0, totalPrice - discountAmount);
  const taxAmount = taxableAmount * 0.18;
  const shippingCost = getShippingCost(totalPrice);
  const grandTotal = getGrandTotal();

  // Check if user is authenticated before allowing checkout
  if (!isAuthenticated() && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login to Place Order</h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to complete your purchase. Login using the provided demo account.
          </p>
          <button
            onClick={() => navigate('/auth', {
              state: {
                message: 'Please login to complete your order',
                redirectTo: '/checkout'
              }
            })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm mb-3"
          >
            Login with Demo Account
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart is empty</h1>
          <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Handle input change for shipping form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.street || !formData.city || !formData.state || !formData.country || !formData.zipCode) {
      setError('Please fill in all shipping address fields');
      return false;
    }
    if (!/^\d{5,6}$/.test(formData.zipCode)) {
      setError('Please enter a valid zip code (5-6 digits)');
      return false;
    }
    return true;
  };

  // Handle checkout submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated()) {
      navigate('/auth', {
        state: {
          message: 'Please login to complete your order',
          redirectTo: '/checkout'
        }
      });
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        paymentMethod,
        totalAmount: grandTotal
      };

      // Create order via API
      const response = await createOrder(orderData);

      // Success - clear cart and show confirmation
      const placedOrderId = response.order?._id || response._id || 'CONFIRMED';
      setOrderId(placedOrderId);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Order success view
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order ID */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-lg font-bold text-blue-600 break-all">{orderId}</p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{cart.length} product(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-blue-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition"
            >
              Back to Home
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-6">
            You will receive an email confirmation shortly.
          </p>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </button>
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Shipping Address Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                {/* Street Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Country and Zip Code */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Credit Card */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition" style={{borderColor: paymentMethod === 'credit_card' ? '#2563eb' : ''}}>
                    <input
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-4">
                      <span className="block font-medium text-gray-900">Credit Card</span>
                      <span className="text-sm text-gray-600">Visa, Mastercard, American Express</span>
                    </span>
                  </label>

                  {/* Debit Card */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition" style={{borderColor: paymentMethod === 'debit_card' ? '#2563eb' : ''}}>
                    <input
                      type="radio"
                      value="debit_card"
                      checked={paymentMethod === 'debit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-4">
                      <span className="block font-medium text-gray-900">Debit Card</span>
                      <span className="text-sm text-gray-600">Any bank debit card</span>
                    </span>
                  </label>

                  {/* UPI */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition" style={{borderColor: paymentMethod === 'upi' ? '#2563eb' : ''}}>
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-4">
                      <span className="block font-medium text-gray-900">UPI</span>
                      <span className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</span>
                    </span>
                  </label>

                  {/* PayPal */}
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition" style={{borderColor: paymentMethod === 'paypal' ? '#2563eb' : ''}}>
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-4">
                      <span className="block font-medium text-gray-900">PayPal</span>
                      <span className="text-sm text-gray-600">Fast and secure PayPal checkout</span>
                    </span>
                  </label>
                </div>

                {/* Note */}
                <p className="mt-6 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💡 This is a demo checkout. In production, you would integrate with Stripe, Razorpay, or your payment provider.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Applied Coupon Banner */}
              {appliedCoupon && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-900 uppercase">
                      {appliedCoupon.code} Applied
                    </p>
                    <p className="text-[11px] text-emerald-700 truncate">
                      {appliedCoupon.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">x{item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Discount Line */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Discount ({appliedCoupon?.code})
                    </span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <div>
                    <span>Shipping</span>
                    {shippingCost === 0 && (
                      <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        {appliedCoupon?.type === 'shipping' ? 'COUPON FREE' : 'FREE'}
                      </span>
                    )}
                  </div>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-base font-semibold text-gray-900 block">Total</span>
                    {discountAmount > 0 && (
                      <span className="text-xs text-emerald-600 font-medium">
                        Saved ₹{discountAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-xs text-gray-500 mt-6 text-center">
                Your order will be confirmed after payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
