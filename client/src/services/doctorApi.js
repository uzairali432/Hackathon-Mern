import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Appointments
    getDoctorAppointments: builder.query({
      query: ({ status } = {}) => {
        let url = '/doctors/appointments';
        if (status) url += `?status=${status}`;
        return url;
      },
    }),

    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: `/doctors/appointments/${appointmentId}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),

    // Patient History & Prescriptions
    getPatientHistory: builder.query({
      query: (patientId) => `/doctors/patient/${patientId}/history`,
    }),

    getPatientPrescriptions: builder.query({
      query: (patientId) => `/doctors/patient/${patientId}/prescriptions`,
    }),

    // Diagnosis & Prescriptions
    addDiagnosis: builder.mutation({
      query: (diagnosisData) => ({
        url: '/doctors/diagnosis',
        method: 'POST',
        body: diagnosisData,
      }),
    }),

    writePrescription: builder.mutation({
      query: (prescriptionData) => ({
        url: '/doctors/prescription',
        method: 'POST',
        body: prescriptionData,
      }),
    }),

    // AI Assistance
    getAIAssistance: builder.query({
      query: ({ symptoms, patientAge, patientGender }) => ({
        url: '/doctors/ai-assistance',
        method: 'POST',
        body: { symptoms, patientAge, patientGender },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('AI Assistance Error:', error);
        }
      },
    }),

    // Statistics
    getDoctorStats: builder.query({
      query: () => '/doctors/stats',
    }),
  }),
});

export const {
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useGetPatientHistoryQuery,
  useGetPatientPrescriptionsQuery,
  useAddDiagnosisMutation,
  useWritePrescriptionMutation,
  useGetAIAssistanceQuery,
  useGetDoctorStatsQuery,
} = doctorApi;
