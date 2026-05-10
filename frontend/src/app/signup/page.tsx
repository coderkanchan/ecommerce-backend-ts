"use client";
import { useState, Suspense } from 'react';
import API from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

function SignupContent() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await API.post('/users/register', formData);

      dispatch(setCredentials(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success(`Welcome to the family, ${data.name}!`, {
        description: "Your NexusMart account is ready. Let's go!",
        icon: <Sparkles className="text-yellow-400" size={18} />,
        duration: 2000,
      });

      setTimeout(() => {
        router.push(redirect);
      }, 2000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup Failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/google?redirect=${redirect}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
     
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl mb-4">
            <UserPlus className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 mt-2 text-sm">Join NexusMart and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800 space-y-4">
          <input
            type="text" placeholder="Full Name"
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email" placeholder="Email Address"
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-12"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-gray-800"></div>
            <span className="shrink mx-4 text-gray-500 text-xs uppercase">Or</span>
            <div className="grow border-t border-gray-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
          >
            <FcGoogle size={20} />
            Join with Google
          </button>

          <p className="text-gray-400 mt-6 text-center text-sm">
            Already have an account? <Link href={`/login?redirect=${redirect}`} className="text-blue-400 hover:underline font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignupContent />
    </Suspense>
  );
}