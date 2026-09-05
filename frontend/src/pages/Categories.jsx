import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getCategories, createCategory } from '../services/category.service';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter locally when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, categories]);

  const onSubmit = async (data) => {
    try {
      await createCategory(data);
      toast.success('Category created successfully!');
      reset(); 
      fetchCategories(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] to-orange-50/30 py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500">
            Browse Categories
          </h1>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B5E3C]" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white shadow-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Admin Form (Only visible to admins) */}
          {user?.role === 'admin' && (
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(139,94,60,0.06)] h-fit border border-orange-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-2xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#8B5E3C] to-orange-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 shadow-md">+</span>
                Add Category
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Category Name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all"
                  />
                  {errors.name && <p className="text-[#EF4444] text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <textarea 
                    placeholder="Description"
                    {...register('description')}
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all resize-none"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Image URL"
                    {...register('image')}
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </form>
            </div>
          )}

          {/* Categories Grid */}
          <div className={user?.role === 'admin' ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold text-xl">Loading categories...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl text-gray-500 shadow-sm border border-gray-100">
                <p className="text-xl font-bold mb-2">No categories found</p>
                <p>Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-4 pb-6 px-2">
                {filteredCategories.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}