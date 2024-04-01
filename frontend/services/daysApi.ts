import { apiSlice } from './apiSlice';
import { GetDaysModel } from '@/models/days.model';

const daysApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDays: builder.query<GetDaysModel[], void>({
            query: () => 'days',
        }),
    }),
});

export const { useGetDaysQuery } = daysApi;
