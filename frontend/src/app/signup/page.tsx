"use client";
import { useState, Suspense } from 'react';
import API from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice'; // Is import ko check karein

function SignupContent() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/register', formData);

      dispatch(setCredentials(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('Account Created!', {
        description: 'Logging you in automatically...',
        duration: 800
      });

      setTimeout(() => {
        router.push(redirect);
      }, 800);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup Failed!');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join NexusMart</h2>

        <input
          type="text" placeholder="Your Name"
          className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500 transition"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email" placeholder="Email Address"
          className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500 transition"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 bg-black border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500 transition pr-12"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
          Create Account
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition"
        >
          <FcGoogle />
          Continue with Google
        </button>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account? <Link href={`/login?redirect=${redirect}`} className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
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