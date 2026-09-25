import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'shophub_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage', e);
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    const id = product._id || product.id;
    setWishlist((prev) => {
      if (prev.some((item) => (item._id || item.id) === id)) {
        return prev;
      }
      return [...prev, product];
    });

    showToast({
      type: 'success',
      title: 'Added to Wishlist',
      message: `${product.name} saved to your favorites.`
    });
  }, [showToast]);

  const removeFromWishlist = useCallback((productId, productName = null) => {
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));

    if (productName) {
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${productName} removed from your favorites.`
      });
    }
  }, [showToast]);

  const toggleWishlist = useCallback((product) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id, product.name);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist,
        closeWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
