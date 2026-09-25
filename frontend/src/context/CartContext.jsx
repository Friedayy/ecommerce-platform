import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

export const AVAILABLE_COUPONS = {
  WELCOME10: {
    code: 'WELCOME10',
    description: '10% off entire order',
    type: 'percentage',
    value: 10,
    minOrder: 0
  },
  SAVE20: {
    code: 'SAVE20',
    description: '20% off orders above ₹1,000',
    type: 'percentage',
    value: 20,
    minOrder: 1000
  },
  FREESHIP: {
    code: 'FREESHIP',
    description: 'Free express shipping',
    type: 'shipping',
    value: 100,
    minOrder: 0
  },
  FLAT100: {
    code: 'FLAT100',
    description: 'Flat ₹100 off orders above ₹500',
    type: 'flat',
    value: 100,
    minOrder: 500
  }
};

const CART_STORAGE_KEY = 'cart';
const COUPON_STORAGE_KEY = 'shophub_coupon';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch (e) {
      return null;
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Save applied coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Coupon handlers
  const applyCoupon = useCallback((inputCode) => {
    if (!inputCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const code = inputCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[code];

    if (!coupon) {
      return { success: false, message: `Coupon code "${code}" is invalid.` };
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Code "${code}" requires a minimum order subtotal of ₹${coupon.minOrder}.`
      };
    }

    setAppliedCoupon(coupon);
    return {
      success: true,
      coupon,
      message: `Coupon "${coupon.code}" applied! (${coupon.description})`
    };
  }, [cart]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const getDiscountAmount = useCallback((subtotal = null) => {
    const currentSubtotal = subtotal !== null ? subtotal : getTotalPrice();
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return (currentSubtotal * appliedCoupon.value) / 100;
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(currentSubtotal, appliedCoupon.value);
    }
    return 0; // 'shipping' type discount is applied directly on shipping fee
  }, [appliedCoupon, getTotalPrice]);

  const getShippingCost = useCallback((subtotal = null) => {
    const currentSubtotal = subtotal !== null ? subtotal : getTotalPrice();
    if (appliedCoupon?.type === 'shipping') return 0;
    return currentSubtotal > 500 ? 0 : 50;
  }, [appliedCoupon, getTotalPrice]);

  const getGrandTotal = useCallback(() => {
    const subtotal = getTotalPrice();
    const discount = getDiscountAmount(subtotal);
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = taxableSubtotal * 0.18;
    const shipping = getShippingCost(subtotal);
    return taxableSubtotal + tax + shipping;
  }, [getTotalPrice, getDiscountAmount, getShippingCost]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getShippingCost,
        getGrandTotal,
        availableCoupons: AVAILABLE_COUPONS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
