import { Document } from 'mongoose';

export default interface IMessage extends Document {
    message: String;
    users: Array<any>;
    sender: String;
}
