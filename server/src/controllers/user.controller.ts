import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logging from '../utils/logging.util';
import userModel from '../models/user.model';
import bcryptjs from 'bcryptjs';
import config from '../config/config';
import jwtUtil from '../utils/jwt.util';

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, name } = req.body;
        const user = new userModel({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: await hashPassword(password),
            email,
            name,
            avatarImage:
                'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiNkMTAwODQ7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1YTYzLjc1IDYzLjc1IDAgMCAwLTEwLjUgMTI2LjYzdjE0LjA5YTExNS41IDExNS41IDAgMCAwLTUzLjcyOSAxOS4wMjcgMTE1LjUgMTE1LjUgMCAwIDAgMTI4LjQ2IDAgMTE1LjUgMTE1LjUgMCAwIDAtNTMuNzI5LTE5LjAyOXYtMTQuMDg0YTYzLjc1IDYzLjc1IDAgMCAwIDUzLjI1LTYyLjg4MSA2My43NSA2My43NSAwIDAgMC02My42NS02My43NSA2My43NSA2My43NSAwIDAgMC0wLjA5OTYxIDB6IiBzdHlsZT0iZmlsbDojZmZjZTk0OyIvPjxwYXRoIGQ9Im0xNDEuODkgMTk1YTExNC43OSAxMTQuNzkgMCAwIDEgMzggMTYuNSAxMTUuNTUgMTE1LjU1IDAgMCAxLTEyOC40NyAwIDExNC43OSAxMTQuNzkgMCAwIDEgMzgtMTYuNWwxNS43NSAxNS43NWgyMXoiIHN0eWxlPSJmaWxsOiM1NzFlNTc7Ii8+PHBhdGggZD0ibTE0Ni40IDE5Ni4xNC0xNy40IDE3LjQ0LTEuMTcgMS4xN2gtMjQuMzRsLTEuMTgtMS4xNy0xNy40My0xNy40NGMxLjQ5LTAuNDEgMy0wLjc5IDQuNTEtMS4xNGw0LjY3LTEgMTIuNzQgMTIuNzRoMTcuNjlsMTIuNzMtMTIuNzQgNC42NyAxYzEuNTIgMC4zNSAzIDAuNzMgNC41MSAxLjE0eiIgc3R5bGU9ImZpbGw6I2ZmMDsiLz48cGF0aCBkPSJtMzIuOTAyIDY3LjY2MmMtMC4zNjI5NSAxLjcyMjctNi4yMzQyIDMwLjY5NSA1LjYxMzMgNTIuNTk2IDQuNTg0MyA4LjQ3NDMgOS4wMDgxIDEzLjIzOSAxMi43NSAxNS44OTNhNjcuNyA2Ny43IDAgMCAxLTMuNDY4OC0yMS4zNSA2Ny43IDY3LjcgMCAwIDEgMi4zMzItMTcuNjU4Yy00LjQ5MTQtMi40NjQ2LTEwLjg2OC02LjkwMTItMTMuODM0LTEzLjUyLTQuMTYyNi05LjI4NS0zLjYxNTUtMTQuNjczLTMuMzkyNi0xNS45NjF6bTE2NS4xOSAwYzAuMjIyOTIgMS4yODgyIDAuNzcwMDUgNi42NzU5LTMuMzkyNiAxNS45NjEtMi45NjY0IDYuNjE4My05LjM0MjYgMTEuMDU1LTEzLjgzNCAxMy41MmE2Ny43IDY3LjcgMCAwIDEgMi4zMzIgMTcuNjU4IDY3LjcgNjcuNyAwIDAgMS0zLjQ2ODggMjEuMzVjMy43NDE5LTIuNjUzMiA4LjE2NTctNy40MTgzIDEyLjc1LTE1Ljg5MyAxMS44NDctMjEuOSA1Ljk3NjItNTAuODczIDUuNjEzMy01Mi41OTZ6IiBzdHlsZT0iZmlsbDojYWNmZmZkOyIvPjxwYXRoIGQ9Im0xMTUuNzMgMTMuMTkxYy03LjM3ODctMC4xMzM1MS0xMy41MDkgNS43ODg4LTEzLjYzMSAxMy4xNjgtMC4xMDEyOCA1Ljg4MjcgMy40NTA4IDEwLjUxOCA4LjA1NjYgMTIuNTIgMS4wNjEgMC40NjExNSAyLjE4NjkgMC43ODAwOSAzLjM0MTggMC45NTcwM3Y4LjQyOTFjMC42Njc3OC0wLjAyMDM1IDEuMzM1OC0wLjAzMDc3IDIuMDAzOS0wLjAzMTI1IDAuNjY1NDctOWUtNSAxLjMzMDkgMC4wMDk3IDEuOTk2MSAwLjAyOTN2LTguNDExNWMyLjYwMDItMC4zODQwNiA1LjE1ODYtMS41NDg0IDcuMzA4Ni0zLjYyNSA0LjIzMjItNC4wODc4IDQuOTk5MS05Ljg3NTUgMy4xNTgyLTE0LjU0OS0xLjg0MDctNC42NzI2LTYuMzUwMi04LjM4MzQtMTIuMjMyLTguNDg2M3oiIHN0eWxlPSJmaWxsOiNhY2ZmZmQ7Ii8+PHBhdGggZD0ibTg2Ljg1MSAxMDAuMzlhNC45NCA0Ljk0IDAgMSAwIDQuOTI5NyA1IDUgNSAwIDAgMC00LjkyOTctNXptNTcuMjIxIDBhNC45NCA0Ljk0IDAgMSAwIDQuOTM5NCA0LjkzOTQgNC45NCA0Ljk0IDAgMCAwLTQuOTM5NC00LjkzOTR6IiBzdHlsZT0iZmlsbDojMDAwOyIvPjxwYXRoIGQ9Im04Ni4yMDcgODkuMzY1Yy0yNS41MDQgMC0yMS41MDMgNi44NTYxLTIxLjAzNSAxOS41OTYgMC44MDE3NyAxOC4xMjEgMTcuNzYzIDE2LjUxNCAyMS4yMDEgMTYuNjM5IDE0Ljc1OC0wLjA0MSAyMC41MTgtOC4yMjcgMjIuOTUxLTIyLjkzMiAxLjgxNjYtMTAuNzMxLTkuMjUxLTEzLjE3NC0yMy4xMTctMTMuMzAzem01OC41OTggMGMtMTMuODY2IDAuMTI4NC0yNC45MzYgMi41NzE3LTIzLjExOSAxMy4zMDMgMi40MzMyIDE0LjcwNSA4LjE5MzYgMjIuODkxIDIyLjk1MSAyMi45MzIgMy40MzgzLTAuMTI1IDIwLjM5OSAxLjQ4MjggMjEuMjAxLTE2LjYzOSAwLTE4Ljk2NS0wLjQ3OTU4LTE5LjU5Ni0yMS4wMzMtMTkuNTk2eiIgc3R5bGU9ImZpbGw6IzAwMDsiLz48cGF0aCBkPSJtMTY5Ljg3IDkwLjI1NWEwLjUxIDAuNTEgMCAwIDAtMC40Mzk5MS0wLjUyIDE2Ny42NCAxNjcuNjQgMCAwIDAtMjIuNi0xLjY4MDFjLTEyIDAtMjcuNDcgMy43NjAxLTMwLjE3IDMuNzYwMWgtMi40Yy0xLjI0OTkgMC01LjI5LTAuODA5OTYtMTAuNDUtMS42ODAxYTEyNC4zNSAxMjQuMzUgMCAwIDAtMTkuNzItMi4wOCAxNjYuMTggMTY2LjE4IDAgMCAwLTE5LjMxIDEuMjRjLTEuNTYgMC4xNzk5OS0yLjY5IDAuMzUwMDktMy4yODk5IDAuNDQwMDlhMC41MSAwLjUxIDAgMCAwLTAuNDQwMDcgMC41MmwtMC4wOTEgNi40NTAxYTAuNTcgMC41NyAwIDAgMCAwLjMzMDEyIDAuNTJsMC43Mzk5NCAwLjIzOTkyYzEuMDggMC40MTk5MiAxLjAwMDEgMTkuODUgNi43OCAyNC43MSAzLjQ0MDEgMi44NTk5IDYuNTEgNC40ODk5IDE5LjQyIDQuNDg5OSA3LjQ2OTkgMCAxMi4xNy0xLjk5OTkgMTYuNjMtOCAzLjIxLTQuMzIgNi4wOTk5LTE0LjU1IDYuMDk5OS0xNC41NSAwLjgyMDA2LTQuMDcgMy43NzAyLTQuNTIgNC40My00LjU4MDFoMC4xMjA2OGMwLjExMDc4IDAgMy42NiAwLjA1OTMgNC41NyA0LjU4MDEgMCAwIDIuODU5OSAxMC4yMiA2LjA2OTkgMTQuNTQgNC40NjAxIDUuOTk5OSA5LjE2MDEgOCAxNi42MyA4IDEyLjkxIDAgMTYtMS42MyAxOS40Mi00LjQ5MDEgNS43ODk4LTQuODYgNS42OTk4LTI0LjI5IDYuNzgtMjQuNzFsMC43Mzk5NC0wLjIzOTkzYTAuNTcgMC41NyAwIDAgMCAwLjMyOTk2LTAuNTJsLTAuMTIwNjgtNi40NTAxem0tNjUgMjNjLTEuOTEwMSA0LjUtNi44IDEwLjI5LTEzLjcgMTAuNjQtMjAuNyAwLjk5OTg1LTIxLjY1LTQuNzQwMS0yMy05LjMyMDFhMzEuNDUgMzEuNDUgMCAwIDEtMS4yMDk5LTEzLjE4YzAuNTM5OTctNC41Nzk5IDEuNy03LjI2OTkgMy43ODAxLTguNjIwMWE5LjMgOS4zIDAgMCAxIDQuMzQ5OS0xLjUxIDg1LjA3IDg1LjA3IDAgMCAxIDExLjQtMC41MiA1OS4yMyA1OS4yMyAwIDAgMSA5LjIwOTkgMC42OTk5OWM3LjM3IDEuMiAxMi4zNSAzLjcwMDEgMTIuMzUgNi4xNjAxYTQ2LjEyIDQ2LjEyIDAgMCAxLTMuMjMgMTUuNjR6bTU4IDEuMzIwMWMtMS4zNCA0LjU3OTktMi4yOSAxMC4zNi0yMyA5LjMyMDEtNi45MS0wLjM1MDEtMTEuODEtNi4xNDAxLTEzLjcxLTEwLjY0YTQ2LjM1IDQ2LjM1IDAgMCAxLTMuMjItMTUuNjRjMC0zLjM5IDkuNDMtNi44NTk5IDIxLjU2LTYuODU5OSAxMi4xMyAwIDE0IDAuODk5OTYgMTUuNzUgMS45OTk5IDIuMDggMS4zNTAyIDMuMjM5OCA0IDMuNzcgOC42MjAxYTMxLjIzIDMxLjIzIDAgMCAxLTEuMTYwMSAxMy4xN3oiIHN0eWxlPSJmaWxsOiM1N0ZGRkQ7Ii8+PHBhdGggZD0ibTEwMC4xOSAxNTIuMDljMi44NzI2IDQuMDYxNiA5LjgwOTUgNC43MjMyIDE1LjExOS0wLjQ1NDMyIDUuMDY1NiA0LjUxMzQgMTEuMTY3IDUuNjg5OCAxNS40OTUgMC4zMTQ1OCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjUuODk0OTtzdHJva2U6IzIyMjsiLz48cGF0aCBkPSJtMTA5LjY3IDEzNS41M2MtMC45NzU4IDAuMDc0My0yLjA1IDAuNDUzMjctMy4xNDg1IDAuOTk0MTQtNC4zMjM1IDIuMTM5OS03LjM4NjIgNC4yNTU3LTEwLjYzOSA3LjE0MDYtMC42MjUxIDAuNTcxNSAwLjExNjggMC43Nzc4NSAxLjQyMzggMC44NzMwNCA1LjY5NjcgMC4wNTM2IDE0LjM4NCAwLjQxNDA0IDE1LjA5OC0wLjg3NSAxLjkyNTEtMi4wNzg4IDEuNzk2OS01LjMzMDMtMC4xODE2LTcuMzAwOC0wLjcwMS0wLjY3NTMzLTEuNTc2OS0wLjkwNjMyLTIuNTUyNy0wLjgzMjAzem0xMS42NTYgMGMtMC45NzU4LTAuMDc0My0xLjg1MTcgMC4xNTY3LTIuNTUyNyAwLjgzMjAzLTEuOTc4NSAxLjk3MDUtMi4xMDY3IDUuMjIyLTAuMTgxNyA3LjMwMDggMC43MTQyIDEuMjg5IDkuNDAxIDAuOTI4NiAxNS4wOTggMC44NzUgMS4zMDctMC4wOTUyIDIuMDQ4OS0wLjMwMTU0IDEuNDIzOC0wLjg3MzA0LTMuMjUyNC0yLjg4NDktNi4zMTUxLTUuMDAwNy0xMC42MzktNy4xNDA2LTEuMDk4NS0wLjU0MDg3LTIuMTcyNy0wLjkxOTg1LTMuMTQ4NS0wLjk5NDE0eiIgc3R5bGU9ImZpbGw6I2ZmZjsiLz48L3N2Zz4=',
            token: ''
        });
        const saveUser = await user.save();
        return res.json({
            message: 'Success Register',
            data: ''
        });
    } catch (error: any) {
        logging.warn('Error Register ' + error.message);
        return res.status(400).json({
            message: 'Failed Register',
            data: error.message
        });
    }
};

const hashPassword = async (password: any) => {
    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(password, salt);
};

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({
            username: username
        });
        if (!user) {
            return res.status(201).json({
                message: 'User Not Found'
            });
        }
        const matchPassword = await bcryptjs.compare(password, user.password);
        if (!matchPassword) {
            return res.status(201).json({
                message: 'Wrong Password'
            });
        }

        //set Refresh Token
        const refreshToken = jwtUtil.signJWT(user, config.server.token.secretRefresh, 'refresh');

        //update Token to Db
        const updateTokenTouser = await userModel.findByIdAndUpdate(user._id, {
            token: refreshToken
        });

        return res.status(200).json({
            message: 'Success Login',
            data: {
                _id: user._id,
                username: user.username,
                token: refreshToken
            }
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error Login',
            data: error.message
        });
    }
};

const allUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const allUser = await userModel
            .find({
                _id: { $ne: id }
            })
            .select(['email', 'username', 'name', 'avatarImage', '_id']);
        return res.json(allUser);
    } catch (error: any) {
        return res.status(500).json({
            message: 'Failed To Get All Users',
            data: error.message
        });
    }
};

const userById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userById = await userModel
            .findOne({
                _id: id
            })
            .select(['email', 'username', 'name', 'avatarImage', '_id']);
        return res.json(userById);
    } catch (error: any) {
        return res.status(500).json({
            message: 'Failed To Get Users',
            data: error.message
        });
    }
};

export default {
    register,
    login,
    allUsers,
    userById
};
