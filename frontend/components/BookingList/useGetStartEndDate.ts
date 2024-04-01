import { useRouter } from 'next/router';
import { END_URL_ARG, START_URL_ARG } from '@/utils/constants';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';

export const useGetStartEndDate = () => {
    const router = useRouter();
    const startDateString = (router.query[START_URL_ARG] ?? '') as string;
    const endDateString = (router.query[END_URL_ARG] ?? '') as string;
    const currentUser = useAppSelector(selectCurrentUser);
    if (currentUser !== undefined && (startDateString === '' || endDateString === '')) {
        router.push('/booking'); // if the URL changes and one isn't defined, push back to booking selection page
    }
    return ({ startDateString, endDateString });
};
