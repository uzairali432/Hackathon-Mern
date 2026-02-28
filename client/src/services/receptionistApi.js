import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const receptionistApi = createApi({
  reducerPath: 'receptionistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerPatient: builder.mutation({
      query: (patientData) => ({
        url: '/receptionists/patients',
        method: 'POST',
        body: patientData,
      }),
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/receptionists/patients/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    bookAppointment: builder.mutation({
      query: (appt) => ({
        url: '/receptionists/appointments',
        method: 'POST',
        body: appt,
      }),
    }),
    getDailySchedule: builder.query({
      query: (date) => ({
        url: `/receptionists/appointments${date ? `?date=${encodeURIComponent(date)}` : ''}`,
        method: 'GET',
      }),
    }),
    updateAppointment: builder.mutation({
      query: ({ appointmentId, ...patch }) => ({
        url: `/receptionists/appointments/${appointmentId}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

export const {
  useRegisterPatientMutation,
  useUpdatePatientMutation,
  useBookAppointmentMutation,
  useGetDailyScheduleQuery,
  useUpdateAppointmentMutation,
} = receptionistApi;
