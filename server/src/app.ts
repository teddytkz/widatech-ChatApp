import http from 'http';
import express from 'express';
import config from './config/config';
import mongoose from 'mongoose';
import logging from './utils/logging.util';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/user.router';
import messageRouter from './routes/message.router';

require('dotenv').config();

const app = express();
const socket = require('socket.io');

//Connect To Mongo
mongoose
    .connect(config.mongo.url, {
        w: 'majority',
        retryWrites: true
    })
    .then(() => {
        logging.info('Success Connect To Db');
    })
    .catch((error) => {
        console.log(error);
        logging.warn('Failed Connect To Db');
    });

//Start Server

app.use(cors());
app.use(express.json());

/** Parse From Body Request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Test Ping Pong */
app.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    });
});

/** Router */
app.use('/api/auth', userRouter);
app.use('/api/message', messageRouter);

/** Server Init */
const server = app.listen(config.server.port, () => {
    logging.info(`Server Start on Port ${config.server.port}`);
});

/** Socket */
const io = socket(server, {
    cors: {
        origin: '*',
        credetials: true
    }
});

const onlineUsers = new Map();

io.on('connection', (socket: any) => {
    const chatSocket = socket;
    socket.on('add-user', (userId: any) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data: any) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log({ data });
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.message);
        }
    });
});
