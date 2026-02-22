import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  const response = await API.get('/products/all');
  return response.data;
};

export const createRazorpayOrder = async (amount: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return response.json();
};

export default API;