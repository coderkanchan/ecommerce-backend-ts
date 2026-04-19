import Link from 'next/link';
import { logout } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Package, ShoppingBag, TrendingUp, LogOut } from 'lucide-react';

export default function SideBar() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (

    <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 hidden lg:flex flex-col p-6">
      <div className="text-2xl font-black tracking-tighter text-blue-500 mb-10">
        NEXUS<span className="text-white">MART</span>
      </div>
      <nav className="space-y-4">
        <Link href="/seller/dashboard" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-500 rounded-xl font-bold">
          <TrendingUp size={20} /> Dashboard
        </Link>
        <Link href="/seller/products" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-900 rounded-xl transition">
          <Package size={20} /> My Products
        </Link>
        <Link href="/seller/orders" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-900 rounded-xl transition">
          <ShoppingBag size={20} /> Orders
        </Link>
      </nav>
      <div className="mt-auto border-t border-gray-800 pt-6">
        <div className="flex items-center gap-3 px-2 py-3 bg-[#111] rounded-2xl border border-gray-800 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">{userInfo?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified Seller</p>
          </div>
        </div>

        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>

  )
}
