import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export const fetchProducts = async () => {
  const response = await API.get('/products/all');
  return response.data;
};


export default API;