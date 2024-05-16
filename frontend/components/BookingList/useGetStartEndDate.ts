import { useRouter } from 'next/router';
import { END_URL_ARG, ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE, START_URL_ARG } from '@/utils/constants';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';
import { addDays, format, getTime, isAfter, isWithinInterval, parseISO, setHours, setMinutes, startOfToday, startOfTomorrow } from 'date-fns';
import { useCutOffTimes } from '@/utils/useCutoffDates';

export const useGetStartEndDate = () => {
    const router = useRouter();
    const startDateStringFromURL = (router.query[START_URL_ARG] ?? '') as string;
    const endDateStringFromURL = (router.query[END_URL_ARG] ?? '') as string;
    const currentUser = useAppSelector(selectCurrentUser);
    if (currentUser !== undefined && (startDateStringFromURL === '' || endDateStringFromURL === '') && router.route !== '/admin') {
         // if the URL changes and dates or user aren't defined, push back to booking selection page
         // admin page bypasses this, so we don't need to worry about it on admin page.
        router.push('/booking');
    }
    const { isAfterSignUpCutOff } = useCutOffTimes();
    const beginningDay = isAfterSignUpCutOff ? startOfTomorrow() : startOfToday();
    const lastDay = addDays(beginningDay, NUM_DAYS_BOOKABLE);
    const startDateString = isWithinInterval(parseISO(startDateStringFromURL), 
            {start: beginningDay, end: lastDay}
        ) ? 
        startDateStringFromURL : 
        format(beginningDay, ISO_DATE_FORMAT);
    const endDateString = isWithinInterval(parseISO(endDateStringFromURL), 
            {start: beginningDay, end: lastDay}
        ) ? 
        endDateStringFromURL : 
        format(lastDay, ISO_DATE_FORMAT);

    return ({ startDateString, endDateString });
};

