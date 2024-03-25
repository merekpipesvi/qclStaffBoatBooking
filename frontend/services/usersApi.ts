import { GetUserModel } from '@/models/user.model';
import { apiSlice } from './apiSlice';

const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<GetUserModel[], void>({
            query: () => 'users',
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;
