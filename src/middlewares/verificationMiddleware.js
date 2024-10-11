import { decodeAccessToken, verifyAccessToken } from "../helperFunction/tokenGenerators.js";
import ApiError from "../utils/ApiError.js";

import AsyncHandler from "../utils/AsyncHandler.js";

const verificationEmailMiddleware = AsyncHandler((request, _ , next)=>{
    
    
    const token = request.cookies.verificationToken || request.header("Authorization")?.split("Bearer ")[1]
    if (!token) {
        let message = 
        "You must be logged in! to verify email";
        throw new ApiError(403,message);  
    }
    if (verifyAccessToken(token)) {
        
        const email = decodeAccessToken(token);
        
        request.body.email = email.email;
       
        
        next();  
    }else
    {
        throw new ApiError(403,"session expired! Please Login Again");
    }
    
})


export default verificationEmailMiddleware;