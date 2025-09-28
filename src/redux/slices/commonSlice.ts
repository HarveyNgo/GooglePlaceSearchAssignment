import {createSlice} from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'common',
  initialState: {error: false, errorMessage: ''},
  reducers: {
    setError: (state, action) => {
      state.error = true;
      state.errorMessage = action.payload;
    },
    clearError: state => {
      state.error = false;
      state.errorMessage = '';
    },
  },
});

export const {setError, clearError} = commonSlice.actions;
export default commonSlice.reducer;
