function saveGridTranslation(reference, selectedRow, gridColumns){
  var value = '',
    validation = true;
  gridColumns.forEach((field) => {
    if (field !== 'body'){
      value = reference.refs[field].value;
    } else {
      value = reference.refs.body.$editor[0].innerHTML;
    }
    if (value !== '') {
      reference.refs.Grid.setcellvaluebyid(selectedRow, field, value);
      reference.refs[field].className = 'form-control';
    } else {
      validation = false;
      reference.refs[field].className = 'form-control danger';
    }
  });
  if (validation){
    reference.setState({modalIsOpen: false});
  } else {
    reference.refs.messageError.open(); //warning message
  }
}
export {saveGridTranslation}