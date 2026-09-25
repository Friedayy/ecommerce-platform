export const CATEGORY_FALLBACK_IMAGES = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  Clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
  Books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  Home: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
  Sports: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
};

export const DEMO_PRODUCT_IMAGES = {
  'Wireless Noise-Canceling Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'Mechanical Gaming Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  'Ergonomic Office Chair': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=80',
  'Stainless Steel Water Bottle (32oz)': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
  'Classic Leather Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  'Smart Fitness Tracker Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
};

/**
 * Returns a valid product image URL, falling back to demo mappings or category defaults
 */
export const getProductImage = (product) => {
  if (product?.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image;
  }
  if (product?.name && DEMO_PRODUCT_IMAGES[product.name]) {
    return DEMO_PRODUCT_IMAGES[product.name];
  }
  if (product?.category && CATEGORY_FALLBACK_IMAGES[product.category]) {
    return CATEGORY_FALLBACK_IMAGES[product.category];
  }
  return CATEGORY_FALLBACK_IMAGES.Other;
};
