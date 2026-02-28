import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import { authApi } from '../services/authApi';
import { userApi } from '../services/userApi';
import { doctorApi } from '../services/doctorApi';
import { receptionistApi } from '../services/receptionistApi';
import { patientApi } from '../services/patientApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [receptionistApi.reducerPath]: receptionistApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, doctorApi.middleware, receptionistApi.middleware, patientApi.middleware),
});

export default store;
