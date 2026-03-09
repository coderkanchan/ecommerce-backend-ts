"use client";
import { useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', formData);
      dispatch(setCredentials(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      alert("Welcome back! Login Successful.");
      router.push('/');

    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to NexusMart</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-6 bg-black border border-gray-700 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-100 transition"
        >
          <img src="/google-icon.svg" width="20" alt="google" />
          Continue with Google
        </button>
      </form>
    </div>
  );
}