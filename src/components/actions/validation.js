function validate(langData, requiredField, reference){
  var validate = true,
    errors = [],
    codeArr = [],
    codeObj = {},
    nameValue = requiredField.value;
  langData.forEach((language) => {
    for (var propName in language){
      if(language[propName] === ''){  //проверяем на пустые поля в таблице перевода
        errors.push(propName);
      }
      if (propName === 'code'){
        codeArr.push(language['code']);
      }
    }
  });
  if(errors.length !== 0){
    reference.refs.messageErrorFieldEmpty.open(); //warning message
    validate = false;
  }
  codeArr.forEach((codeName) => {
    codeObj[codeName] = true;
  });
  if (langData.length !== Object.keys(codeObj).length){
    reference.refs.messageErrorDublicate.open(); //warning message
    validate = false;
  }
  console.log(requiredField.value);
  if(nameValue !== ''){
    requiredField.className = 'form-control';
  } else {
    requiredField.className = 'form-control danger';
    reference.refs.messageError.open(); //warning message
    validate = false;
  }
  return validate;
}
export {validate}