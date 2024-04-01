import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/services/apiSlice';
import { weatherSlice } from '@/services/weatherApiSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [weatherSlice.reducerPath]: weatherSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware, weatherSlice.middleware),
});

export type AppStore = ReturnType<typeof store.getState>;
