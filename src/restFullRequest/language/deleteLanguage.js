import axios from 'axios';
import store from '../../redux/Store';

var deleteLanguage = function (idLanguage) {
  axios.delete('http://api.rumex.com/api/languages/' + idLanguage)
    .then(response => {
      store.dispatch({
        type: 'UPDATE_LANGUAGE_TABLE'
      });
    });
};

export default deleteLanguage;