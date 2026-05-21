"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Wallet, History, Loader2, Clock } from 'lucide-react';

export default function EarningsPage() {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    totalDisbursed: 0
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller-stats`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFinancials({
            availableBalance: Number(data.totalRevenue) || 0,
            pendingBalance: Number(data.pendingRevenue) || 0,
            totalDisbursed: 0
          });
        }
      } catch (err) {
        console.error("Error fetching ledger data pools:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchFinancialData();
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-900 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Financial <span className="text-blue-500">Ledger</span></h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Audit liquid balance metrics and transactional payout routes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-blue-500/10 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-900 pb-3">
              <Wallet className="text-blue-500 w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Available Liquid Balance</h2>
            </div>
            <h3 className="text-4xl font-black font-mono text-white tracking-tight">
              ₹{financials.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <button
            disabled={financials.availableBalance === 0}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-md active:scale-95 ${financials.availableBalance > 0
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10 cursor-pointer'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
          >
            Trigger Settlement Wire
          </button>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-900 shadow-xl flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Total Disbursed Capital</h2>
            <p className="text-xl font-bold font-mono text-white">
              ₹{financials.totalDisbursed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="pt-4 border-t border-gray-900">
            <h2 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Downstream Payout Schedule (Escrow Holds)</h2>
            {financials.pendingBalance > 0 ? (
              <div className="flex items-center gap-2 mt-1 text-amber-500">
                <Clock size={14} />
                <p className="text-xs font-bold font-mono">
                  ₹{financials.pendingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} pending delivery confirmation.
                </p>
              </div>
            ) : (
              <p className="text-xs font-semibold text-gray-400 mt-1">No active settlement operations queue bound.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-900 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
          <History className="text-gray-400 w-4 h-4" />
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Real-time Accounting Logs</h2>
        </div>

        {(financials.availableBalance > 0 || financials.pendingBalance > 0) ? (
          <div className="divide-y divide-gray-900 text-xs">
            {financials.availableBalance > 0 && (
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-white font-bold uppercase">Storefront Revenue Accumulation</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Cleared balance from fulfilled nodes</p>
                </div>
                <span className="text-green-400 font-mono font-bold">+₹{financials.availableBalance.toLocaleString('en-IN')}</span>
              </div>
            )}
            {financials.pendingBalance > 0 && (
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-gray-400 font-bold uppercase">Escrow Hold Balance</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Awaiting active logistics fulfillment</p>
                </div>
                <span className="text-amber-500 font-mono font-bold">₹{financials.pendingBalance.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-xs font-medium text-gray-600 uppercase tracking-wide">
            No external ledger vectors found in scope active.
          </div>
        )}
      </div>
    </div>
  );
}