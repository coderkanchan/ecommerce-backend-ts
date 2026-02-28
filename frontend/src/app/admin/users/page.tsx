"use client";
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 uppercase text-sm font-semibold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Admin Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-800/50 transition duration-200">
                    <td className="p-4 text-sm font-mono text-blue-400">{user._id.substring(0, 10)}...</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      {user.isAdmin ? (
                        <span className="text-green-400 bg-green-900/30 px-3 py-1 rounded-full text-xs border border-green-800">Admin</span>
                      ) : (
                        <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}