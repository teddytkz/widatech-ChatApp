import mongoose, { Schema } from 'mongoose';
import IMessage from '../interfaces/message.interface';

const MessageSchema: Schema = new Schema(
    {
        message: {
            text: {
                type: String,
                required: true
            }
        },
        users: { type: Array },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            Required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
