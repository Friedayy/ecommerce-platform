import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { isAuthenticated } from '../services/authService';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export default function CartPage() {
  // Get cart and coupon tools from context
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getShippingCost,
    getGrandTotal
  } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (codeToApply = null) => {
    const code = codeToApply || couponInput;
    const result = applyCoupon(code);
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: result.message
      });
      setCouponInput('');
    } else {
      showToast({
        type: 'error',
        title: 'Coupon Error',
        message: result.message
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated()) {
      navigate('/auth', {
        state: {
          message: 'Please login with the demo account to complete your order',
          redirectTo: '/checkout'
        }
      });
      return;
    }
    navigate('/checkout');
  };

  // Calculate totals
  const totalItems = cart.length;
  const totalPrice = getTotalPrice();
  const discountAmount = getDiscountAmount(totalPrice);
  const taxableAmount = Math.max(0, totalPrice - discountAmount);
  const taxAmount = taxableAmount * 0.18; // 18% tax
  const shippingCost = getShippingCost(totalPrice);
  const grandTotal = getGrandTotal();

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </button>
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cart Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Items ({totalItems})
                </h2>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item._id} className="px-6 py-4 flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear the cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 tracking-wide">
                          {appliedCoupon.code} APPLIED
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        showToast({
                          type: 'info',
                          title: 'Coupon Removed',
                          message: 'Coupon code was removed from your cart.'
                        });
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="e.g. WELCOME10"
                        className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase tracking-wider font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {['WELCOME10', 'SAVE20', 'FREESHIP', 'FLAT100'].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleApplyCoupon(code)}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded text-gray-600 transition border border-gray-200"
                        >
                          +{code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Lines */}
              <div className="space-y-3.5 mb-6 pb-6 border-b border-gray-200 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Discount ({appliedCoupon?.code})
                    </span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                {/* Shipping */}
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-base font-semibold text-gray-900 block">Total</span>
                  {discountAmount > 0 && (
                    <span className="text-xs text-emerald-600 font-medium">
                      You saved ₹{discountAmount.toFixed(2)}!
                    </span>
                  )}
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition"
              >
                Continue Shopping
              </button>

              {/* Promo Message */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 <strong>Free shipping</strong> on orders above ₹500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
