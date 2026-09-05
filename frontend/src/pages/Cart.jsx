// frontend/src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { getCart, removeFromCart } from '../services/cart.service';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      const response = await removeFromCart(itemId);
      setCart(response.data);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <div className="text-center py-20">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4">
        <div className="bg-gradient-to-br from-orange-50 to-white w-48 h-48 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100">
          <Gift className="w-20 h-20 text-[#8B5E3C] opacity-50" />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any personalized gifts yet. Start exploring our collections!</p>
        <Link to="/products" className="bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_10px_20px_rgba(139,94,60,0.3)] hover:-translate-y-1 transition-all duration-300">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fade-in">
      <h1 className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-[0_8px_30px_rgba(139,94,60,0.08)] transition-all duration-300">
              <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                <img 
                  src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-xl text-gray-800 mb-1">{item.product.name}</h3>
                <p className="text-sm font-medium text-gray-500 mb-3">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} x {item.quantity}</p>
                
                {/* Personalization Details Display */}
                {item.personalization && Object.keys(item.personalization).length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-[#FAF8F5] p-4 rounded-xl text-sm text-gray-700 space-y-2 border border-orange-100/50">
                    <p className="font-bold text-[10px] text-orange-600 uppercase tracking-wider mb-1 flex items-center">
                      <Gift className="w-3 h-3 mr-1" /> Customizations
                    </p>
                    {item.personalization.customName && <p><span className="font-semibold text-gray-500">Name:</span> {item.personalization.customName}</p>}
                    {item.personalization.font && <p><span className="font-semibold text-gray-500">Font:</span> {item.personalization.font}</p>}
                    {item.personalization.giftMessage && <p><span className="font-semibold text-gray-500">Message:</span> <span className="italic">"{item.personalization.giftMessage}"</span></p>}
                    {item.personalization.giftWrap && (
                      <p className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold mt-1">
                        Gift Wrap Added (+₹250)
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto h-full space-y-0 sm:space-y-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                <div className="font-extrabold text-2xl text-[#8B5E3C]">
                  ₹{((item.price + (item.personalization?.giftWrap ? 250 : 0)) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <button 
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center text-sm font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(139,94,60,0.08)] border border-orange-50 p-8 sticky top-24">
            <h3 className="font-bold text-xl text-gray-800 mb-6">Order Summary</h3>
            <div className="flex justify-between items-center text-gray-600 mb-4">
              <span>Items ({cart.items.length})</span>
              <span className="font-medium">₹{cart.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 mb-6 pb-6 border-b border-gray-100">
              <span>Shipping</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="text-gray-800 font-bold">Total</span>
              <span className="text-3xl font-extrabold text-[#8B5E3C]">₹{cart.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <Link 
              to="/checkout"
              className="flex justify-center items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 w-full text-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}