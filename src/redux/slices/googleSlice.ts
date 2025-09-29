import { createSlice } from '@reduxjs/toolkit';

const googleSlice = createSlice({
  name: 'google',
  initialState: {
    history: [],
  },
  reducers: {
    saveHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { saveHistory } = googleSlice.actions;
export default googleSlice.reducer;
