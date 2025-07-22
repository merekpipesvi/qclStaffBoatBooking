import { GetUserModel, PostLogInModel, PostUserModel } from '@/models/user.model';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<GetUserModel, PostUserModel>({
            query: (userData) => ({
                url: 'auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation<GetUserModel, PostLogInModel>({
            query: (loginData) => ({
                url: 'auth/login',
                method: 'POST',
                body: loginData,
            }),
        }),
        getMe: builder.query<GetUserModel, void>({
            query: () => 'auth/me',
        }),
        extendSession: builder.query<string, void>({
            query: () => 'auth/extend',
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetMeQuery,
    useExtendSessionQuery,
} = authApi;
