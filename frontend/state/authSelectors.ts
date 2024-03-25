import { authApi } from '@/services/authApi';
import { AppStore } from './store';

export const selectCurrentUser = (state: AppStore) => authApi.endpoints.getMe.select()(state).data;
