"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      router.push('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders(userInfo.token);
    }
  }, []);

  const fetchMyOrders = async (token: string) => {
    try {                    
      const res = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
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
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
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

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6 text-white grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">

          <h2 className="text-2xl font-bold mb-6">User Profile</h2>

          <form onSubmit={submitHandler} className="space-y-4">

            <div>
              <label className="block text-gray-400 mb-1">Name</label>

              <input
                type="text"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>

            <div>
              <label className="block text-gray-400 mb-1">Email</label>

              <input
                type="email"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            <div>
              <label className="block text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep same"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="w-full bg-blue-600 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Update Profile
            </button>

          </form>

        </div>

        <div className="lg:col-span-3">

          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">

            <table className="w-full text-left">

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

                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4 text-sm">{order._id.substring(0, 10)}...</td>
                    <td className="p-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-4 font-bold">${order.totalPrice}</td>

                    <td className="p-4">

                      {order.isPaid ? (
                        <span className="text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-xs">Paid</span>
                      ) : (
                        <span className="text-red-400 bg-red-900/20 px-3 py-1 rounded-full text-xs">Not Paid</span>
                      )}
                    </td>

                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-xs">Yes</span>
                      ) : (
                        <span className="text-red-400 bg-red-900/20 px-3 py-1 rounded-full text-xs">No</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => router.push(`/order/${order._id}`)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-lg text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}