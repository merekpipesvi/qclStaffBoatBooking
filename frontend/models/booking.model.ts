export type GetBookingModel = {
    date: Date;
    // undefined if booking is a full day, true or false if it's a half day
    isMorningBooking?: boolean;
    // undefined if the user is not subject to confirmation. False if the user is unconfirmed. True if they are.
    isConfirmed?: boolean;
    userId: number;
    timeBooked: Date;
};
