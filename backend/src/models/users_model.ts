import {Schema, Types, model, Document} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    _id?: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    refreshTokens?: string[];
    avatarUrl?: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: { value: string }) =>
                `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    refreshTokens: {
        type: [String],
        default: [],
    },
    avatarUrl: {
        type: String,
        required: false,
    },
});

userSchema.pre("save", async function (next) {
    this.password = await hashPassword(this.password);
    next();
});

export const hashPassword = async (password: any) => {
    const workFactor = 10;
    return await bcrypt.hash(password, workFactor);
};

export const USER_RESOURCE_NAME = "User";
const User = model<IUser>(USER_RESOURCE_NAME, userSchema);

export default User;
