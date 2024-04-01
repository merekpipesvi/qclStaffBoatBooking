import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Forecast } from '@/models/forecast.model';

export const weatherSlice = createApi({
  reducerPath: 'weather',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.open-meteo.com/v1/' }),
  endpoints: (builder) => ({
    getQCLWeather: builder.query<Record<string, number>, void>({
      query: () => 'forecast?latitude=54.006&longitude=-132.6443&daily=weather_code&timezone=America%2FLos_Angeles',
      transformResponse: ({ daily }: Forecast) => daily.time.reduce(
        (acc: Record<string, number>, dateString, index) => {
            acc[dateString] = daily.weather_code[index];
            return acc;
        },
        {}),
    }),
  }),
});

export const { useGetQCLWeatherQuery } = weatherSlice;
