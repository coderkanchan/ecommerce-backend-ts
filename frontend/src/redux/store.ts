import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import aiReducer from './slices/aiSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    ai: aiReducer,
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;