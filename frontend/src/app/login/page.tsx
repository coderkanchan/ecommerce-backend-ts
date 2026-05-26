"use client";
import { useState, Suspense } from 'react';
import API from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function LoginContent() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', formData);
      dispatch(setCredentials(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success(`Welcome back, ${data.name}!`, {
        description: 'Login Successful. Redirecting...',
        duration: 1500,
      });

      setTimeout(() => {
        router.push(redirect);
      }, 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login Failed. Try again!');
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/google?redirect=${redirect}`;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 ">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to NexusMart</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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

        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer">
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle />
          Continue with Google
        </button>

        <p className="text-gray-400 mt-6 text-center">
          Don't have an account?
          <Link href={`/signup?redirect=${redirect}`} className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}