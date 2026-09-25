import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';
import { Mail, Lock, Eye, EyeOff, Loader, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Notification message or target passed from cart/checkout
  const notificationMessage = location.state?.message;
  const redirectTo = location.state?.redirectTo || '/products';

  // Demo credentials pre-filled by default
  const [formData, setFormData] = useState({
    email: 'customer@example.com',
    password: 'password123'
  });

  const selectDemoAccount = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      // Navigate back to checkout or products
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Notification when redirected (e.g. from checkout) */}
        {notificationMessage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl flex items-start gap-3 shadow-sm">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium">
              {notificationMessage}
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h1>
            <p className="text-gray-600 text-sm">
              Use the pre-filled demo credentials below to log in
            </p>
          </div>

          {/* Quick-Select Demo Credentials */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Available Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectDemoAccount('customer@example.com', 'password123')}
                className={`p-2.5 rounded-lg border text-left transition text-xs ${
                  formData.email === 'customer@example.com'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Customer Demo</span>
                  {formData.email === 'customer@example.com' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-1 truncate">customer@example.com</div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoAccount('admin@example.com', 'password123')}
                className={`p-2.5 rounded-lg border text-left transition text-xs ${
                  formData.email === 'admin@example.com'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Admin Demo</span>
                  {formData.email === 'admin@example.com' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-1 truncate">admin@example.com</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader className="h-5 w-5 animate-spin" />}
              Sign In
            </button>
          </form>

          {/* Continue browsing directly */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue browsing products without logging in
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>🛒 ShopHub Platform Demo</p>
        </div>
      </div>
    </div>
  );
}
