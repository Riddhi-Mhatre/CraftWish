import { useState, useEffect } from 'react';
import { getWishlist } from '../services/wishlist.service';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlistProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // Listen for the toggle event so the page removes the item instantly if clicked again
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] to-orange-50/30 py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 mb-10">
          Your Wishlist
        </h1>
        
        {loading ? (
          <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold text-xl">Loading your favorites...</div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-gradient-to-br from-orange-50 to-white p-12 text-center rounded-3xl shadow-sm border border-orange-100">
            <p className="text-gray-500 text-lg font-medium">You haven't saved any items yet. Start adding some favorites!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4 pb-6 px-2">
            {wishlistProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}