// "use client";
// import AdminSidebar from '@/components/AdminSidebar';
// import AdminRoute from "@/components/AdminRoute";
// import { useEffect, useState } from 'react';

// export default function AdminDashboard() {

//   const [summary, setSummary] = useState({ totalSales: 0, ordersCount: 0, usersCount: 0 });

//   const fetchSummary = async () => {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//     const res = await fetch('http://localhost:5000/api/orders/summary', {
//       headers: { Authorization: `Bearer ${userInfo.token}` },
//     });
//     const data = await res.json();
//     setSummary(data);
//   };

//   useEffect(() => { fetchSummary(); }, []);

//   return (
//     <AdminRoute>
//       <div className="flex min-h-screen bg-black text-white">
//         <AdminSidebar />
//         <main className="flex-1 p-8">
//           <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//               <p className="text-gray-400 text-sm">Total Sales</p>
//               <h2 className="text-2xl font-bold text-green-400">
//                 ${summary.totalSales.toFixed(2)}
//               </h2>
//             </div>
//             <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//               <p className="text-gray-400 text-sm">Total Orders</p>
//               <h2 className="text-2xl font-bold text-blue-400">{summary.ordersCount}</h2>
//             </div>
//             <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//               <p className="text-gray-400 text-sm">Total Users</p>
//               <h2 className="text-2xl font-bold text-purple-400">{summary.usersCount}</h2>
//             </div>
//           </div>

//           <div className="bg-gray-900 p-12 rounded-2xl border border-gray-800 text-center">
//             <p className="text-gray-500 italic">Charts and Detailed Analytics coming soon...</p>
//           </div>
//         </main>
//       </div>
//     </AdminRoute>
//   );
// }



// "use client";
// import AdminSidebar from '@/components/AdminSidebar';
// import AdminRoute from "@/components/AdminRoute";
// import { useEffect, useState } from 'react';
// // 1. Recharts Imports
// import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// export default function AdminDashboard() {
//   // 2. State mein salesData add kiya
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     ordersCount: 0,
//     usersCount: 0,
//     salesData: []
//   });

//   const fetchSummary = async () => {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//     const res = await fetch('http://localhost:5000/api/orders/summary', {
//       headers: { Authorization: `Bearer ${userInfo.token}` },
//     });
//     const data = await res.json();
//     setSummary(data);
//   };

//   useEffect(() => { fetchSummary(); }, []);

//   return (
//     <AdminRoute>
//       <div className="flex min-h-screen bg-black text-white">
//         <AdminSidebar />
//         <main className="flex-1 p-8">
//           <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//             Admin Dashboard
//           </h1>

//           {/* Stats Cards Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* ... Aapke purane cards (Total Sales, Orders, Users) ... */}
//             <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//               <p className="text-gray-400 text-sm">Total Sales</p>
//               <h2 className="text-2xl font-bold text-green-400">${summary.totalSales.toFixed(2)}</h2>
//             </div>
//             {/* (Baki dono cards yahan rahenge) */}
//           </div>

//           {/* 3. CHART SECTION (Replacement for "Coming soon" text) */}
//           <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
//             <h2 className="text-xl font-bold mb-6 text-blue-400">Sales Analytics</h2>
//             <div className="h-87.5 w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={summary.salesData}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
//                   <XAxis
//                     dataKey="_id"
//                     stroke="#6b7280"
//                     tick={{ fill: '#9ca3af', fontSize: 12 }}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <YAxis
//                     stroke="#6b7280"
//                     tick={{ fill: '#9ca3af', fontSize: 12 }}
//                     tickLine={false}
//                     axisLine={false}
//                     tickFormatter={(value) => `$${value}`}
//                   />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
//                     itemStyle={{ color: '#3b82f6' }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="sales"
//                     stroke="#3b82f6"
//                     strokeWidth={3}
//                     fillOpacity={1}
//                     fill="url(#colorSales)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </main>
//       </div>
//     </AdminRoute>
//   );
// }



"use client";
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from "@/components/AdminRoute";
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminDashboard() {
  // State ko update kiya taaki salesData store ho sake
  const [summary, setSummary] = useState({
    totalSales: 0,
    ordersCount: 0,
    usersCount: 0,
    salesData: [] // Ye empty array hona zaroori hai shuruat mein
  });

  const fetchSummary = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const res = await fetch('http://localhost:5000/api/orders/summary', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();

      // Console log karke check kijiye data aa raha hai ya nahi
      console.log("Dashboard Data:", data);

      setSummary(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white font-sans">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-white">
            Admin <span className="text-blue-500">Dashboard</span>
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Sales</p>
              <h2 className="text-4xl font-bold mt-2 text-white">${summary.totalSales.toFixed(2)}</h2>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Orders</p>
              <h2 className="text-4xl font-bold mt-2 text-white">{summary.ordersCount}</h2>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Users</p>
              <h2 className="text-4xl font-bold mt-2 text-white">{summary.usersCount}</h2>
            </div>
          </div>

          {/* Professional Chart Section */}
          <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Sales Analytics (Revenue Over Time)
            </h2>

            <div className="h-[400px] w-full">
              {summary.salesData && summary.salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis
                      dataKey="_id"
                      stroke="#444"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#444"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '15px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 italic">
                  No sales data available for the chart yet...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}