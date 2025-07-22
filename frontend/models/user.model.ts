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
    isConfirmed: boolean; 
    pcoc?: string;
};

export type GetUserModel = Omit<UserModel, 'password'>;

export type PostUserModel = Omit<UserModel, 'userId' | 'role' | 'points'>;

export type PostLogInModel = Pick<UserModel, 'email' | 'password'>;

export type GetUserForBookingModel = Pick<UserModel, 'firstName' | 'lastName' | 'points' | 'userId'> & Pick<GetBookingModel, 'isPriority' | 'timeBooked'>;

export type PatchUserAdminModel = { userId: GetUserModel['userId']; points?: GetUserModel['points']; isConfirmed?: GetUserModel['isConfirmed']; };
