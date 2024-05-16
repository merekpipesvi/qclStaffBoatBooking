import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.qclstaffboats.com/api/', credentials: 'include' }),
    endpoints: () => ({}), // all paths are within they're respective slice and injected here
    tagTypes: ['UsersForBookingByDate', 'ConfirmationBookings', 'AdminUsers', 'DatesByBoatId', 'HalfDays'],
});
