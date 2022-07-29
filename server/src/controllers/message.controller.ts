import { Request, Response, NextFunction } from 'express';
import messageModel from '../models/message.model';

const addMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from
        });
        if (data) {
            return res.status(200).json({
                message: 'Success To Add Message'
            });
        } else {
            return res.status(500).json({
                message: 'Failed To Add Message'
            });
        }
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

const getAllMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { from, to } = req.body;

        const message = await messageModel
            .find({
                users: {
                    $all: [from, to]
                }
            })
            .sort({ updatedAt: 1 });

        const projectedMessage = message.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message
            };
        });
        res.status(200).json(projectedMessage);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

export default {
    addMessage,
    getAllMessage
};
