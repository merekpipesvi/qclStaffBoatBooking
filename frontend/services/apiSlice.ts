import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetUserModel, PostLogInModel, PostUserModel } from '@/models/user.model';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/' }),
    endpoints: (builder) => ({
        register: builder.mutation<GetUserModel, PostUserModel>({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation<GetUserModel, PostLogInModel>({
            query: (loginData) => ({
                url: 'login',
                method: 'POST',
                body: loginData,
            }),
        }),
        me: builder.query<GetUserModel, void>({
            query: () => 'me',
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery } = apiSlice;
