import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const response = await fetch(`${API_URL}/api/products/all`);

  if (!response.ok) throw new Error('Failed to fetch products');

  const data = await response.json();
  console.log("DB Products:", data.products);
  console.log("Products loaded into Redux:", data.products);

  return data.products;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default productSlice.reducer;