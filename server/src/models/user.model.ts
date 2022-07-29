import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user.interface';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatarImage: {
            type: String
        },
        token: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
