"use client";
import AdminSidebar from '@/components/AdminSidebar';
import AdminRoute from "@/components/AdminRoute";
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminDashboard() {
  // const [isClient, setIsClient] = useState(false);
  // const [summary, setSummary] = useState({
  //   totalSales: 0,
  //   ordersCount: 0,
  //   usersCount: 0,
  //   salesData: []
  // });

  const [isClient, setIsClient] = useState(false);
  const [summary, setSummary] = useState({
    totalSales: 0,
    ordersCount: 0,
    usersCount: 0,
    salesData: []
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

      console.log("Dashboard Data:", data);

      setSummary(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  //useEffect(() => { fetchSummary(); }, []);


  return (
    // <AdminRoute>
    //   <div className="flex min-h-screen bg-black text-white font-sans">
    //     <AdminSidebar />
    //     <main className="flex-1 p-8 overflow-y-auto">
    // <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-white">
    //   Admin <span className="text-blue-500">Dashboard</span>
    // </h1>

    // <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    //   <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
    //     <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Sales</p>
    //     <h2 className="text-4xl font-bold mt-2 text-white">${summary.totalSales.toFixed(2)}</h2>
    //   </div>
    //   <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
    //     <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Orders</p>
    //     <h2 className="text-4xl font-bold mt-2 text-white">{summary.ordersCount}</h2>
    //   </div>
    //   <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl">
    //     <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Total Users</p>
    //     <h2 className="text-4xl font-bold mt-2 text-white">{summary.usersCount}</h2>
    //   </div>
    //       </div>

    //       {/* <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl mt-8">
    //         <h2 className="text-xl font-bold mb-8 text-blue-400">
    //           Sales Analytics (Revenue Over Time)
    //         </h2>

    //         <div style={{ width: '100%', height: 400 }}>
    //           {isClient && (
    //             <ResponsiveContainer>
    //               <AreaChart data={summary.salesData}>
    //                 <defs>
    //                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
    //                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
    //                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
    //                   </linearGradient>
    //                 </defs>
    //                 <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
    //                 <XAxis dataKey="_id" stroke="#444" fontSize={12} />
    //                 <YAxis stroke="#444" fontSize={12} />
    //                 <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
    //                 <Area
    //                   type="monotone"
    //                   dataKey="sales"
    //                   stroke="#3b82f6"
    //                   strokeWidth={4}
    //                   fill="url(#colorSales)"
    //                 />
    //               </AreaChart>
    //             </ResponsiveContainer>
    //           )}
    //         </div>
    //       </div> */}

    //       <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl mt-8">
    //         <h2 className="text-xl font-bold mb-8 text-blue-400">
    //           Sales Analytics (Revenue Over Time)
    //         </h2>

    //         {/* Container with fixed aspect ratio/height */}
    //         <div style={{ width: '100%', height: 400, minHeight: '400px' }}>
    //           {isClient && summary.salesData && summary.salesData.length > 0 ? (
    //             <ResponsiveContainer width="99%" height="100%" key={summary.salesData.length}>
    //               <AreaChart
    //                 data={summary.salesData}
    //                 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    //               >
    //                 <defs>
    //                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
    //                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
    //                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
    //                   </linearGradient>
    //                 </defs>
    //                 <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
    //                 <XAxis
    //                   dataKey="_id"
    //                   stroke="#444"
    //                   fontSize={12}
    //                   tick={{ fill: '#444' }}
    //                 />
    //                 <YAxis
    //                   stroke="#444"
    //                   fontSize={12}
    //                   tick={{ fill: '#444' }}
    //                   tickFormatter={(value) => `$${value}`}
    //                 />
    //                 <Tooltip
    //                   contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }}
    //                 />
    //                 <Area
    //                   type="monotone"
    //                   dataKey="sales"
    //                   stroke="#3b82f6"
    //                   strokeWidth={4}
    //                   fill="url(#colorSales)"
    //                   animationBegin={0}
    //                   animationDuration={1500}
    //                 />
    //               </AreaChart>
    //             </ResponsiveContainer>
    //           ) : (
    //             <div className="flex items-center justify-center h-full text-gray-600">
    //               {summary.salesData.length === 0 ? "No sales data found for chart" : "Loading chart..."}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </AdminRoute>

    <AdminRoute>
      <div className="flex min-h-screen bg-black text-white">

        <AdminSidebar />

        <main className="flex-1 p-8">

          <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-white">
            Admin <span className="text-blue-500">Dashboard</span>
          </h1>

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

          <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 shadow-2xl mt-8">
            <h2 className="text-xl font-bold mb-8 text-blue-400">
              Sales Analytics (Revenue Over Time)
            </h2>

            <div style={{ width: '100%', height: 400, minHeight: '400px', position: 'relative' }}>

              {isClient && summary.salesData && summary.salesData.length > 0 ? (
                <ResponsiveContainer
                  key={summary.salesData.length}>

                  <AreaChart data={summary.salesData} key={`chart-${summary.salesData.length}`}>
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
                      fontSize={11}
                      tick={{ fill: '#444' }}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#444"
                      fontSize={11}
                      tick={{ fill: '#444' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorSales)"
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700 italic">
                  Initialising Sales Analytics...
                </div>
              )}
            </div>
          </div>

        </main>

      </div>
    </AdminRoute>
  );
}
