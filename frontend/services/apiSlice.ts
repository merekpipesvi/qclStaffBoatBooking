import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Set NEXT_PUBLIC_API_URL in Vercel (e.g. https://<your-backend>.up.railway.app/api/).
// Falls back to the local backend for development.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8800/api/';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
    endpoints: () => ({}), // all paths are within they're respective slice and injected here
    tagTypes: ['UsersForBookingByDate', 'ConfirmationBookings', 'AdminUsers', 'DatesByBoatId', 'HalfDays'],
});
