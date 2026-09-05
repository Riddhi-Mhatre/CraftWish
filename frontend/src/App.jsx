import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Dashboard from './pages/Dashboard';

// 1. We MUST import the new Categories page here!
import Categories from './pages/Categories'; 
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import FadeInPage from './components/FadeInPage';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <WishlistProvider>
        <Toaster position="top-right" richColors />
        <Navbar />
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<FadeInPage><Home /></FadeInPage>} />
            <Route path="/login" element={<FadeInPage><Login /></FadeInPage>} />
            <Route path="/register" element={<FadeInPage><Register /></FadeInPage>} />
            <Route path="/categories" element={<FadeInPage><Categories /></FadeInPage>} />
            <Route path="/products" element={<FadeInPage><Products /></FadeInPage>} />
            <Route path="/products/:id" element={<FadeInPage><ProductDetails /></FadeInPage>} />
            <Route path="/cart" element={<FadeInPage><Cart /></FadeInPage>} />
            <Route path="/wishlist" element={<FadeInPage><Wishlist /></FadeInPage>} />
            <Route path="/checkout" element={<FadeInPage><Checkout /></FadeInPage>} />
            <Route path="/my-orders" element={<FadeInPage><MyOrders /></FadeInPage>} />
            <Route path="/admin" element={<FadeInPage><Dashboard /></FadeInPage>} />
          </Routes>
        </AnimatePresence>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;