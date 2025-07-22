export const NUM_DAYS_BOOKABLE = 7; // if this moves past 7 days, we should update the get forecast to 14 days
export const NUM_BOATS = 3;

export const BOAT_IDS = [34, 35, 36];

export const START_URL_ARG = 'start';
export const END_URL_ARG = 'end';
export const DEEPLINK_URL_ARG = 'deepLink';

export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const STRING_DATE_FORMAT = 'MMM d, yyyy';
export const STRING_TIME_FORMAT = 'h:mm a';
export const DAYS_OF_THE_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export enum DaysOfWeek {
    Sunday = 0,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}
