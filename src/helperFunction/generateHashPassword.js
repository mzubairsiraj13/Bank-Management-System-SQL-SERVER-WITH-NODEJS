import bcrypt from "bcrypt"
import { BCRYPT_SALT_ROUNDS } from "../constants.js"


const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    try {
        
        const hashedPassword = await bcrypt.hash(password, salt)
        
        return hashedPassword;
        
    } catch (error) {
        console.log("can't generate hash", error);
        return null;
    }
    
}
const verifyPassword = async(password,hashedPassword) => {
    try {
        const isPasswordCorrect = await bcrypt.compare(password,hashedPassword);
        return isPasswordCorrect;
    } catch (error) {
        return false;
        
    }
}


export {
    generateHashedPassword,
    verifyPassword,
}