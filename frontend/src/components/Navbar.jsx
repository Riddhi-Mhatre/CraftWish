import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, LogOut } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { AuthContext } from '../context/AuthContext';
import { getCart } from '../services/cart.service';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user && user.role !== 'admin') {
        try {
          const response = await getCart();
          setCartCount(response.data.items?.length || 0);
        } catch (error) {
          console.error("Failed to fetch cart count");
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-[0_4px_30px_rgba(139,94,60,0.05)] transition-all">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative max-w-7xl">
          
          {/* 1. Logo & User Greeting on Top Left */}
          <div className="flex flex-col">
            <Link to="/" className="text-2xl md:text-3xl font-extrabold font-heading leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 tracking-tight">
              CraftWish
            </Link>
            {user && (
              <span className="text-xs text-gray-500 font-bold tracking-wide mt-0.5">Hello, {user.name}</span>
            )}
          </div>
          
          {/* 2. Perfectly Centered Nav Links */}
          <div className="hidden md:flex space-x-8 absolute left-1/2 -translate-x-1/2 bg-white/50 px-6 py-2 rounded-full border border-orange-50 shadow-sm">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors font-bold text-sm uppercase tracking-wider">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-orange-600 transition-colors font-bold text-sm uppercase tracking-wider">Products</Link>
            <Link to="/categories" className="text-gray-700 hover:text-orange-600 transition-colors font-bold text-sm uppercase tracking-wider">Categories</Link>
          </div>

          {/* Right side (Icons & Admin Links) */}
          <div className="flex items-center space-x-3">
            {/* Search Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if(query) navigate(`/products?search=${query}`);
              }} 
              className="hidden lg:flex items-center bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-full px-4 py-2 shadow-inner"
            >
              <Search className="w-4 h-4 text-[#8B5E3C] mr-2" />
              <input 
                type="text" 
                name="search"
                placeholder="Search gifts..." 
                className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all text-gray-700 placeholder-gray-400 font-medium"
              />
            </form>
            
            {user?.role !== 'admin' && (
              <>
                <Link to="/wishlist" className="p-2.5 hover:bg-orange-50 rounded-full transition-all duration-300 hidden sm:block text-gray-600 hover:text-orange-500">
                  <Heart className="w-5 h-5" />
                </Link>
                
                <button onClick={() => setIsCartOpen(true)} className="p-2.5 hover:bg-orange-50 rounded-full transition-all duration-300 relative text-gray-600 hover:text-[#8B5E3C]">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-gradient-to-r from-[#8B5E3C] to-orange-500 text-white text-[10px] font-bold w-4.5 h-4.5 p-1 rounded-full flex items-center justify-center translate-x-0.5 -translate-y-0.5 shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-orange-100">
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-xs font-extrabold text-[#8B5E3C] bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors hidden sm:block uppercase tracking-wider">Dashboard</Link>
                ) : (
                  <Link to="/my-orders" className="text-xs font-extrabold text-[#8B5E3C] bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors hidden sm:block uppercase tracking-wider">Orders</Link>
                )}
                
                <button onClick={handleLogout} className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all duration-300" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="pl-2 border-l border-orange-100">
                <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {user?.role !== 'admin' && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};

export default Navbar;