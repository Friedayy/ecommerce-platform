import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { getStoredUser, logout } from '../services/authService';
import { LogOut, ShoppingBag, User, Mail, MapPin, Calendar, Loader, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  // State for user data and orders
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'account'

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
        // Don't fail completely if orders can't load
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
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/auth');
    }
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
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
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
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* User Avatar */}
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* User Name */}
              <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                {user?.name || 'User'}
              </h2>

              {/* User Details */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">Email</p>
                    <p className="text-sm text-gray-900 break-all">{user?.email}</p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">Role</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">Member Since</p>
                    <p className="text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Dashboard Link */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Admin Dashboard
                </button>
              )}

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'orders'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 inline mr-2" />
                  My Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex-1 px-6 py-4 font-semibold transition ${
                    activeTab === 'account'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="h-5 w-5 inline mr-2" />
                  Account Settings
                </button>
              </div>

              {/* My Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
                      >
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.orderStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : order.orderStatus === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="mb-4 pb-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mt-4">
                              {order.items?.length || 0} item(s) · ₹{order.totalAmount?.toFixed(2) || '0.00'}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div className="text-sm mb-4">
                              <p className="text-gray-600 flex items-start gap-2">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </span>
                              </p>
                            </div>
                          )}

                          {/* View Details Button */}
                          <button
                            onClick={() => {
                              // In production, navigate to order details page
                              alert(`Order Details:\n\nOrder ID: ${order._id}\nStatus: ${order.orderStatus}\nTotal: ₹${order.totalAmount?.toFixed(2)}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            View Details →
                          </button>
                        </div>
                      ))}
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">To change your name, please contact support</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                      <button
                        onClick={() => alert('Password change feature coming soon!')}
                        className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition"
                      >
                        Change Password
                      </button>
                    </div>

                    {/* Preferences Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Receive order updates via email</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Receive promotional emails</span>
                      </label>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 pt-6 border-red-200 bg-red-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            alert('Account deletion feature coming soon!');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
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
    </div>
  );
}
