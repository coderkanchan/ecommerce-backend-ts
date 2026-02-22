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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const createRazorpayOrder = async (amount: number) => {
  const response = await fetch(`${API_URL}/api/payment/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export default API;