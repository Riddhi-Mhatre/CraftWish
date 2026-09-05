// frontend/src/components/CartDrawer.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getCart, removeFromCart } from '../services/cart.service';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch real cart data from the backend when the drawer opens
  useEffect(() => {
    if (isOpen) {
      const fetchCart = async () => {
        setLoading(true);
        try {
          const response = await getCart();
          setCart(response.data);
        } catch (error) {
          if (error.response?.status !== 401) {
            toast.error('Failed to load cart');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }
  }, [isOpen]);

  const handleRemove = async (itemId) => {
    try {
      const response = await removeFromCart(itemId);
      setCart(response.data); // Update state with the new cart from backend
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-orange-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-orange-50 bg-gradient-to-r from-[#FAF8F5] to-white">
              <h2 className="text-2xl font-heading font-extrabold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500">
                <ShoppingBag className="w-6 h-6 mr-3 text-[#8B5E3C]" />
                Your Cart
              </h2>
              <button onClick={onClose} className="p-2.5 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-full transition-colors shadow-sm bg-white border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-white to-[#FAF8F5]">
              {loading ? (
                <p className="text-center text-[#8B5E3C] font-bold animate-pulse mt-10 text-lg">Loading your cart...</p>
              ) : cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-100 shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-[#8B5E3C] opacity-50" />
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-white p-4 rounded-2xl border border-orange-50 shadow-[0_4px_15px_rgba(139,94,60,0.05)] hover:shadow-[0_4px_15px_rgba(139,94,60,0.1)] transition-shadow">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      {/* Safely check for images */}
                      <img 
                        src={item.product.images?.[0]?.url || 'https://via.placeholder.com/200'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">{item.product.name}</h3>
                        <button 
                          onClick={() => handleRemove(item._id)} 
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Display Personalization exactly as it's saved in the DB */}
                      {item.personalization && Object.keys(item.personalization).length > 0 && (
                        <div className="text-xs text-gray-500 mt-2 bg-orange-50/50 p-2 rounded-lg border border-orange-100/50">
                          {item.personalization.customName && <span className="block font-medium">Name: {item.personalization.customName}</span>}
                          {item.personalization.giftWrap && <span className="block text-green-600 font-medium">✨ Gift Wrap Added</span>}
                        </div>
                      )}
                      
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                          Qty: {item.quantity}
                        </div>
                        <span className="font-extrabold text-[#8B5E3C] text-lg">
                          ₹{((item.price + (item.personalization?.giftWrap ? 250 : 0)) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-orange-100 p-6 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] relative z-10">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-extrabold text-2xl text-gray-800">₹{cart.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</span>
              </div>
              <p className="text-xs text-gray-400 mb-6 font-medium">Shipping and taxes calculated at checkout.</p>
              <Link 
                to="/cart" 
                onClick={onClose}
                className="w-full block text-center bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-4 px-4 rounded-xl hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all mb-3"
              >
                View Full Cart
              </Link>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="w-full block text-center bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold py-4 px-4 rounded-xl hover:shadow-[0_10px_20px_rgba(139,94,60,0.3)] hover:-translate-y-0.5 transition-all"
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;