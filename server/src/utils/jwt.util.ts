import jwt from 'jsonwebtoken';
import config from '../config/config';
import IUser from '../interfaces/user.interface';

const signJWT = (user: IUser, secret: any, type: string) => {
    try {
        let expireTimeToken = 0;
        if (type == 'access') {
            expireTimeToken = Number(config.server.token.expireTimeAccess);
        } else if (type == 'refresh') {
            expireTimeToken = Number(config.server.token.expireTimeRefresh);
        } else {
            return null;
        }
        return jwt.sign(
            {
                username: user.username
            },
            secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expireTimeToken
            }
        );
    } catch (error) {
        console.log(`Error To Process Token`);
        return null;
    }
};

export default {
    signJWT
};
