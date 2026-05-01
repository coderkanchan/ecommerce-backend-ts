import axios from 'axios';

const API = axios.create({
  baseURL: '/api', 
  withCredentials: true, 
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Error parsing userInfo from localStorage", err);
      }
    }
  }
  return config;
});

export const fetchProducts = async () => {
  const response = await API.get('/products/all');
  return response.data;
};

export const createRazorpayOrder = async (amount: number) => {
  const response = await API.post('/payment/order', { amount });
  return response.data;
};

export default API;