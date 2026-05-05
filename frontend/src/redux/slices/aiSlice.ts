import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AIState {
  answer: any;
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
  async ({ userQuery }: { userQuery: string }) => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')!).token
      : null;

    const response = await fetch(`${API_URL}/api/ai/ask-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ userQuery }), 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
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
        state.error = action.error.message || "AI error";
      });
  },
});

export const { clearAI } = aiSlice.actions;
export default aiSlice.reducer;