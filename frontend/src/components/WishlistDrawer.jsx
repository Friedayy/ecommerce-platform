import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProductImage } from '../utils/productImages';
import {
  Heart,
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistCount,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist
  } = useWishlist();

  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    const id = product._id || product.id;
    addToCart(product, 1);
    removeFromWishlist(id);
    showToast({
      type: 'success',
      title: 'Moved to Cart',
      message: `${product.name} moved from wishlist to your cart.`,
      image: getProductImage(product),
      action: {
        label: 'View Cart',
        onClick: () => {
          closeWishlist();
          navigate('/cart');
        }
      }
    });
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    const count = wishlist.length;
    clearWishlist();
    showToast({
      type: 'success',
      title: 'All Items Moved to Cart',
      message: `${count} items added to your cart.`,
      action: {
        label: 'Go to Cart',
        onClick: () => {
          closeWishlist();
          navigate('/cart');
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="h-5 w-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Saved Items
                </h3>
                <p className="text-xs text-gray-500">
                  {wishlistCount} {wishlistCount === 1 ? 'product' : 'products'} in your wishlist
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeWishlist}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
                  Save your favorite items as you explore our catalog by tapping the heart icon on any product.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate('/products');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Explore Products</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 divide-y divide-gray-100">
                {wishlist.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <div key={id} className="pt-3.5 first:pt-0 flex gap-3.5 items-start">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(id, item.name)}
                            className="text-gray-300 hover:text-rose-500 p-1 rounded transition flex-shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.category || 'General'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-extrabold text-blue-600">
                            ₹{item.price?.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs font-semibold transition"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Move to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlist.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-2.5">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Move All ({wishlist.length}) to Cart</span>
              </button>
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-gray-400 hover:text-rose-600 transition"
                >
                  Clear Wishlist
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeWishlist();
                    navigate('/cart');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition"
                >
                  <span>Go to Cart</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
