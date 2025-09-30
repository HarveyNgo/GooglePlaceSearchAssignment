import { createSlice } from '@reduxjs/toolkit';
import { GoogleState } from '../../types/google';

const initialState: GoogleState = {
  history: [],
};

const googleSlice = createSlice({
  name: 'google',
  initialState: initialState,
  reducers: {
    saveHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { saveHistory } = googleSlice.actions;
export default googleSlice.reducer;
