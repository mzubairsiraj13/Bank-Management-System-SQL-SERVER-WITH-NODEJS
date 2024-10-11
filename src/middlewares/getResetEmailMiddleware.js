import { decodeAccessToken, verifyAccessToken } from "../helperFunction/tokenGenerators.js";
import ApiError from "../utils/ApiError.js";

import AsyncHandler from "../utils/AsyncHandler.js";

const resetEmailMiddlware = AsyncHandler((request, _ , next)=>{
    const token = request.cookies.passwordResetOtp || request.header("Authorization")?.split("Bearer ")[1]
    if (!token) {
        let message = 
        "OTP TOKEN NOT FOUNDED! Try Again";
        throw new ApiError(403,message);  
    }
    if (verifyAccessToken(token)) {
        
        const email = decodeAccessToken(token);
        
        request.body.email = email.email;
       
        
        next();  
    }else
    {
        throw new ApiError(403,"OTP TOKEN EXPIRED!");
    }
    
    
    
})


export default resetEmailMiddlware;