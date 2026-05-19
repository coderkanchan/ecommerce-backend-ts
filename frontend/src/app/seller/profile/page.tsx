"use client";
import { useState, useEffect } from 'react';
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
      const { data } = await API.put('/users/profile/store', storeData);
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
    <div className="space-y-8">

      <div className="border-b border-gray-900 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
          Seller <span className="text-blue-500">Identity</span>
        </h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage and edit store identities and structural configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 text-center space-y-6">
          <div>
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-500/10 border border-blue-400/20">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-white mt-4 uppercase tracking-tight truncate">
              {userInfo?.name}
            </h2>
            <p className="text-blue-500 text-[9px] font-black uppercase tracking-widest mt-1">
              Verified Platform Seller
            </p>
          </div>

          <div className="pt-5 border-t border-gray-900 text-left space-y-3">
            <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Status Node: Active</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
              <Calendar size={14} className="text-blue-500" />
              <span>Node Bound: Est. 2026</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2 border-b border-gray-900 pb-3">
              <User size={14} className="text-blue-500" /> Account Contexts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox
                label="Full Identity Name"
                value={userInfo?.name}
                icon={<User size={14} />}
              />
              <InfoBox
                label="Network Route Email"
                value={userInfo?.email}
                icon={<Mail size={14} />}
              />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2 border-b border-gray-900 pb-3">
              <Building size={14} className="text-blue-500" /> Storefront Manifest
            </h3>
            <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-gray-950">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-blue-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-white font-bold block truncate">
                    {userInfo?.storeDetails?.storeName || 'Store Context Unset'}
                  </span>
                  <span className="text-xs text-gray-500 block truncate">
                    {userInfo?.storeDetails?.address?.city || 'Geoloc Matrix Missing'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-black text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 px-3 py-1.5 rounded-lg uppercase tracking-wider transition duration-200 shrink-0 cursor-pointer"
              >
                {userInfo?.storeDetails?.storeName ? 'Modify' : 'Initialize'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-gray-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-6">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer">
              <X size={18} />
            </button>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight italic">
                Configure <span className="text-blue-500 font-black">Storefront</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">Bind your commercial variables parameters securely</p>
            </div>

            <form onSubmit={handleUpdateStore} className="space-y-4">
              <InputGroup
                label="Store Name String"
                value={storeData.storeName}
                onChange={(val: string) => setStoreData({ ...storeData, storeName: val })}
                placeholder="Nexus Hardware Matrix"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Business Dial Route"
                  value={storeData.phone}
                  onChange={(val: string) => setStoreData({ ...storeData, phone: val })}
                  placeholder="+91..."
                />
                <InputGroup
                  label="City Center"
                  value={storeData.city}
                  onChange={(val: string) => setStoreData({ ...storeData, city: val })}
                  placeholder="Matrix Center"
                />
              </div>
              <InputGroup
                label="Street Area Pointer"
                value={storeData.street}
                onChange={(val: string) => setStoreData({ ...storeData, street: val })}
                placeholder="Zone Vector 12"
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 border border-gray-900 rounded-xl font-bold text-xs uppercase text-gray-400 hover:bg-gray-900 transition tracking-wider cursor-pointer"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xs uppercase text-white transition tracking-wider shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  Commit Changes
                </button>
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
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">{label}</label>
      <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-gray-900 min-w-0">
        <span className="text-gray-600 shrink-0">{icon}</span>
        <span className="text-xs font-semibold text-gray-300 truncate">{value || 'Unmapped'}</span>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">{label}</label>
      <input
        type="text"
        className="w-full bg-black border border-gray-900 focus:border-blue-500/50 rounded-xl p-3 text-xs text-white outline-none transition-all placeholder:text-gray-800 font-medium"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}