import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Loader,
  AlertCircle,
  Eye,
  X,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { getProductImage } from '../utils/productImages';

export default function ProductsPage() {
  // State for products and filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Quick View modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Contexts
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Categories available
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  // Sync category filter from URL query param (e.g. from Footer links)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null && cat !== category) {
      setCategory(cat);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, page]);

  // API call to get products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getProducts({
        search,
        category,
        minPrice,
        maxPrice,
        page,
        limit: 12
      });

      setProducts(response.products);
      setTotalPages(response.pages);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart with toast notification
  const handleAddToCart = (product, quantity = 1, e = null) => {
    if (e) e.stopPropagation();
    addToCart(product, quantity);
    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.name} (₹${(product.price * quantity).toFixed(2)})`,
      image: getProductImage(product),
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      }
    });
  };

  // Open Quick View Modal
  const handleOpenQuickView = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  // Close Quick View Modal
  const handleCloseQuickView = () => {
    setSelectedProduct(null);
    setModalQuantity(1);
  };

  // Handle Buy Now (adds to cart and proceeds to checkout)
  const handleBuyNow = (product, quantity = 1) => {
    addToCart(product, quantity);
    handleCloseQuickView();
    navigate('/checkout');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleOpenQuickView(product)}
                      className="group bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col cursor-pointer"
                    >
                      {/* Product Image Container */}
                      <div className="bg-gray-100 h-52 w-full overflow-hidden relative">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                          }}
                        />

                        {/* Category Badge */}
                        <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs text-gray-700">
                          {product.category}
                        </span>

                        {/* Quick View Hover Button */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenQuickView(product);
                            }}
                            className="bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            Quick View
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                          {product.name}
                        </h3>

                        <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3 mt-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 font-medium ml-1">
                            {product.rating}
                          </span>
                        </div>

                        {/* Price and Stock */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mb-3">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            product.stock > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, 1, e)}
                          disabled={product.stock === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-xs"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Products Found */}
                {products.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-600 text-base">No products match your search filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium rounded-lg transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium rounded-lg transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseQuickView}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 rounded-full shadow-xs transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Product Image */}
            <div className="md:w-1/2 bg-gray-100 relative min-h-[280px] md:min-h-full flex items-center justify-center">
              <img
                src={getProductImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                {selectedProduct.category}
              </span>
            </div>

            {/* Modal Details */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
              <div>
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h2>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(selectedProduct.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 font-semibold ml-1">
                      {selectedProduct.rating} / 5.0
                    </span>
                  </div>
                  <span className="text-gray-300">·</span>
                  <span className={`text-xs font-semibold ${
                    selectedProduct.stock > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} left in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-blue-600">
                    ₹{selectedProduct.price}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">Inclusive of all taxes</span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Guarantees / Perks */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>Free shipping &gt; ₹500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>7 Days Replacement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>

              {/* Actions & Quantity */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                      disabled={modalQuantity <= 1}
                      className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {modalQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                      disabled={modalQuantity >= selectedProduct.stock}
                      className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity);
                      handleCloseQuickView();
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-900 font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(selectedProduct, modalQuantity)}
                    disabled={selectedProduct.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Zap className="h-4 w-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
