import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { checkout } from '../services/order.service';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State for the form fields
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'Cash on Delivery'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Group the data into the exact structure our backend validator expects
    const payload = {
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: formData.paymentMethod
    };

    try {
      await checkout(payload);
      toast.success('Order placed successfully! Transaction complete.');
      // Update the cart icon count in the navbar
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/'); // Go back home
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-gray-600">Please log in to checkout.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 mb-2">Secure Checkout</h1>
        <p className="text-gray-500">Please enter your shipping and payment details.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_15px_40px_rgba(139,94,60,0.1)] border border-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5E3C]/5 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-[#8B5E3C] to-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">1</span>
          Shipping Address
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Street Address</label>
            <input required type="text" name="street" value={formData.street} onChange={handleChange} placeholder="123 Main St, Apt 4B" className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">State / Province</label>
            <input required type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Zip Code</label>
            <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="400001" className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Country</label>
            <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-[#8B5E3C] to-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">2</span>
          Payment Method
        </h2>
        <div className="mb-10">
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all shadow-sm appearance-none cursor-pointer font-medium text-gray-700"
          >
            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:shadow-[0_15px_30px_rgba(139,94,60,0.3)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? 'Processing Transaction...' : 'Place Order Now'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;