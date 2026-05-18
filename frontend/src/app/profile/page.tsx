"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!localUser.token) {
      router.push('/login');
    } else {
      setName(localUser.name || '');
      setEmail(localUser.email || '');
      fetchMyOrders(localUser.token);
    }
  }, [router]);

  const fetchMyOrders = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const localUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localUser.token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setCredentials(data));
        alert("Profile Updated Successfully! ✨");
        setPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const getInitial = () => {
    const targetName = name || userInfo?.name;
    if (targetName && typeof targetName === 'string') {
      return targetName.charAt(0).toUpperCase();
    }
    return '?';
  };
  // ✅ Super Safe getInitial Arrow Function:
  const getInitial = (): string => {
    const targetName = name || (userInfo && userInfo.name);
    if (targetName && typeof targetName === 'string' && targetName.length > 0) {
      return targetName.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <ProtectedRoute>
      <div className="w-full px-3">
        <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10 mt-10'>

          <div className="w-full lg:w-1/3 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">
            {userInfo?.profileImage ? (
              <div className="relative w-32 h-32 mb-4 mx-auto">
                <Image
                  src={userInfo.profileImage}
                  alt={name || "User"}
                  fill
                  priority
                  className="rounded-full object-cover border-4 border-gray-700 shadow-lg"
                />
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center text-6xl font-bold text-white shadow-xl border-4 border-gray-700">
                {getInitial()}
              </div>
            )}
            <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className="w-full bg-blue-600 py-3 rounded-lg font-bold hover:bg-blue-700 transition text-white">
                Update Profile
              </button>
            </form>
          </div>

          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-x-auto w-full">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-800 text-gray-300 uppercase text-sm">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Delivered</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-500">
                        No orders found. Start shopping! 🛍️
                      </td>
                    </tr>
                  ) : (
                    orders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-4 text-sm font-mono text-blue-300">
                          {order._id ? (
                            <Link href={`/order/${order._id}`} className="text-blue-400 hover:underline">
                              #{order._id.substring(14, 24)}
                            </Link>
                          ) : (
                            '---'
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-300">
                          {order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'N/A'}
                        </td>
                        <td className="p-4 font-bold text-white">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="p-4">
                          {order.isPaid ? (
                            <span className="text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Paid</span>
                          ) : (
                            <span className="text-red-400 bg-red-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Unpaid</span>
                          )}
                        </td>
                        <td className="p-4">
                          {order.isDelivered ? (
                            <span className="text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Yes</span>
                          ) : (
                            <span className="text-yellow-400 bg-yellow-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">No</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => order._id && router.push(`/order/${order._id}`)}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium border border-gray-700 transition"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}