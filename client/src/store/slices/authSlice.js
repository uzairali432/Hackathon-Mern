import { createSlice } from '@reduxjs/toolkit';

const sanitizeStoredToken = (value) => {
  if (!value) return null;
  if (value === 'undefined' || value === 'null') return null;
  return value;
};

const getStoredAccessToken = () => sanitizeStoredToken(localStorage.getItem('accessToken'));
const getStoredRefreshToken = () => sanitizeStoredToken(localStorage.getItem('refreshToken'));

const initialState = {
  user: null,
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: Boolean(getStoredAccessToken()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = sanitizeStoredToken(action.payload.accessToken);
      state.refreshToken = sanitizeStoredToken(action.payload.refreshToken);
      state.isAuthenticated = true;
      if (state.accessToken) {
        localStorage.setItem('accessToken', state.accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }

      if (state.refreshToken) {
        localStorage.setItem('refreshToken', state.refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setAccessToken: (state, action) => {
      state.accessToken = sanitizeStoredToken(action.payload);
      if (state.accessToken) {
        localStorage.setItem('accessToken', state.accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setAccessToken,
  clearError,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
