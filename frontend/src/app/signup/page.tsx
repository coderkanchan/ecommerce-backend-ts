"use client";
import { useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/register', formData);

      localStorage.setItem('userInfo', JSON.stringify(data));

      alert("Signup Successful & Logging In!");

      router.push('/');

      
    } catch (error: any) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join NexusMart</h2>
        <input
          type="text" placeholder="Your Name"
          className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email" placeholder="Email Address"
          className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password" placeholder="Password"
          className="w-full p-4 mb-6 bg-black border border-gray-700 rounded-lg text-white"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition">
          Create Account
        </button>
        <p className="text-gray-400 mt-6 text-center">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}