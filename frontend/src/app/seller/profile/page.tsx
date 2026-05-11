"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { User, Mail, ShieldCheck, Calendar, MapPin, Building, X } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/services/api';
import { setCredentials } from '@/redux/slices/authSlice';

export default function SellerProfilePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [storeData, setStoreData] = useState({
    storeName: userInfo?.storeDetails?.storeName || '',
    phone: userInfo?.storeDetails?.phone || '',
    street: userInfo?.storeDetails?.address?.street || '',
    city: userInfo?.storeDetails?.address?.city || '',
    pincode: userInfo?.storeDetails?.address?.pincode || '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/api/users/profile/store', storeData);

      const updatedUser = { ...userInfo, ...data };
      dispatch(setCredentials(updatedUser));
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      toast.success("Store details updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update store details");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 relative">
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
              <h2 className="text-xl font-bold uppercase tracking-tight truncate px-2">{userInfo?.name}</h2>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Verified Seller</p>

              <div className="mt-8 pt-8 border-t border-gray-900 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Account Active</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar size={18} className="text-blue-500" />
                  <span>Member since 2026</span>
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
                <InfoBox label="Full Name" value={userInfo?.name} icon={<User size={16} />} />
                <InfoBox label="Email Address" value={userInfo?.email} icon={<Mail size={16} />} />
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Building size={20} className="text-blue-500" /> Store Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-900 rounded-lg"><MapPin size={20} className="text-blue-500" /></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-bold uppercase tracking-tight">
                        {userInfo?.storeDetails?.storeName || 'Store not set'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {userInfo?.storeDetails?.address?.city || 'Location missing'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="text-xs font-black text-blue-500 hover:text-white transition uppercase tracking-widest cursor-pointer bg-blue-500/10 px-4 py-2 rounded-lg">
                    {userInfo?.storeDetails?.storeName ? 'Edit' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white cursor-pointer"><X size={24} /></button>
            <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Setup <span className="text-blue-500 font-black">Store</span></h2>

            <form onSubmit={handleUpdateStore} className="space-y-5">
              <InputGroup label="Store Name" value={storeData.storeName} onChange={(val: string) => setStoreData({ ...storeData, storeName: val })} placeholder="e.g. Nexus Tech Hub" />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Business Phone" value={storeData.phone} onChange={(val: string) => setStoreData({ ...storeData, phone: val })} placeholder="+91..." />
                <InputGroup label="City" value={storeData.city} onChange={(val: string) => setStoreData({ ...storeData, city: val })} placeholder="City name" />
              </div>
              <InputGroup label="Street Address" value={storeData.street} onChange={(val: string) => setStoreData({ ...storeData, street: val })} placeholder="Building, Street, Area" />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 border border-gray-800 rounded-2xl font-black text-xs uppercase hover:bg-gray-900 transition tracking-widest cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 tracking-widest cursor-pointer">Save Store</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value, icon }: any) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">{label}</label>
      <div className="flex items-center gap-3 bg-black p-4 rounded-xl border border-gray-800">
        <span className="text-gray-600">{icon}</span>
        <span className="text-sm font-medium truncate">{value}</span>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">{label}</label>
      <input
        type="text"
        className="w-full bg-black border border-gray-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}