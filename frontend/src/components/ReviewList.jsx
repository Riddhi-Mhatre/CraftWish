import { useState, useEffect, useContext } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProductReviews, createReview, deleteReview } from '../services/review.service';
import { AuthContext } from '../context/AuthContext';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(productId);
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to leave a review.');
      return;
    }
    
    setSubmitting(true);
    try {
      await createReview(productId, { rating, comment });
      toast.success('Review added successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(productId, reviewId);
      toast.success('Review deleted');
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="py-10 text-center">Loading reviews...</div>;

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="mt-20 border-t pt-12 border-orange-100">
      <h2 className="text-3xl font-heading font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500">Customer Reviews</h2>
      
      {/* Summary */}
      <div className="flex items-center space-x-6 mb-10 bg-gradient-to-r from-orange-50 to-white p-8 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-2xl -z-10 opacity-30 translate-x-1/2 -translate-y-1/2"></div>
        <div className="text-5xl font-extrabold text-[#8B5E3C] drop-shadow-sm">{avgRating}</div>
        <div>
          <div className="flex text-orange-400 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-6 h-6 ${star <= Math.round(avgRating) ? 'fill-current' : 'opacity-30 fill-current'}`} />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-500">Based on {reviews.length} review{reviews.length !== 1 && 's'}</p>
        </div>
      </div>

      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-12 bg-white p-8 rounded-3xl border border-orange-50 shadow-[0_8px_30px_rgba(139,94,60,0.06)] relative">
          <h3 className="font-bold text-xl mb-6 text-gray-800">Write a Review</h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Rating</label>
            <div className="flex space-x-2 bg-orange-50/50 w-fit p-2 rounded-xl border border-orange-100">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg transition-all transform hover:scale-110 ${star <= rating ? 'text-orange-500 drop-shadow-sm' : 'text-gray-300 hover:text-orange-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Your Comment</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              maxLength="500"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-300 outline-none transition-all resize-none shadow-inner"
              placeholder="What did you like or dislike about this product?"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_10px_20px_rgba(139,94,60,0.3)] hover:-translate-y-0.5 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:transform-none"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* List of Reviews */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center border border-orange-200">
                    <span className="font-extrabold text-[#8B5E3C] text-lg">
                      {(review.user?.name || 'A')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800">{review.user?.name || 'Anonymous User'}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <div className="flex text-orange-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-current' : 'opacity-30 fill-current'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-400">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Delete button (Only owner or admin can see) */}
                {(user?.role === 'admin' || user?._id === review.user?._id) && (
                  <button onClick={() => handleDelete(review._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-600 mt-2 ml-16 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
