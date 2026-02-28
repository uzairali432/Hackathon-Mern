import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const patientApi = createApi({
  reducerPath: 'patientApi',
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
    // Get patient appointments
    getPatientAppointments: builder.query({
      query: ({ status } = {}) => {
        let url = '/patients/appointments';
        if (status) url += `?status=${status}`;
        return url;
      },
    }),

    // Get patient prescriptions
    getPatientPrescriptions: builder.query({
      query: ({ status } = {}) => {
        let url = '/patients/prescriptions';
        if (status) url += `?status=${status}`;
        return url;
      },
    }),

    // Get single prescription
    getPrescriptionById: builder.query({
      query: (prescriptionId) => `/patients/prescriptions/${prescriptionId}`,
    }),

    // Download prescription PDF
    downloadPrescriptionPDF: builder.query({
      query: (prescriptionId) => ({
        url: `/patients/prescriptions/${prescriptionId}/pdf`,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error('Failed to download PDF');
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `prescription-${prescriptionId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { data: 'Downloaded' };
        },
      }),
    }),

    // Get AI-generated explanation for prescription
    getPrescriptionExplanation: builder.query({
      query: ({ prescriptionId, language = 'english' }) => 
        `/patients/prescriptions/${prescriptionId}/explanation?language=${language}`,
    }),
  }),
});

export const {
  useGetPatientAppointmentsQuery,
  useGetPatientPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useLazyDownloadPrescriptionPDFQuery,
  useGetPrescriptionExplanationQuery,
} = patientApi;

