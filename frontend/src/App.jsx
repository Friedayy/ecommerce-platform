import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Default Route - Redirect to Auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Authentication Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Products Route */}
          <Route path="/products" element={<ProductsPage />} />

          {/* Cart Route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Checkout Route */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
