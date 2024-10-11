const generateOTP = () => {
    const optCharacters = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];
    let OtpCode = '';

    const generateRandomIndex = () => {
        const randomIndex = parseInt(Math.random() * optCharacters.length);
        if (randomIndex < 0 || randomIndex > 62) {
            randomIndex = 6;
        }
        return randomIndex;
    };
    for (let i = 0; i < 6; i++) {
        let index = generateRandomIndex();
        OtpCode += optCharacters[index];
    }
    
    return OtpCode;
    
};

export default generateOTP;
