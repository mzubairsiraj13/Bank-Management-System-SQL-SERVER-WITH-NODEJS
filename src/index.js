import {app} from "./app.js"
import DatabaseConnectionConfig from "./configurations/dbConfig.js";
import { SERVER_PORT } from "./constants.js"
import connnectSQL_SERVER from "./db/connectDb.js";
import generateOTP from "./utils/otp.helpers/generateOTP.js";




connnectSQL_SERVER(DatabaseConnectionConfig)
.then(
    
    app.listen(SERVER_PORT, ()=> console.log(`Server is running @http://localhost:${SERVER_PORT}` )))
.catch((e) => console.log("SERVER COULD NOT BE STARTED DUE DATABASE CONNECTION ERROR!")
  
 )






