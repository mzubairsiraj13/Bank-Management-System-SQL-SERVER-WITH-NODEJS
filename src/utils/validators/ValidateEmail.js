const emailValidator = (email = '') => {
    let userEmail = email;
    
    if (!userEmail.includes('@')) return false;
    userEmail = email.split('@');
    
    
    

    let emailUserIdentifier = userEmail[0];
    let emailDomain = userEmail[1];
    

    if (emailUserIdentifier.length === 0 || emailDomain.length === 0) return false;
    if (!emailDomain.includes('.')) return false;


    emailDomain = emailDomain.split('.');
    



    let subDomain = emailDomain[0];
    let topLevelDomain = emailDomain[1];
     


    if (subDomain.length === 0 || topLevelDomain.length === 0) return false;


    return true
};

export default emailValidator;
