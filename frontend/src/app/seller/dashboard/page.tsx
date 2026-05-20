"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  DollarSign,
  Package,
  ShoppingBag,
  PlusCircle,
  Users,
  Loader2,
  AlertCircle,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface InsightMessage {
  text: string;
  type: 'info' | 'warning' | 'success';
  actionLabel?: string;
  actionHref?: string;
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-gray-900 hover:border-gray-800 transition-all shadow-2xl relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-black font-mono mt-2 text-white tracking-tight">{value}</h2>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 border border-gray-800`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-5 ${color}`}></div>
  </div>
);

export default function SellerDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [summary, setSummary] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0,
    customersCount: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<InsightMessage>({
    text: "Analyzing your marketplace footprints...",
    type: 'info'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller-summary`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSummary(data);

          if (data.productsCount === 0) {
            setInsight({
              text: "Your digital storefront is empty. Add your initial inventory grid to launch visibility.",
              type: 'warning',
              actionLabel: 'Deploy Product',
              actionHref: '/seller/add-product'
            });
          } else if (data.pendingOrdersCount > 0) {
            setInsight({
              text: `Management alert: You have ${data.pendingOrdersCount} active order(s) pending processing vectors.`,
              type: 'warning',
              actionLabel: 'Process Queue',
              actionHref: '/seller/orders' 
            });
          } else if (data.lowStockCount > 0) {
            setInsight({
              text: `Critical stock alert: ${data.lowStockCount} item SKU(s) falling below optimal threshold levels.`,
              type: 'info',
              actionLabel: 'Refill Stock',
              actionHref: '/seller/products'
            });
          } else {
            setInsight({
              text: `Your backend system ecosystem is perfectly optimized with ${data.productsCount} live SKU(s). Monitoring incoming global transactions.`,
              type: 'success'
            });
          }
        }
      } catch (err) {
        console.error("Error fetching seller stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.role === 'seller') {
      fetchStats();
    } else {
      router.push('/');
    }
  }, [userInfo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-10">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-900 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
            SELLER <span className="text-blue-500">CENTRAL</span>
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-2">
            Welcome back, <span className="text-gray-300">{userInfo?.name}</span> • Systems operational
          </p>
        </div>
        <Link
          href="/seller/add-product"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
        >
          <PlusCircle size={18} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Revenue" value={`₹${Number(summary.totalSales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={summary.ordersCount || 0} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Active Products" value={summary.productsCount || 0} icon={Package} color="bg-purple-500" />
        <StatCard title="Target Customers" value={summary.customersCount || 0} icon={Users} color="bg-orange-500" />
      </div>

      {summary.productsCount === 0 ? (
        <div className="bg-[#050505] border border-gray-900 rounded-4xl p-10 md:p-20 text-center space-y-6">
          <div className="w-14 h-14 bg-gray-900/60 border border-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-500">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">No Products Synchronized</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-xs font-medium tracking-tight">
              Ready to scale your enterprise marketplace? Inject your initial digital catalog assets into NexusMart ecosystem matrices.
            </p>
          </div>
          <Link href="/seller/add-product" className="inline-flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
            Start selling today <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : (
        <div className={`p-6 rounded-4xl border transition-all duration-300 ${insight.type === 'warning' ? 'bg-amber-950/10 border-amber-900/40 text-amber-200' :
            insight.type === 'success' ? 'bg-emerald-950/5 border-emerald-900/30 text-emerald-400' :
              'bg-[#0a0a0a] border-gray-900 text-gray-400'
          }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {insight.type === 'warning' && <AlertTriangle size={14} className="text-amber-500" />}
                {insight.type === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                {insight.type === 'info' && <Sparkles size={14} className="text-blue-500" />}
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                  Marketplace Insights Vector
                </label>
              </div>
              <p className="text-sm font-semibold tracking-tight leading-relaxed">{insight.text}</p>
            </div>

            {insight.actionLabel && insight.actionHref && (
              <Link
                href={insight.actionHref}
                className="inline-flex items-center justify-center text-[11px] font-black uppercase tracking-wider bg-white text-black hover:bg-gray-200 px-5 py-3 rounded-xl shrink-0 transition-colors shadow-sm"
              >
                {insight.actionLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}