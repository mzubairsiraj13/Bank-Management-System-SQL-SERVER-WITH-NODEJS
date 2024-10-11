import sql from 'mssql';
import ApiError from './ApiError.js';



const executeQuery = async (query) => {
    try {
        const queryResult = await sql.query(query);
        return queryResult;
    } catch (error) {
       console.log(error)
        throw new ApiError(400, "Invalid Entries")        
    }
};


export default executeQuery;