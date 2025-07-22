import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppStore } from '@/state/store';

export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector;
