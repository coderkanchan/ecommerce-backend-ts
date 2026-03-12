import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AIState {
  answer: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  answer: null,
  loading: false,
  error: null,
};

export const askNexusAssistant = createAsyncThunk(
  'ai/askAssistant',
  async ({ query, products }: { query: string; products: any[] }) => {
    const optimizedProducts = products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category
    }));

    const response = await axios.post('http://localhost:5000/api/ai/ask-assistant', {
      userQuery: query,
      products: optimizedProducts
    });
    return response.data.answer;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAI: (state) => {
      state.answer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(askNexusAssistant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askNexusAssistant.fulfilled, (state, action) => {
        state.loading = false;
        state.answer = action.payload;
      })
      .addCase(askNexusAssistant.rejected, (state, action) => {
        state.loading = false;
        state.error = "AI assistant is busy, try again!";
      });
  },
});

export const { clearAI } = aiSlice.actions;
export default aiSlice.reducer;