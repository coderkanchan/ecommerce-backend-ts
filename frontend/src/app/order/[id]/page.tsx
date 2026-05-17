"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20">Loading Order Details...</div>;
  if (!order) return <div className="text-white text-center mt-20">Order Not Found</div>;

  // Numbers ko safe parse karne ke liye custom variables
  const safeTotalPrice = Number(order.totalPrice) || 0;
  const safeItemsPrice = safeTotalPrice > 10 ? safeTotalPrice - 10 : safeTotalPrice;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Order ID: {order._id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Section */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-2">Shipping</h2>
            <p><strong>Name:</strong> {order.user?.name || "Customer"}</p>
            <p><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
            <div className={`mt-4 p-3 rounded ${order.isDelivered ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {order.isDelivered ? `Delivered at ${order.deliveredAt}` : "Not Delivered"}
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-2">Payment Method</h2>
            <p><strong>Method:</strong> Razorpay/COD</p>
            <div className={`mt-4 p-3 rounded ${order.isPaid ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              {order.isPaid ? `Paid at ${order.paidAt}` : "Not Paid"}
            </div>
          </div>

          {/* Order Items Section */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            {order.orderItems && order.orderItems.map((item: any, index: number) => {
              const itemQty = Number(item.qty) || 0;
              const itemPrice = Number(item.price) || 0;
              const itemTotal = itemQty * itemPrice;

              return (
                <div key={index} className="flex justify-between items-center border-b border-gray-800 py-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl || "/placeholder.png"} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <span>{item.name}</span>
                  </div>
                  <span>
                    {itemQty} x ${itemPrice.toFixed(2)} = <strong>${itemTotal.toFixed(2)}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Items</span><span>${safeItemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span><span>$10.00</span>
            </div>
            <hr className="border-gray-800 my-2" />
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total</span><span>${safeTotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}