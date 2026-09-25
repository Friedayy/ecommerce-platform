import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { getStoredUser, logout } from '../services/authService';
import { useToast } from '../context/ToastContext';
import {
  LogOut,
  ShoppingBag,
  User,
  Mail,
  MapPin,
  Calendar,
  Loader,
  AlertCircle,
  ShieldCheck,
  X,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export default function ProfilePage() {
  // State for user data and orders
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'account'

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Fetch user and orders on mount
  useEffect(() => {
    fetchUserAndOrders();
  }, []);

  const fetchUserAndOrders = async () => {
    try {
      setLoading(true);
      setError('');

      // Get current user from localStorage
      const currentUser = getStoredUser();
      if (!currentUser) {
        navigate('/auth', {
          state: {
            message: 'Please login with the demo account to view your profile and orders',
            redirectTo: '/profile'
          }
        });
        return;
      }
      setUser(currentUser);

      // Get user's orders
      try {
        const ordersData = await getMyOrders();
        setOrders(ordersData?.orders || (Array.isArray(ordersData) ? ordersData : []));
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrders([]);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.'
    });
    navigate('/products');
  };

  // Helper for order status badge styling
  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'completed' || s === 'delivered') {
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Delivered' };
    }
    if (s === 'shipped') {
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Shipped' };
    }
    if (s === 'cancelled') {
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelled' };
    }
    if (s === 'processing' || s === 'confirmed') {
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Processing' };
    }
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-xs border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-7 w-7 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Account</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-4 py-2 rounded-lg font-medium transition text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6">
              {/* User Avatar */}
              <div className="flex justify-center mb-5">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* User Name */}
              <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                {user?.name || 'User'}
              </h2>
              <p className="text-xs text-gray-500 text-center mb-6">Verified Customer</p>

              {/* User Details */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm text-gray-900 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Account Tier</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role === 'admin' ? 'Admin Access' : 'Standard Member'}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'September 2026'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Dashboard Link */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-xs"
                >
                  Open Admin Dashboard
                </button>
              )}

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm"
              >
                Browse Catalog
              </button>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 mb-6 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 px-6 py-4 font-semibold text-sm transition flex items-center justify-center gap-2 ${
                    activeTab === 'orders'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex-1 px-6 py-4 font-semibold text-sm transition flex items-center justify-center gap-2 ${
                    activeTab === 'account'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Account Settings
                </button>
              </div>

              {/* My Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders placed yet</h3>
                      <p className="text-gray-500 text-sm mb-6">Browse our catalog and place your first order!</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const badge = getStatusBadge(order.orderStatus);
                        return (
                          <div
                            key={order._id}
                            className="border border-gray-200/80 rounded-xl p-5 hover:border-gray-300 hover:shadow-xs transition bg-white"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
                                <h3 className="font-bold text-gray-900 text-base">
                                  #{order._id.slice(-8).toUpperCase()}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                  {badge.label}
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{order.totalAmount?.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Summary Items Bar */}
                            <div className="py-3 border-y border-gray-100 flex items-center justify-between text-xs text-gray-600">
                              <span>
                                <strong>{order.items?.length || 0}</strong> item(s) in this shipment
                              </span>
                              <span>
                                Payment via <strong>{order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'CARD'}</strong>
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                              >
                                View Order Details & Track →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <div className="space-y-6 max-w-2xl">
                    {/* Account Information */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Security</h3>
                      <button
                        type="button"
                        onClick={() => showToast({
                          type: 'info',
                          title: 'Password Management',
                          message: 'Password updates are managed via account settings. Demo accounts have fixed credentials.'
                        })}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition text-xs"
                      >
                        Change Password
                      </button>
                    </div>

                    {/* Preferences */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Preferences</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span>Receive order notifications via email</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span>Receive weekly deals & product recommendations</span>
                        </label>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border border-red-200 bg-red-50/50 p-5 rounded-xl">
                      <h3 className="text-sm font-bold text-red-900 mb-1">Danger Zone</h3>
                      <p className="text-xs text-red-600 mb-3">Permanent actions regarding your account profile.</p>
                      <button
                        type="button"
                        onClick={() => showToast({
                          type: 'info',
                          title: 'Demo Environment',
                          message: 'Demo account cannot be deleted.'
                        })}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-xs shadow-xs"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details & Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Order Details
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: #{selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Stepper Status */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Shipment Progress
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Pending', icon: Clock, active: true },
                    { label: 'Confirmed', icon: CheckCircle2, active: ['confirmed', 'processing', 'shipped', 'delivered', 'completed'].includes(selectedOrder.orderStatus) },
                    { label: 'Shipped', icon: Truck, active: ['shipped', 'delivered', 'completed'].includes(selectedOrder.orderStatus) },
                    { label: 'Delivered', icon: Package, active: ['delivered', 'completed'].includes(selectedOrder.orderStatus) }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition ${
                        step.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className={`text-xs font-semibold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Purchased Items
                </h4>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product?.name || 'Product'}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.product?.name || 'Item'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} · ₹{item.price} each
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="border-t border-gray-100 pt-5">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Shipping Address
                  </h4>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-5">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Method</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.paymentMethod ? selectedOrder.paymentMethod.replace('_', ' ').toUpperCase() : 'CREDIT CARD'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Order Total</span>
                    <span className="text-base font-bold text-blue-600">
                      ₹{selectedOrder.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
