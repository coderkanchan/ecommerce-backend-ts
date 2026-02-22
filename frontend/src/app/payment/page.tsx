// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import ProtectedRoute from '@/components/ProtectedRoute';

// export default function PaymentPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { shippingAddress } = useSelector((state: RootState) => state.cart);

//   useEffect(() => {
//     if (!shippingAddress.address) {
//       router.push('/shipping');
//     }
//   }, [shippingAddress, router]);

//   const [paymentMethod, setPaymentMethod] = useState('PayPal');

//   const submitHandler = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Payment Method Selected:", paymentMethod);
//     router.push('/placeorder');
//   };

//   return (
//     <ProtectedRoute>
//       <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl border border-gray-800">
//         <h1 className="text-3xl font-bold text-white mb-8 text-center">Payment Method</h1>

//         <form onSubmit={submitHandler} className="space-y-6">
//           <div className="space-y-4">

//             <label className="flex items-center p-4 bg-black border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition">
//               <input
//                 type="radio" name="paymentMethod" value="PayPal" checked
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-5 h-5 text-blue-600"
//               />
//               <span className="ml-4 text-white font-medium">PayPal or Credit Card</span>
//             </label>

//             <label className="flex items-center p-4 bg-black border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition">
//               <input
//                 type="radio" name="paymentMethod" value="COD"
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-5 h-5 text-blue-600"
//               />
//               <span className="ml-4 text-white font-medium">Cash on Delivery (COD)</span>
//             </label>
//           </div>

//           <button className="w-full bg-yellow-500 text-black py-4 rounded-full font-bold hover:bg-yellow-600 transition">
//             Continue to Place Order
//           </button>
//         </form>
//       </div>
//     </ProtectedRoute>
//   );
// }


'use client';
import { createRazorpayOrder } from '@/services/api';

const PaymentPage = () => {
  const handlePayment = async () => {

    const data = await createRazorpayOrder(500); 

    if (!data.success) {
      alert("Order creation failed");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: data.order.amount,
      currency: data.order.currency,
      name: "NexusMart",
      description: "Test Transaction",
      order_id: data.order.id,
      handler: function (response: any) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Kanchan Sharma",
        email: "kanchan@example.com",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Final Payment Step</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Pay with Razorpay
      </button>
    </div>
  );
};

export default PaymentPage;