const AccountTypeValidator = (AccountType)=> {
    const AccountTypeEnum = {
        CURRENT : 'Current',
        SAVINGS: 'Savings',
        BUSINESS: 'Business',
        FREELANCE: 'Freelance' 
    }
    
   if(Object.keys(AccountTypeEnum).includes(AccountType)){
    switch (AccountType) {
        case 'CURRENT':
            AccountType = AccountTypeEnum.CURRENT
            break;
        case 'SAVINGS':
            AccountType = AccountTypeEnum.SAVINGS
            break;
        case 'BUSINESS':
            AccountType = AccountTypeEnum.BUSINESS
            break;
        case 'FREELANCE':
            AccountType = AccountTypeEnum.FREELANCE
            break;
    }
    return AccountType;
   }
   else{
   return undefined
   }
}

export default AccountTypeValidator;