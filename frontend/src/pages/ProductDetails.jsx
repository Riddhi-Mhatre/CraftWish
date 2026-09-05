import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, ShoppingCart, Check, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { getProductById } from '../services/product.service'
import { addToCart } from '../services/cart.service';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewList from '../components/ReviewList';

const customFormSchema = z.object({
  customName: z.string().max(30, "Name must be less than 30 characters").optional(),
  giftMessage: z.string().max(150, "Message must be less than 150 characters").optional(),
  font: z.string().optional(),
  fontColor: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  giftWrap: z.boolean().default(false)
})

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setActiveImage(response.data.images[0].url);
        }
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customFormSchema),
    defaultValues: {
      customName: '',
      giftMessage: '',
      font: 'Inter',
      fontColor: '#2D2D2D',
      imageUrl: '',
      giftWrap: false
    }
  })

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity: quantity,
        personalization: product.isCustomizable ? data : {}
      });
      toast.success('Product added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  }

  if (loading) return <div className="text-center py-20">Loading product...</div>
  if (!product) return <div className="text-center py-20">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
            <img src={activeImage || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" />
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
            {product.images && product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img.url)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-sm ${activeImage === img.url ? 'border-[#8B5E3C] scale-105 shadow-md' : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information & Customization */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5E3C] to-orange-600 leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current opacity-50" />
            </div>
            <span className="font-bold text-gray-700">4.8</span>
            <span className="text-gray-500">(124 reviews)</span>
          </div>

          <div className="text-4xl font-extrabold text-[#8B5E3C] mb-6 flex items-end">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            <span className="text-sm font-normal text-gray-500 mb-1 ml-2">Inclusive of all taxes</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Customization Form */}
          {product.isCustomizable && (
            <div className="bg-gradient-to-br from-orange-50 to-[#FAF8F5] rounded-3xl p-8 mb-8 border border-orange-100 shadow-sm relative overflow-hidden">
              <div className="absolute -top-10 -right-10 bg-[#8B5E3C]/5 w-32 h-32 rounded-full blur-2xl"></div>
              
              <h3 className="font-heading font-bold text-xl mb-6 flex items-center text-gray-800">
                <span className="bg-gradient-to-r from-[#8B5E3C] to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-md">1</span>
                Personalize Your Gift
              </h3>
              
              <form id="customization-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Custom Name (Optional)</label>
                  <input 
                    type="text" 
                    {...register("customName")}
                    className="w-full px-4 py-3 rounded-xl border border-white shadow-sm focus:ring-2 focus:ring-[#8B5E3C]/40 focus:border-[#8B5E3C] outline-none transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter name to print"
                  />
                  {errors.customName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.customName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Gift Message</label>
                  <textarea 
                    {...register("giftMessage")}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-white shadow-sm focus:ring-2 focus:ring-[#8B5E3C]/40 focus:border-[#8B5E3C] outline-none transition-all bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Write a special message..."
                  ></textarea>
                  {errors.giftMessage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.giftMessage.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Font Style</label>
                    <select {...register("font")} className="w-full px-4 py-3 rounded-xl border border-white shadow-sm focus:ring-2 focus:ring-[#8B5E3C]/40 focus:border-[#8B5E3C] outline-none bg-white/80 backdrop-blur-sm appearance-none cursor-pointer">
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Poppins">Poppins (Bold)</option>
                      <option value="Cursive">Cursive (Elegant)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Text Color</label>
                    <div className="flex items-center h-12 bg-white/80 backdrop-blur-sm rounded-xl px-2 border border-white shadow-sm">
                      <input type="color" {...register("fontColor")} className="h-8 w-full rounded cursor-pointer border-0 p-0 bg-transparent" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Custom Image URL</label>
                  <div className="flex relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E3C]">
                      <Upload className="w-4 h-4" />
                    </span>
                    <input 
                      type="url" 
                      {...register("imageUrl")}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-white shadow-sm focus:ring-2 focus:ring-[#8B5E3C]/40 focus:border-[#8B5E3C] outline-none transition-all bg-white/80 backdrop-blur-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {errors.imageUrl && <p className="text-red-500 text-xs mt-1 font-medium">{errors.imageUrl.message}</p>}
                </div>

                <div className="flex items-center mt-6 p-4 bg-white/60 border border-white rounded-xl shadow-sm">
                  <input 
                    type="checkbox" 
                    id="giftWrap" 
                    {...register("giftWrap")}
                    className="w-5 h-5 text-[#8B5E3C] rounded border-gray-300 focus:ring-[#8B5E3C] cursor-pointer"
                  />
                  <label htmlFor="giftWrap" className="ml-3 font-medium text-gray-700 cursor-pointer flex-grow">
                    Add Premium Gift Wrap
                  </label>
                  <span className="font-bold text-[#8B5E3C]">+₹250</span>
                </div>
              </form>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden h-14">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-5 h-full font-bold text-gray-600 hover:bg-gray-100 hover:text-[#8B5E3C] transition-colors"
              >-</button>
              <span className="w-12 text-center font-bold text-lg select-none">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-5 h-full font-bold text-gray-600 hover:bg-gray-100 hover:text-[#8B5E3C] transition-colors"
              >+</button>
            </div>
            
            <button 
              type="submit"
              form={product.isCustomizable ? "customization-form" : undefined}
              onClick={!product.isCustomizable ? handleSubmit(onSubmit) : undefined}
              className="flex-grow bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold h-14 px-8 rounded-xl hover:shadow-[0_10px_20px_rgba(139,94,60,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>

          <div className="mt-8 flex items-center text-sm text-green-700 font-bold bg-green-50 p-4 rounded-xl border border-green-200 w-fit shadow-sm">
            <Check className="w-5 h-5 mr-3 bg-green-200 p-1 rounded-full text-green-800" />
            In Stock & Ready to ship in 2-3 business days
          </div>
        </div>
      </div>

      <div className="mt-20">
        <ReviewList productId={product._id} />
      </div>
    </div>
  )
}

export default ProductDetails
