import dayjs from 'dayjs';


const validateAge = (dateinput) => {

    
    let date = dateinput;
    const dateArr = date.split('-');
    let validYear = dateArr[0];
    let validMonth = parseInt(dateArr[1]) <= 12;
    let validDay = parseInt(dateArr[2]) <= 31;
    
    
    if (!validMonth || !validDay) return false;
    return true
    
};

const dateOfBirthValidator = (dateofbirth) => {
    const formatedDate = validateAge(dateofbirth)
    if (dateofbirth.length !== 'YYYY-MM-DD'.length) return 'INVALID-FORMAT';
    if (!formatedDate) return "INVALID-DATE";

    const birthDate = dayjs(dateofbirth,'YYYY-MM-DD').format('YYYY-MM-DD');
    
    const currentDate = dayjs();
    let years = parseInt(
        dayjs().diff(birthDate, currentDate) / (1000 * 60 * 60 * 24 * 365),
    );
    

    let age = {
        years: years,
        dateFormatForSQLSERVER: birthDate,
        isAboutEighteenYears: years >= 18,
    };
     return age;
    
};

export default dateOfBirthValidator;
