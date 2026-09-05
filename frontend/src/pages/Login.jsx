import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

// 1. Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      loginUser(response.data); // Save user to Context
      toast.success('Logged in successfully!');
      navigate('/'); // Redirect to home
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-orange-50 p-4">
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(139,94,60,0.15)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in border border-orange-100/50">
        
        {/* Left Side: Image/Branding */}
        <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-[500px]">
          <div className="absolute inset-0 bg-[#8B5E3C]/20 z-10 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" 
            alt="CraftWish Login" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 flex flex-col justify-end p-10">
            <h2 className="text-3xl font-heading text-white font-bold mb-2">Welcome Back!</h2>
            <p className="text-gray-200">Log in to discover more personalized, handcrafted gifts tailored just for you.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 font-heading">Log In</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                {...register('email')}
                placeholder="you@example.com"
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 p-3 border outline-none transition-all"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                {...register('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 p-3 border outline-none transition-all"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#8B5E3C] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#7A5234] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-[#8B5E3C] font-bold hover:underline transition-all">Create one</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}