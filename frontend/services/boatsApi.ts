import { addDays, format } from 'date-fns';
import { GetBoatsUnavailableModel } from '@/models/boatUnavailable.model';
import { apiSlice } from './apiSlice';
import { ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE } from '@/utils/constants';

const boatsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBoatsUnavailable: builder.query<GetBoatsUnavailableModel, void>({
            query: () => ({
                url: 'boats',
                params: {
                    startDate: format(new Date(), ISO_DATE_FORMAT),
                    endDate: format(addDays(new Date(), NUM_DAYS_BOOKABLE), ISO_DATE_FORMAT),
                },
            }),
        }),
    }),
});

export const { useGetBoatsUnavailableQuery } = boatsApi;
