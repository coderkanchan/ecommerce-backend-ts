"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User, Mail, ShieldCheck, Calendar, MapPin, Building } from 'lucide-react';

export default function SellerProfilePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
       
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Seller <span className="text-blue-500">Profile</span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your professional identity and store settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center sticky top-10">
              <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-700 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-blue-600/20">
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">{userInfo?.name}</h2>
              <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">Verified Seller</p>

              <div className="mt-8 pt-8 border-t border-gray-900 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Account Active</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar size={18} className="text-blue-500" />
                  <span>Joined May 2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-500" /> Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 tracking-widest block mb-2">Full Name</label>
                  <div className="flex items-center gap-3 bg-black p-4 rounded-xl border border-gray-800">
                    <User size={18} className="text-gray-600" />
                    <span className="text-sm font-medium">{userInfo?.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 tracking-widest block mb-2">Email Address</label>
                  <div className="flex items-center gap-3 bg-black p-4 rounded-xl border border-gray-800">
                    <Mail size={18} className="text-gray-600" />
                    <span className="text-sm font-medium">{userInfo?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Building size={20} className="text-blue-500" /> Store Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-400 font-medium italic">Store location not set yet</span>
                  </div>
                  <button className="text-xs font-bold text-blue-500 hover:underline cursor-pointer">Add Address</button>
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-tighter">
                  Note: Shop address is required for generating invoices and managing local pickups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}