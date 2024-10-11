const nameValidator = (name) => {

    let isNameValid = false;
    for (let index = 0; index < name.length; index++) {
       
        let character = name[index];       
        character = character.charCodeAt(0);

        if (!((character >= 65 && character <= 90) || (character >= 97 && character <= 122) || character === 32))
        {
            isNameValid = true;
           
        }
        
    }
    return isNameValid;

}

export default nameValidator;