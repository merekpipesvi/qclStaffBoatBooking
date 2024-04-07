import { useRouter } from 'next/router';
import { END_URL_ARG, START_URL_ARG } from '@/utils/constants';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';

export const useGetStartEndDate = () => {
    const router = useRouter();
    const startDateString = (router.query[START_URL_ARG] ?? '') as string;
    const endDateString = (router.query[END_URL_ARG] ?? '') as string;
    const currentUser = useAppSelector(selectCurrentUser);
    if (currentUser !== undefined && (startDateString === '' || endDateString === '') && router.route !== '/admin') {
         // if the URL changes and dates or user arent defined, push back to booking selection page
         // admin page bypasses this, so we don't need to worry about it on admin page.
        router.push('/booking');
    }
    return ({ startDateString, endDateString });
};
