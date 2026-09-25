import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getStoredUser, logout } from '../services/authService';
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LogIn,
  Package,
  ShieldCheck,
  Store
} from 'lucide-react';

export default function Navbar() {
  const { getTotalItems } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  // Don't show navbar on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  const handleLogout = () => {
    logout();
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out successfully.'
    });
    navigate('/products');
  };

  const totalItems = getTotalItems();
  const { wishlistCount, openWishlist } = useWishlist();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Products */}
            <button
              onClick={() => navigate('/products')}
              className={`flex items-center gap-1 font-medium transition ${
                location.pathname === '/products'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">Products</span>
            </button>

            {/* Wishlist with Badge */}
            <button
              type="button"
              onClick={openWishlist}
              className="relative flex items-center gap-1 font-medium text-gray-600 hover:text-rose-600 transition"
              title="Saved Items"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in-75 duration-150">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart with Badge */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative flex items-center gap-1 font-medium transition ${
                location.pathname === '/cart'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className={`flex items-center gap-1 font-medium transition ${
                    location.pathname === '/profile'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {/* Admin Dashboard (if admin) */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className={`flex items-center gap-1 font-medium transition ${
                      location.pathname === '/admin'
                        ? 'text-purple-600'
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600 font-medium transition ml-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition ml-2 shadow-sm text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
