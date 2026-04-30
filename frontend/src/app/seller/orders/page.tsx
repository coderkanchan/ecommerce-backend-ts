export default function SellerOrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">
        Sales Orders
      </h1>
      <p className="text-gray-400 mb-8">Manage and track your customer orders here.</p>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-6 py-4 font-mono text-sm">#ORD12345</td>
              <td className="px-6 py-4">Air conditioners</td>
              <td className="px-6 py-4">John Doe</td>
              <td className="px-6 py-4 text-blue-400">₹35000</td>
              <td className="px-6 py-4">
                <span className="bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded-full text-xs">
                  Processing
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="py-20 text-center text-gray-500">
          No orders received yet.
        </div>
      </div>
    </div>
  );
}