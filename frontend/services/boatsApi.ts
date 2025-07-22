import { addDays, format } from 'date-fns';
import { ChangeBoatsUnavailableModel, GetBoatsUnavailableModel, GetDatesUnavailableByBoatApiArg, GetDatesUnavailableByBoatModel } from '@/models/boatUnavailable.model';
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
        deleteBoatUnavailable: builder.mutation<boolean, ChangeBoatsUnavailableModel>({
            query: ({ boatId, dates }) => ({
              url: `boats/${boatId}`,
              method: 'DELETE',
              body: { dates },
            }),
            invalidatesTags: (_res, _req, { boatId }) => [{ type: 'DatesByBoatId', id: boatId }],
        }),
        createBoatUnavailable: builder.mutation<boolean, ChangeBoatsUnavailableModel>({
            query: ({ boatId, dates }) => ({
              url: `boats/${boatId}`,
              method: 'PUT',
              body: { dates },
            }),
            invalidatesTags: (_res, _req, { boatId }) => [{ type: 'DatesByBoatId', id: boatId }],
        }),
        getDatesUnavailableByBoat:
          builder.query<GetDatesUnavailableByBoatModel, GetDatesUnavailableByBoatApiArg>({
            query: ({ boatId }) => ({
                url: `boats/${boatId}`,
            }),
            providesTags: (_res, _req, { boatId }) => [{ type: 'DatesByBoatId', id: boatId }],
        }),
    }),
});

export const {
    useGetBoatsUnavailableQuery,
    useDeleteBoatUnavailableMutation,
    useCreateBoatUnavailableMutation,
    useGetDatesUnavailableByBoatQuery,
} = boatsApi;
