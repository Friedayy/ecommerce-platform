import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Default Route - Direct access to platform */}
              <Route path="/" element={<Navigate to="/products" replace />} />

              {/* Authentication Route */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Products Route */}
              <Route path="/products" element={<ProductsPage />} />

              {/* Cart Route */}
              <Route path="/cart" element={<CartPage />} />

              {/* Checkout Route */}
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* Profile Route */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin Dashboard Route */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* 404 - Not Found */}
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
