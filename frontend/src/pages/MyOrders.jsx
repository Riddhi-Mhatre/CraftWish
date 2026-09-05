import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/order.service';
import { toast } from 'sonner';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20">Loading your orders...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-gradient-to-br from-orange-50 to-white p-12 rounded-3xl border border-orange-100 text-center shadow-sm">
          <p className="text-gray-500 text-lg">You haven't placed any orders yet. Time to treat yourself!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgba(139,94,60,0.06)] hover:shadow-[0_8px_30px_rgba(139,94,60,0.12)] transition-shadow duration-300">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 pb-6 gap-4">
                <div>
                  <p className="text-xs text-orange-600 uppercase tracking-widest font-extrabold mb-1">Order #{order._id.substring(18, 24)}</p>
                  <p className="text-sm font-medium text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="md:text-right flex flex-col md:items-end">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold shadow-sm mb-2 ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {order.status}
                  </span>
                  <p className="font-extrabold text-2xl text-gray-800">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-5 bg-gradient-to-r from-gray-50 to-white p-4 rounded-2xl border border-gray-100 group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                      <img 
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800 text-lg mb-1">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-sm font-medium text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;