import { DayOfWeek } from '@mantine/dates';

// days of the provided range that are halfDays as a ISO date string.
export type GetHalfDaysModel = string[];

export type GetHalfDaysArg = {
    // range to check, startDate is always current date. String ISO expected.
    endDate: string;
};

export type SetDaysArg = {
    dayOfTheWeek: DayOfWeek;
    // ISO date string expected
    startDate: string;
};
