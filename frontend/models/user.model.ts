import { GetBookingModel } from './booking.model';

type UserModel = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    fishingLicence: string;
    points: number;
    password: string;
    pcoc?: string;
};

// Used in select queries as an add on column
type IsMe = {
    isMe: boolean;
};

export type GetUserModel = Omit<UserModel, 'password'>;

export type PostUserModel = Omit<UserModel, 'userId' | 'role' | 'points'>;

export type PostLogInModel = Pick<UserModel, 'email' | 'password'>;

export type GetUserForBookingModel = Pick<UserModel, 'firstName' | 'lastName' | 'points'> & Pick<GetBookingModel, 'isPriority' | 'timeBooked'> & IsMe;
