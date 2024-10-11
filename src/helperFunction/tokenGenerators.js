import Jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRY, JWT_ACCESS_TOKEN_SECRET } from "../constants.js"

const generateAccessToken = (payLoad)=>{
    const accessToken = Jwt.sign(payLoad,JWT_ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY});
    return accessToken;
}
const verifyAccessToken = (token)=>{
    try {
        const isValidAccessToken = Jwt.verify(token,JWT_ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY});
        return isValidAccessToken;
    } catch (error) {
       return false
        
    }
}
const decodeAccessToken = (token)=>{
    const userData = Jwt.decode(token,JWT_ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRY});
    return userData;
}






export {
    generateAccessToken,
    verifyAccessToken,
    decodeAccessToken
    
}