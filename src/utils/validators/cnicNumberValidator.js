const validateCnicNumber = (cnumber) => {
    let cnicNumber = cnumber;

    if (cnicNumber.length !== 14) return false;

    for (let index = 0; index < cnicNumber.length; index++) {
        let character = cnicNumber[index];

        if (!(character.charCodeAt(0) >= 48 && character.charCodeAt(0) <= 57)) {
            return false;
        }
    }
    return true;
};

export default validateCnicNumber;
