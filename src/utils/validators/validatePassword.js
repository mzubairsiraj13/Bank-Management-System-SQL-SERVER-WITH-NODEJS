import ApiError from '../ApiError.js';

const passwordValidator = (pass) => {
    let password = pass;
    if (password.length < 8) {
        throw new ApiError(400, 'Password must be aleast 8 character!');
    }

    let isPasswordStrong = true;
    let isContainingCapital = false;
    let isContainingSpecialCharacter = false;
    let isContainingNumber = false;

    const specialChars = `!@#$%^&*()-_=+[]{}|;:'",.<>/?~\ `;
    const numbers = '0123456789';

    for (let index = 0; index < password.length; index++) {
        let character = password[index];

        if (character.charCodeAt(0) >= 65 && character.charCodeAt(0) <= 90) {
            isContainingCapital = true;
        }
        if (specialChars.includes(character)) {
            isContainingSpecialCharacter = true;
        }
        if (numbers.includes(character)) {
            isContainingNumber = true;
        }
    }

    if (
        !isContainingCapital ||
        !isContainingSpecialCharacter ||
        !isContainingNumber
    ) {
        isPasswordStrong = false;
    }
    return isPasswordStrong;
};

export default passwordValidator;
