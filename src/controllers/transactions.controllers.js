import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import executeQuery from "../utils/queryExectorFunction.js";



const deposit = AsyncHandler(async (request, response) => {
    const {accountNumber, amount} = request.body;

    

    if (!accountNumber) {
        throw new ApiError(400, "Invalid Account Number");
    }
    const getAccountQuery = `SELECT * FROM Account WHERE accountNumber = '${accountNumber}';`

    
    let account = (await executeQuery(getAccountQuery)).recordset[0];
   
    
    if (!account) {
        throw new ApiError(400, "Account Not found");
    }
    let existingBalance = account.balance;
    
    
    if(amount <= 0)
    {
        throw new ApiError(400,"Amount must be greater then 0 to desposit!");
    }
     
    let amountToInsert =parseInt(existingBalance + amount);
    const despositQuery = `INSERT INTO Transactions(accountID,transactionType,amount,balanceAfterTransaction) VAlUES('${account.accountID}','Deposit', ${amountToInsert},${amountToInsert});`;
    
    const isTransactionSuccess = (await executeQuery(despositQuery));
    
    if (!isTransactionSuccess.rowsAffected[0]) {
        throw new ApiError(400,"Transactions Failed!"); 
    }
    const updateAmountQuery = `UPDATE Account SET balance = ${amountToInsert} WHERE accountNumber = '${account.accountNumber}';`
    try {
        let transactionUpdate = (await executeQuery(updateAmountQuery)).rowsAffected[0];
        if (!transactionUpdate) {
        throw new ApiError(400,"Transactions Failed! while updating amount"); 
        }
    } catch (error) {
        throw new ApiError(400,"Transactions Failed! Something went wrong"); 
        
    }

    const newAccountDetailsQuery = `SELECT Account.*,Transactions.transactionType FROM Account JOIN (SELECT * FROM Transactions WHERE accountID = '${account.accountID}') Transactions ON Account.balance = Transactions.amount;`
    const newAccountDetails = (await executeQuery(newAccountDetailsQuery)).recordset[0];
    if (!newAccountDetails) {
        throw new ApiError(400, "Cant fetch Details");
    }
    return response.json(new ApiResponse(200, newAccountDetails));
})
const Withdrawal = AsyncHandler(async (request,response) => {
    const {accountNumber, amount} = request.body;

    

    if (!accountNumber) {
        throw new ApiError(400, "Invalid Account Number");
    }
    const getAccountQuery = `SELECT * FROM Account WHERE accountNumber = '${accountNumber}';`

    
    let account = (await executeQuery(getAccountQuery)).recordset[0];
   
    
    if (!account) {
        throw new ApiError(400, "Account Not found");
    }
    let existingBalance = account.balance;
    if(existingBalance < amount){
        throw new ApiError(400, "Dosnt Have sufficent balance for Withdrawal");
    }
    let amountToInsert =parseInt(existingBalance - amount);
    const WithdrawalQuery = `INSERT INTO Transactions(accountID,transactionType,amount,balanceAfterTransaction) VAlUES('${account.accountID}','Withdrawal', ${amountToInsert},${amountToInsert});`;
   
    const isTransactionSuccess = (await executeQuery(WithdrawalQuery));
    
    if (!isTransactionSuccess.rowsAffected[0]) {
        throw new ApiError(400,"Withdrawal Failed!"); 
    }
    const updateAmountQuery = `UPDATE Account SET balance = ${amountToInsert} WHERE accountNumber = '${account.accountNumber}';`
    try {
        let transactionUpdate = (await executeQuery(updateAmountQuery)).rowsAffected[0];
        if (!transactionUpdate) {
        throw new ApiError(400,"Transactions Failed! while updating amount"); 
        }
    } catch (error) {
        throw new ApiError(400,"Transactions Failed! Something went wrong"); 
        
    }

    const newAccountDetailsQuery = `SELECT Account.*,Transactions.transactionType FROM Account JOIN (SELECT * FROM Transactions WHERE accountID = '${account.accountID}') Transactions ON Account.balance = Transactions.amount;`
    const newAccountDetails = (await executeQuery(newAccountDetailsQuery)).recordset[0];
    if (!newAccountDetails) {
        throw new ApiError(400, "Cant fetch Details");
    }
    return response.json(new ApiResponse(200, newAccountDetails));

    
})
 
const sendMoney = AsyncHandler(async (request,response) => {
    const {accountNumberSender,accountNumberReciever, amount} = request.body;

   
    

    if (!accountNumberSender || !accountNumberReciever ) {
        throw new ApiError(400, "Invalid Account Number");
    }
    const getAccountSenderQuery = `SELECT * FROM Account WHERE accountNumber = '${accountNumberSender}';`
    const getAccountRecieverQuery = `SELECT * FROM Account WHERE accountNumber = '${accountNumberReciever}';`

    
    let senderAccount = (await executeQuery(getAccountSenderQuery)).recordset[0];
    let receiverAccount = (await executeQuery(getAccountRecieverQuery)).recordset[0];
   console.log(senderAccount,receiverAccount);
   
    
    if (!senderAccount || !receiverAccount) {
        throw new ApiError(400, "Sender or Reciever Account Not found");
    }
    let existingBalanceSender = senderAccount.balance;
    let existingBalanceReciever = receiverAccount.balance;
    if(existingBalanceSender < amount){
        throw new ApiError(400, "Dosnt Have sufficent balance for Transaction");
    }
    let amountToInsertSender =parseInt(existingBalanceSender - amount);
    let amountToInsertReciever =parseInt(existingBalanceReciever + amount);
    const transactionQuerySender = `INSERT INTO Transactions(accountID,transactionType,amount,balanceAfterTransaction) VAlUES('${senderAccount.accountID}','Sent', ${amountToInsertSender},${amountToInsertSender});`;
    const transactionQueryReciever = `INSERT INTO Transactions(accountID,transactionType,amount,balanceAfterTransaction) VAlUES('${receiverAccount.accountID}','Recieved', ${amountToInsertReciever},${amountToInsertReciever});`;
   
    const isTransactionSuccessSender = (await executeQuery(transactionQuerySender));
    const isTransactionSuccessReciever = (await executeQuery(transactionQueryReciever));
    
    if (!isTransactionSuccessSender.rowsAffected[0] || !isTransactionSuccessReciever.rowsAffected[0]) {
        throw new ApiError(400,"Transaction Failed!"); 
    }
    const updateAmountQuerySender = `UPDATE Account SET balance = ${amountToInsertSender} WHERE accountNumber = '${senderAccount.accountNumber}';`
    const updateAmountQueryReciever = `UPDATE Account SET balance = ${amountToInsertReciever} WHERE accountNumber = '${receiverAccount.accountNumber}';`
    try {
        let transactionUpdateSender = (await executeQuery(updateAmountQuerySender)).rowsAffected[0];
        let transactionUpdateReceiver = (await executeQuery(updateAmountQueryReciever)).rowsAffected[0];
        if (!transactionUpdateSender || !transactionUpdateReceiver) {
        throw new ApiError(400,"Transactions Failed! while updating amount"); 
        }
    } catch (error) {
        throw new ApiError(400,"Transactions Failed! Something went wrong"); 
        
    }

    const newAccountDetailsQuery = `SELECT Account.*,Transactions.transactionType FROM Account JOIN (SELECT * FROM Transactions WHERE accountID = '${senderAccount.accountID}') Transactions ON Account.balance = Transactions.amount;`
    const newAccountDetails = (await executeQuery(newAccountDetailsQuery)).recordset[0];
    if (!newAccountDetails) {
        throw new ApiError(400, "Cant fetch Details");
    }
    return response.json(new ApiResponse(200, newAccountDetails));
})
export {
    deposit,
    Withdrawal,
    sendMoney
}