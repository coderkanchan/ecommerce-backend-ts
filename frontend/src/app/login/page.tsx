"use client";
import { useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));

      alert("Welcome back! Login Successful.");
      router.push('/');
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
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
      </form>
    </div>
  );
}