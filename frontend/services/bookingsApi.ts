import { GetUserForBookingModel } from '@/models/user.model';
import { apiSlice } from './apiSlice';
import { ConfirmBookingModel, GetBookingModel, GetUsersForBookingArg, PostBookingModel, PostPriorityBookingModel } from '@/models/booking.model';

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
      postPriorityBooking: builder.mutation<boolean, PostPriorityBookingModel>({
        query: (body) => ({
            url: 'bookings/priority',
            method: 'POST',
            body,
        }),
        invalidatesTags: (_res, _err, { date }) => [{ type: 'UsersForBookingByDate', id: date }],
      }),
      deletePriorityBooking: builder.mutation<boolean, PostPriorityBookingModel>({
        query: (body) => ({
            url: 'bookings/priority',
            method: 'DELETE',
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
      getMyBookingsNeedingConfirmation:
        builder.query<GetBookingModel[], void>({
        query: () => ({
          url: 'bookings/confirmation',
        }),
        // This doesn't need an id, it will only ever call for today and can get a max of 2 different types (for half day)
        providesTags: () => [{ type: 'ConfirmationBookings' }],
      }),
      confirmMyBooking: builder.mutation<boolean, ConfirmBookingModel>({
        query: (body) => ({
            url: 'bookings/confirmation/confirm',
            method: 'POST',
            body,
        }),
        invalidatesTags: () => [{ type: 'ConfirmationBookings' }],
      }),
      unconfirmMyBooking: builder.mutation<boolean, ConfirmBookingModel>({
        query: (body) => ({
            url: 'bookings/confirmation/unconfirm',
            method: 'POST',
            body,
        }),
        invalidatesTags: () => [{ type: 'ConfirmationBookings' }],
      }),
    }),
  });

  export const {
    useGetUsersForBookingQuery,
    usePostMyBookingMutation,
    useDeleteMyBookingMutation,
    useGetMyBookingsNeedingConfirmationQuery,
    useConfirmMyBookingMutation,
    useUnconfirmMyBookingMutation,
    usePostPriorityBookingMutation,
    useDeletePriorityBookingMutation,
  } = bookingsApi;
