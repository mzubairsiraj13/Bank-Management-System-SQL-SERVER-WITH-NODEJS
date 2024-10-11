import sql from "mssql"
import createTable from "../utils/createTable.js";
import userTableDetails from "../models/user.model.js";
import OTPTableDetails from "../models/opt.model.js";
import accountTableDetails from "../models/account.model.js";
import transactionTableDetails from "../models/transaction.model.js";
import loanTableDetails from "../models/loan.model.js";
import laonRepaymentTableDetails from "../models/laon_payemenet.model.js";







const connnectSQL_SERVER =  async (config) => {
    try {
            const connectionPool = await sql.connect(config);
            createTable(userTableDetails.tableName, userTableDetails.userTableQuery);
            createTable(OTPTableDetails.tableName, OTPTableDetails.otpTableQuery);
            createTable(accountTableDetails.tableName, accountTableDetails.accountTableQuery);
            createTable(transactionTableDetails.tableName, transactionTableDetails.transactionTableQuery);
            createTable(loanTableDetails.tableName, loanTableDetails.loanTableQuery);
            createTable(laonRepaymentTableDetails.tableName, laonRepaymentTableDetails.laonPaymentQuery);
            console.log("SQL SERVER DATABASE CONNECTION Succesfull! ");
            return connectionPool;
    } catch (error) {
        
        console.log(`ERROR OCCURED WHILE CONNECTION DB! ERR: ${error}`);
        process.exit(0) 
    }
} 

 
export default connnectSQL_SERVER;  