export type GetDaysModel = {
    // day of the week, 0-6. 0 Represents sunday.
    day: string;
    isHalfDay: number; // we get 0 or 1 from database boolean
};
