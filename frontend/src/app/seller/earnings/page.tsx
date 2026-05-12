import { Wallet, ArrowDownCircle, History } from 'lucide-react';

const EarningsPage = () => {
  return (
    <div className=" bg-black h-full text-white">
      <h1 className="text-3xl font-bold mb-8 italic">MY <span className="text-blue-600">EARNINGS</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
       
        <div className="bg-linear-to-br from-blue-900/40 to-black p-8 rounded-3xl border border-blue-500/30">
          <div className="flex items-center gap-4 mb-6">
            <Wallet className="text-blue-500 w-8 h-8" />
            <h2 className="text-xl font-semibold">Available Balance</h2>
          </div>
          <h3 className="text-5xl font-black mb-8">₹0.00</h3>
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all">
            Withdraw to Bank
          </button>
        </div>

        <div className="bg-[#111] p-8 rounded-3xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h2 className="text-gray-400 mb-2">Total Paid Out</h2>
            <p className="text-3xl font-bold">₹0.00</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h2 className="text-gray-400 mb-2">Next Payout Date</h2>
            <p className="text-xl font-medium">No pending payouts</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <History className="text-gray-400" />
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <div className="text-center py-12 text-gray-500 italic">
          No transactions found.
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;