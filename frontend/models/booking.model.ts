export type GetBookingModel = {
    bookingId: number;
    date: string;
    // undefined if booking is a full day, true or false if it's a half day
    isMorningBooking?: boolean | null;
    // undefined if the user is not subject to confirmation. False if the user is unconfirmed. True if they are.
    isConfirmed?: boolean;
    userId: number;
    timeBooked: Date;
    isPriority: boolean;
};

export type GetUsersForBookingArg = Pick<GetBookingModel, 'isMorningBooking' | 'date'>;

export type PostBookingModel = Pick<GetBookingModel, 'date' | 'isMorningBooking'>;
export type PostPriorityBookingModel = Pick<GetBookingModel, 'date' | 'isMorningBooking' | 'userId'>;

export type ConfirmBookingModel = Pick<GetBookingModel, 'bookingId'>;
