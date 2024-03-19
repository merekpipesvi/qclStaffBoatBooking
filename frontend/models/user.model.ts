export type GetUserModel = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    fishingLicence: string;
    pcoc?: string;
};

type UserPassword = { password: string };

export type PostUserModel = Omit<GetUserModel, 'userId' | 'role'> & UserPassword;

export type PostLogInModel = Pick<GetUserModel, 'email'> & UserPassword;
