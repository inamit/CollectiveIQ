export interface ILoginModel {
    username: string;
    password: string;
}

export interface ILoginSuccessModel {
    token: string;
}

export interface IUser {
    username: string;
    email: string;
    password: string;
}

export interface ITokenData {
    email: string;
    id: string;
    exp: number;
}
