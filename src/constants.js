import { configDotenv } from "dotenv";

configDotenv({
    path: "./.env"
})


// configration Imports

const SERVER_PORT = process.env.SERVER_PORT || 5000;

//DATABASE CONFIGRATIONS IMPROTS

const DB_USERNAME = process.env.DB_USER_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME; 
const DB_SERVER_HOST = process.env.DB_SERVER_HOST || "localhost";


const ALLOWED_CORS_ORIGIN = process.env.ALLOWED_CORS_ORIGIN;

//Bcrypt

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10);
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY= process.env.ACCESS_TOKEN_EXPIRY;

const COOKIE_OPTIONS = {
    maxAge: 1000*60*60*24,
    httpOnly: true,
    secure: process.env.PROJECT_CURRENT_STATUS === "PRODUCTION",
    sameSite: 'strict' 
}

const EMAIL_TRANSPORT_CONFIG = {
    isServiceMode: process.env.EMAIL_MODE_ISSERVICE || false,
    serivce: process.env.EMAIL_SERVER_SERVICE_NAME,
    user: process.env.EMAIL_AUTH_USERNAME,
    password: process.env.EMAIL_AUTH_PASSWORD,
    host: process.env.EMAIL_SERVER_HOST_NAME,
    port: process.env.EMAIL_SERVER_HOST_PORT,
    secure: false,
    tls: {}
} 





export  {
    SERVER_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_SERVER_HOST,
    ALLOWED_CORS_ORIGIN,
    BCRYPT_SALT_ROUNDS,
    JWT_ACCESS_TOKEN_SECRET,
    COOKIE_OPTIONS,
    ACCESS_TOKEN_EXPIRY,
    EMAIL_TRANSPORT_CONFIG
    
}