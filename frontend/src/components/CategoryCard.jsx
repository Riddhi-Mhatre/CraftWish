import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category._id}`} className="group block relative rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-transparent hover:border-[#8B5E3C] hover:shadow-[0_0_20px_rgba(139,94,60,0.3)] transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02]">
      <div className="aspect-[4/5] w-full bg-gray-100 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
        <img 
          src={category.image || 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400&auto=format&fit=crop'} 
          alt={category.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8">
        <h3 className="text-white font-extrabold text-2xl md:text-3xl font-heading tracking-wide text-center px-4 drop-shadow-md group-hover:-translate-y-2 transition-transform duration-300">
          {category.name}
        </h3>
        <div className="w-0 h-1 bg-gradient-to-r from-[#8B5E3C] to-orange-400 mt-2 rounded-full group-hover:w-16 transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default CategoryCard;