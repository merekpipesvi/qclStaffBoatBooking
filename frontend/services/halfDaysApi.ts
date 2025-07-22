import { apiSlice } from './apiSlice';
import { GetHalfDaysArg, GetHalfDaysModel, SetDaysArg } from '@/models/halfDays.model';

const halfDaysApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHalfDays: builder.query<GetHalfDaysModel, GetHalfDaysArg>({
            query: ({ endDate }) => `halfDays/range/${endDate}`,
        }),
        getFutureHalfDays: builder.query<GetHalfDaysModel, void>({
            query: () => 'halfDays/future',
            providesTags: () => [{ type: 'HalfDays' }],
        }),
        setHalfDays: builder.mutation<GetHalfDaysModel, SetDaysArg>({
            query: (body) => ({
                url: 'halfDays/setHalfDays',
                method: 'POST',
                body,
            }),
            invalidatesTags: () => [{ type: 'HalfDays' }],
        }),
        setFullDays: builder.mutation<GetHalfDaysModel, SetDaysArg>({
            query: (body) => ({
                url: 'halfDays/setFullDays',
                method: 'POST',
                body,
            }),
            invalidatesTags: () => [{ type: 'HalfDays' }],
        }),
    }),
});

export const {
    useGetHalfDaysQuery,
    useGetFutureHalfDaysQuery,
    useSetFullDaysMutation,
    useSetHalfDaysMutation,
} = halfDaysApi;
