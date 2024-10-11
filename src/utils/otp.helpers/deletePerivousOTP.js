import executeQuery from "../queryExectorFunction.js"

const deletePreviousOTP = async (cnicNumber)=> {
    
    const otpDeleteQuery = `DELETE FROM OTP WHERE cnicNumber = '${cnicNumber}';`
    
    
    

    try {
        const otpDeleted = (await executeQuery(otpDeleteQuery));
    } catch (error) {
        console.log(error);
    }
}
 
export default deletePreviousOTP;