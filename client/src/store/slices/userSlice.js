import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.users;
      state.total = action.payload.total;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
  },
});

export const {
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  clearError,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
