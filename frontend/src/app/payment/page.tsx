// 'use client';
// import { createRazorpayOrder } from '@/services/api';

// const PaymentPage = () => {
//   const handlePayment = async () => {

//     const data = await createRazorpayOrder(500); 

//     if (!data.success) {
//       alert("Order creation failed");
//       return;
//     }

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
//       amount: data.order.amount,
//       currency: data.order.currency,
//       name: "NexusMart",
//       description: "Test Transaction",
//       order_id: data.order.id,
//       handler: function (response: any) {
//         alert("Payment Successful! ID: " + response.razorpay_payment_id);
//       },
//       prefill: {
//         name: "Kanchan Sharma",
//         email: "kanchan@example.com",
//       },
//       theme: { color: "#3399cc" },
//     };

//     const rzp = new (window as any).Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-bold mb-4">Final Payment Step</h1>
//       <button
//         onClick={handlePayment}
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//       >
//         Pay with Razorpay
//       </button>
//     </div>
//   );
// };

// export default PaymentPage;