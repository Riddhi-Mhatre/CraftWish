import { createContext, useState, useEffect, useContext } from 'react';
import { getWishlist, toggleWishlist as apiToggleWishlist } from '../services/wishlist.service';
import { AuthContext } from './AuthContext';
import { toast } from 'sonner';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistIds, setWishlistIds] = useState([]); // Stores an array of favorite product IDs

  const fetchWishlist = async () => {
    if (user) {
      try {
        const response = await getWishlist();
        // Map the full product objects down to just their ID strings
        const ids = response.data.products.map(p => p._id);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Failed to load wishlist");
      }
    } else {
      setWishlistIds([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, [user]);

  const handleToggle = async (productId) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    
    // "Optimistic Update": Instantly change color before the database finishes saving
    const isCurrentlySaved = wishlistIds.includes(productId);
    if (isCurrentlySaved) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
    } else {
      setWishlistIds(prev => [...prev, productId]);
    }

    try {
      await apiToggleWishlist(productId);
      window.dispatchEvent(new Event('wishlistUpdated')); // Refresh the Wishlist page if it's open
    } catch (error) {
      // Revert color if the API failed
      fetchWishlist();
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, handleToggle }}>
      {children}
    </WishlistContext.Provider>
  );
};