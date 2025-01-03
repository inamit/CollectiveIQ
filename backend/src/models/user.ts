
export interface User extends UserDisplayData {
    password: string;
    tokens: string[];
    likedApartments: string[];
    dislikedApartments: string[];
    googleID? : string
    isGoogle?: boolean
}

export interface UserDisplayData {
    email: string;
    username: string;
    avatarUrl: string;
    sex: Gender;
}

export enum Gender {
    male,
    female
}

export interface Password {
    oldPassword: string;
    newPassword: string;
}