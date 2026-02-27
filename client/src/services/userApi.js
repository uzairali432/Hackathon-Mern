import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const userApi = createApi({
  reducerPath: 'userApi',
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
    getUserById: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
      }),
    }),
    getAllUsers: builder.query({
      query: ({ limit = 10, skip = 0, role } = {}) => {
        let url = `/users?limit=${limit}&skip=${skip}`;
        if (role) url += `&role=${role}`;
        return url;
      },
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/users/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
    }),
    deactivateAccount: builder.mutation({
      query: () => ({
        url: '/users/deactivate',
        method: 'POST',
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateUserRoleMutation,
  useDeactivateAccountMutation,
  useDeleteUserMutation,
} = userApi;
