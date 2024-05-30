import { useRouter } from 'next/router';
import { END_URL_ARG, ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE, START_URL_ARG } from '@/utils/constants';
import { addDays, format, isWithinInterval, parseISO, startOfToday, startOfTomorrow } from 'date-fns';
import { useCutOffTimes } from '@/utils/useCutoffDates';

export const useGetStartEndDate = () => {
    const router = useRouter();
    const startDateStringFromURL = (router.query[START_URL_ARG] ?? '') as string;
    const endDateStringFromURL = (router.query[END_URL_ARG] ?? '') as string;
 
    const { isAfterSignUpCutOff } = useCutOffTimes();
    const beginningDay = addDays(startOfTomorrow(), isAfterSignUpCutOff ? 1 : 0);
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

