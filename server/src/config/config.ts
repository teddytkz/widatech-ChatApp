import dotenv from 'dotenv';
dotenv.config();

//MongoDb Config
const MONGO_USERNAME: String = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD: String = process.env.MONGO_PASSWORD || '';
const MONGO_URL: string = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${process.env.MONGO_URL}`;

//Server Config
const SERVER_PORT: Number = Number(process.env.SERVER_PORT) || 5000;

//Token Config
const SERVER_TOKEN_EXPIRETIME_ACCESS: Number = Number(process.env.SERVER_TOKEN_EXPIRETIME_ACCESS) || 60;
const SERVER_TOKEN_EXPIRETIME_REFRESH: Number = Number(process.env.SERVER_TOKEN_EXPIRETIME_REFRESH) || 3600;
const SERVER_TOKEN_ISSUER: string = process.env.SERVER_TOKEN_ISSUER || 'testIssuer';
const SERVER_TOKEN_SECRET_ACCESS: string = process.env.SERVER_TOKEN_SECRET_ACCESS || 'serverTokenSecret';
const SERVER_TOKEN_SECRET_REFRESH: string = process.env.SERVER_TOKEN_SECRET_REFRESH || 'serverTokenSecretRefresh';

//Export
const MONGO = {
    url: MONGO_URL
};

const SERVER = {
    port: SERVER_PORT,
    token: {
        expireTimeAccess: SERVER_TOKEN_EXPIRETIME_ACCESS,
        expireTimeRefresh: SERVER_TOKEN_EXPIRETIME_REFRESH,
        issuer: SERVER_TOKEN_ISSUER,
        secretAccess: SERVER_TOKEN_SECRET_ACCESS,
        secretRefresh: SERVER_TOKEN_SECRET_REFRESH
    }
};

const config = {
    server: SERVER,
    mongo: MONGO
};

export default config;
