const accountNumberGenerator = ()=> {
    let numbers = [0,1,2,3,4,5,6,7,8,9];
    let accountNumber = '';
    let randInt = 0;
    for (let i = 0; i < 16 ;i++) {
        randInt = parseInt((Math.random()  * 14) % numbers.length);
        if (randInt > numbers.length) {
            randInt = parseInt((Math.random()  * 14) % numbers.length)
        }
        accountNumber+= numbers[randInt];
    }
    
    
    return accountNumber;
};



export default accountNumberGenerator;