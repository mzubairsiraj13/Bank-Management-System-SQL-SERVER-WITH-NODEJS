import { DB_USERNAME, DB_PASSWORD, DB_NAME , DB_SERVER_HOST } from "../constants.js";



const DatabaseConnectionConfig =  {
    
    user: DB_USERNAME,
    password: DB_PASSWORD ,
    database: DB_NAME,
    server: DB_SERVER_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {  
      encrypt: false, 
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }
 
  




export default DatabaseConnectionConfig;

