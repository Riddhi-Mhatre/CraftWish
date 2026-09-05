import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { getCategories } from '../services/category.service'
import { getProducts } from '../services/product.service'
import { toast } from 'sonner'

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts({ limit: 6 }) // Increased from 4 to 6 for the slider
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        toast.error('Failed to load store data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <Hero />
      
      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-12 border-b border-orange-100 pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 pb-2 leading-relaxed">Shop by Category</h2>
              <p className="text-gray-500 text-lg">Find the perfect handcrafted gift for every occasion.</p>
            </div>
            {/* Desktop See More Link */}
            <Link to="/categories" className="text-[#8B5E3C] font-bold hover:text-orange-600 transition-colors hidden sm:flex items-center gap-2 whitespace-nowrap mb-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 shadow-sm hover:shadow-md">
              See All Categories <span>&rarr;</span>
            </Link>
          </div>
          
          {loading ? (
             <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold text-xl">Loading categories...</div>
          ) : categories.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No categories found. Admins can add them from the Categories page.</div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-8 pt-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.slice(0, 6).map(category => (
               <div key={category._id} className="w-[240px] md:w-[280px] shrink-0 snap-start">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          )}
          
          {/* Mobile See More Button */}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/categories" className="inline-block bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
              See All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-t from-[#FAF8F5] to-orange-50/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-12 border-b border-orange-100 pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-500 pb-2 leading-relaxed">Trending Gifts</h2>
              <p className="text-gray-500 text-lg">Our most loved personalized items.</p>
            </div>
             {/* Desktop See More Link */}
            <Link to="/products" className="text-[#8B5E3C] font-bold hover:text-orange-600 transition-colors hidden sm:flex items-center gap-2 whitespace-nowrap mb-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 shadow-sm hover:shadow-md">
              See All Products <span>&rarr;</span>
            </Link>
          </div>
          
          {loading ? (
             <div className="text-center py-20 animate-pulse text-[#8B5E3C] font-bold text-xl">Loading products...</div>
          ) : products.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No products found. Admins can add them from the Products page.</div>
          ) : (
            // Horizontal Slider
            <div className="flex overflow-x-auto space-x-6 pb-8 pt-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {products.map(product => (
                <div key={product._id} className="w-[260px] md:w-[300px] shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile See More Button */}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-block bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
              See All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home