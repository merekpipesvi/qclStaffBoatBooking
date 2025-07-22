import { GetUserModel, PatchUserAdminModel } from '@/models/user.model';
import { apiSlice } from './apiSlice';

const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsersForAdmin: builder.query<GetUserModel[], void>({
            query: () => 'users',
            providesTags: () => [{ type: 'AdminUsers' }],
        }),
        patchUserForAdmin: builder.mutation<void, PatchUserAdminModel>({
            query: (user) => ({
              url: `/users/${user.userId}`,
              method: 'PATCH',
              body: user,
            }),
            invalidatesTags: () => [{ type: 'AdminUsers' }],
        }),
        deleteUser: builder.mutation<void, Pick<GetUserModel, 'userId'>>({
            query: ({ userId }) => ({
              url: `/users/${userId}`,
              method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'AdminUsers' }],
        }),
    }),
});

export const {
    useGetUsersForAdminQuery,
    usePatchUserForAdminMutation,
    useDeleteUserMutation,
} = usersApi;
