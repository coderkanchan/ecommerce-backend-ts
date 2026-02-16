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


export default API;