import { COOKIE_OPTIONS } from "../constants.js";
import { decodeAccessToken, verifyAccessToken } from "../helperFunction/tokenGenerators.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import AsyncHandler from "../utils/AsyncHandler.js";

const isAuthenticated = AsyncHandler((request, response , next)=>{
    const token = request.cookies.accessToken || request.header("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
        let message = request.path === '/logout' ? "You are not logged in!" : "To Access data! Please sign In first";
        throw new ApiError(403,message);  
    }
    
    
    
    const verifyToken = verifyAccessToken(token)
    
    
    if (verifyToken) {
        
        const userData = decodeAccessToken(token);

        console.log(userData); 
        
        
        request.body.UserID = userData.UserID;
        request.body.cnicNumber = userData.cnicNumber;
        request.body.accountNumber = userData.accountNumber;
        
        

        next();  
    }else
    {  
        return response.clearCookie('accessToken', COOKIE_OPTIONS).json(new ApiResponse(403, null, "Session Exipred! Plz Login again"));

    }
    
    
    
})



export {
    isAuthenticated
}