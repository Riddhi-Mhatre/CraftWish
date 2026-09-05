import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-orange-50 to-[#F5E6D3] py-20 md:py-32">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5E3C]/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10 max-w-7xl">
        {/* Left Content */}
        <motion.div 
          className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 leading-tight text-gray-900">
            Personalized Gifts <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-orange-600">
              Crafted with Care
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Discover our exclusive collection of handcrafted, personalized gifts that make every moment unforgettable. 
          </p>
          <div className="flex gap-4">
            <Link 
              to="/products"
              className="inline-block bg-gradient-to-r from-[#8B5E3C] to-orange-600 text-white font-extrabold py-4 px-10 rounded-xl hover:shadow-[0_15px_30px_rgba(139,94,60,0.3)] transition-all duration-300 transform hover:-translate-y-1 text-lg"
            >
              Shop Collection
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-lg aspect-square rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(139,94,60,0.2)] border-8 border-white/60">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 mix-blend-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" 
              alt="Handcrafted Gift" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
