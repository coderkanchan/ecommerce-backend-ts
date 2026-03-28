import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
  async ({ userQuery, products }: { userQuery: string; products: any[] }) => {

    const optimizedProducts = products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const response = await fetch(`${API_URL}/api/ai/ask-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userQuery,
        products: optimizedProducts
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.answer;
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