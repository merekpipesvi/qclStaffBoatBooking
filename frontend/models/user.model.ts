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

// We don't need to send this for most use cases
type IsConfirmed = {
    isConfirmed: boolean;
};

export type GetUserModel = Omit<UserModel, 'password'>;

export type PostUserModel = Omit<UserModel, 'userId' | 'role' | 'points'>;

export type PostLogInModel = Pick<UserModel, 'email' | 'password'>;

export type GetUserForBookingModel = Pick<UserModel, 'firstName' | 'lastName' | 'points' | 'userId'> & Pick<GetBookingModel, 'isPriority' | 'timeBooked'>;

export type GetUserAdminModel = UserModel & IsConfirmed;
export type PatchUserAdminModel = { userId: GetUserAdminModel['userId']; points?: GetUserAdminModel['points']; isConfirmed?: GetUserAdminModel['isConfirmed']; };
