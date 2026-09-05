import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { addToCart } from '../services/cart.service';
import { toast } from 'sonner';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Pull our global wishlist data
  const { wishlistIds, handleToggle } = useContext(WishlistContext);
  
  // Check if this specific product is in the user's wishlist
  const isWishlisted = wishlistIds.includes(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.isCustomizable) {
      toast.info('Please personalize your gift first!');
      navigate(`/products/${product._id}`);
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1, personalization: {} });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    handleToggle(product._id);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-transparent hover:border-[#8B5E3C] hover:shadow-[0_0_15px_rgba(139,94,60,0.2)] transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02] flex flex-col h-full relative">
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
        {product.isCustomizable && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#8B5E3C] to-orange-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full z-20 shadow-md">
            Customizable
          </span>
        )}
        
        {/* Dynamic Heart Icon */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full z-20 hover:bg-white text-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'hover:text-pink-500'}`} />
        </button>

        <img 
          src={product.images && product.images.length > 0 ? product.images[0].url : product.image || 'https://via.placeholder.com/400'} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow bg-white relative z-20">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product._id}`} className="block flex-grow pr-2">
            <h3 className="font-bold text-gray-900 text-lg hover:text-[#8B5E3C] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center bg-orange-50 px-2 py-0.5 rounded flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400 mr-1" />
            <span className="text-xs font-bold text-orange-700">{product.rating || 4.5}</span>
          </div>
        </div>
        
        <div className="mt-auto flex items-end justify-between pt-4">
          <span className="font-extrabold text-2xl text-[#8B5E3C]">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-gray-50 hover:bg-gradient-to-r hover:from-[#8B5E3C] hover:to-orange-500 text-gray-600 hover:text-white p-3 rounded-xl hover:shadow-[0_5px_15px_rgba(139,94,60,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;