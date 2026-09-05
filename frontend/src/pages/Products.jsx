import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, createProduct } from '../services/product.service';
import { getCategories } from '../services/category.service';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';

export default function Products() {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State - Read initial category from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  // Admin Form Setup
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch both products (with filters) and all categories for the dropdowns
      const [prodRes, catRes] = await Promise.all([
        getProducts({ search: searchQuery, category: selectedCategory }),
        getCategories()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  // Update local state if URL parameter changes
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam !== null && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
    const searchParam = searchParams.get('search');
    if (searchParam !== null && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Reload data whenever search or category changes
  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  const onAdminSubmit = async (data) => {
    try {
      // Convert string values to numbers
      data.price = Number(data.price);
      data.stock = Number(data.stock);
      // Format image array
      data.images = [{ url: data.imageUrl, isPrimary: true }];
      
      await createProduct(data);
      toast.success('Product added successfully!');
      reset();
      loadData(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] to-orange-50/30 py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500">
            Our Collection
          </h1>
          
          <div className="flex w-full md:w-auto gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow min-w-[250px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C]" />
              <input 
                type="text" 
                placeholder="Search gifts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white shadow-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            {/* Category Filter */}
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-3 px-4 rounded-xl border border-white shadow-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all bg-white/80 backdrop-blur-sm cursor-pointer appearance-none font-medium text-gray-700 min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Admin Create Form (Only visible to admins) */}
          {user?.role === 'admin' && (
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(139,94,60,0.06)] h-fit border border-orange-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-2xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#8B5E3C] to-orange-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 shadow-md">+</span>
                Add Product
              </h2>
              <form onSubmit={handleSubmit(onAdminSubmit)} className="space-y-4">
                <input {...register('name', { required: true })} placeholder="Product Name" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all" />
                <input {...register('sku', { required: true })} placeholder="SKU (e.g. MUG-001)" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all" />
                <textarea {...register('description', { required: true })} placeholder="Description" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all resize-none" rows="3" />
                
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price (₹)" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all" />
                  <input type="number" {...register('stock', { required: true })} placeholder="Stock Qty" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all" />
                </div>
                
                <select {...register('category', { required: true })} className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all cursor-pointer">
                  <option value="">Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                
                <input {...register('imageUrl', { required: true })} placeholder="Image URL" className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all" />
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <input type="checkbox" id="custom" {...register('isCustomizable')} className="w-4 h-4 text-[#8B5E3C] focus:ring-[#8B5E3C] rounded border-gray-300" />
                  <label htmlFor="custom" className="ml-2 font-medium text-sm text-gray-700 cursor-pointer">Is Customizable?</label>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2">
                  {isSubmitting ? 'Saving...' : 'Add Product'}
                </button>
              </form>
            </div>
          )}

          {/* Product Grid */}
          <div className={user?.role === 'admin' ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold text-xl">Loading amazing gifts...</div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl text-gray-500 shadow-sm border border-gray-100">
                <p className="text-xl font-bold mb-2">No products found</p>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-4 pb-6 px-2">
                {products.map(product => (
                  <Link 
                    to={`/products/${product._id}`} 
                    key={product._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-transparent hover:border-[#8B5E3C] hover:shadow-[0_0_15px_rgba(139,94,60,0.2)] transform hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow relative bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</p>
                        {product.isCustomizable && (
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Customizable</span>
                        )}
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#8B5E3C] transition-colors line-clamp-2">{product.name}</h3>
                      <div className="mt-auto">
                        <span className="font-extrabold text-2xl text-[#8B5E3C]">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
