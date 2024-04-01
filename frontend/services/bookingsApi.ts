import { GetUserForBookingModel } from '@/models/user.model';
import { apiSlice } from './apiSlice';
import { GetUsersForBookingArg, PostBookingModel } from '@/models/booking.model';

const bookingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getUsersForBooking:
        builder.query<GetUserForBookingModel[], GetUsersForBookingArg>({
            query: ({ date, isMorningBooking }) => ({
              url: 'bookings',
              params: {
                  date,
                  isMorningBooking: isMorningBooking ?? null,
              },
            }),
            providesTags: (_res, _err, { date }) => [{ type: 'UsersForBookingByDate', id: date }],
      }),
      postMyBooking: builder.mutation<boolean, PostBookingModel>({
        query: (body) => ({
            url: 'bookings',
            method: 'POST',
            body,
        }),
        invalidatesTags: (_res, _err, { date }) => [{ type: 'UsersForBookingByDate', id: date }],
      }),
      deleteMyBooking: builder.mutation<boolean, PostBookingModel>({
        query: (body) => ({
            url: 'bookings',
            method: 'DELETE',
            body,
        }),
        invalidatesTags: (_res, _err, { date }) => [{ type: 'UsersForBookingByDate', id: date }],
      }),
    }),
  });

  export const {
    useGetUsersForBookingQuery,
    usePostMyBookingMutation,
    useDeleteMyBookingMutation,
  } = bookingsApi;
