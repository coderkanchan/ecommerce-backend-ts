// "use client";
// import AdminSidebar from '@/components/AdminSidebar';
// import AdminRoute from "@/components/AdminRoute";
// import { useEffect, useState } from 'react';
// import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// export default function AdminDashboard() {
//   const [isClient, setIsClient] = useState(false);
//   const [summary, setSummary] = useState({
//     totalSales: 0,
//     ordersCount: 0,
//     usersCount: 0,
//     salesData: []
//   });

//   useEffect(() => {
//     setIsClient(true);
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       const res = await fetch('http://localhost:5000/api/orders/summary', {
//         headers: { Authorization: `Bearer ${userInfo.token}` },
//       });
//       const data = await res.json();

//       console.log("Dashboard Data:", data);

//       setSummary(data);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   return (
//     <AdminRoute>
//       <div className="flex min-h-screen bg-black text-white">

//         <AdminSidebar />

//         <main className="flex-1 p-8">

//           <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-white">
//             Admin <span className="text-blue-500">Dashboard</span>
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//             <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
//               <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Sales</p>
//               <h2 className="text-4xl font-bold mt-2 text-white">${summary.totalSales.toFixed(2)}</h2>
//             </div>
//             <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
//               <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Orders</p>
//               <h2 className="text-4xl font-bold mt-2 text-white">{summary.ordersCount}</h2>
//             </div>
//             <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
//               <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Users</p>
//               <h2 className="text-4xl font-bold mt-2 text-white">{summary.usersCount}</h2>
//             </div>
//           </div>

//           <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl mt-8">
//             <h2 className="text-xl font-bold mb-8 text-blue-400">
//               Sales Analytics (Revenue Over Time)
//             </h2>

//             <div style={{ width: '100%', height: 400, minHeight: '400px', position: 'relative' }}>

//               {isClient && summary.salesData && summary.salesData.length > 0 ? (
//                 <ResponsiveContainer
//                   key={summary.salesData.length}>

//                   <AreaChart data={summary.salesData} key={`chart-${summary.salesData.length}`}>
//                     <defs>
//                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
//                     <XAxis
//                       dataKey="_id"
//                       stroke="#444"
//                       fontSize={11}
//                       tick={{ fill: '#444' }}
//                       tickMargin={10}
//                     />
//                     <YAxis
//                       stroke="#444"
//                       fontSize={11}
//                       tick={{ fill: '#444' }}
//                       tickFormatter={(value) => `$${value}`}
//                     />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="sales"
//                       stroke="#3b82f6"
//                       strokeWidth={3}
//                       fill="url(#colorSales)"
//                       isAnimationActive={true}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-700 italic">
//                   Initialising Sales Analytics...
//                 </div>
//               )}
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
import { DollarSign, ShoppingBag, Users, ArrowUpRight } from 'lucide-react'; // Icons


const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-[#111] p-6 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all shadow-2xl relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-bold mt-2 text-white">{value}</h2>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`}></div>
  </div>
);

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [summary, setSummary] = useState({
    totalSales: 0,
    ordersCount: 0,
    usersCount: 0,
    salesData: [],
    recentOrders: [] 
  });

  useEffect(() => {
    setIsClient(true);
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const res = await fetch('http://localhost:5000/api/orders/summary', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">

          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <div className="text-sm bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full border border-blue-500/20 font-medium">
              Live Updates Enabled
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Total Revenue" value={`$${summary.totalSales.toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
            <StatCard title="Total Orders" value={summary.ordersCount} icon={ShoppingBag} color="bg-blue-500" />
            <StatCard title="Total Users" value={summary.usersCount} icon={Users} color="bg-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
            <div className="lg:col-span-2 bg-[#111] p-8 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                Sales Analytics <ArrowUpRight size={18} className="text-green-500" />
              </h2>
              <div style={{ width: '100%', height: 350 }}>
                {isClient && summary.salesData?.length > 0 ? (
                  <ResponsiveContainer>
                    <AreaChart data={summary.salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="_id" stroke="#444" fontSize={11} tickMargin={10} />
                      <YAxis stroke="#444" fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }} />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-700 italic">Loading Chart...</div>
                )}
              </div>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
              <div className="space-y-6">
            
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-sm">Order #123{i}</p>
                      <p className="text-xs text-gray-500">2 mins ago</p>
                    </div>
                    <p className="text-sm font-bold text-green-400">+$120.00</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl bg-gray-800 text-xs font-bold hover:bg-gray-700 transition">
                VIEW ALL ORDERS
              </button>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}