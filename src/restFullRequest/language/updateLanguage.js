import axios from 'axios';
import store from '../../redux/Store';
import getLanguageDescriptInfo from './getLanguageDescriptInfo';

var updateLanguage = function (idLanguage, data) {
  axios.post('http://api.rumex.com/api/languages/createOrUpdate',
    {data: data}
  )
    .then(response => {
      if (response.status === 200) {
        store.dispatch({
          type: 'LANGUAGE_EDITED'
        });
        getLanguageDescriptInfo(idLanguage);

      } else {
        getLanguageDescriptInfo(idLanguage);
      }
    })
};

export default updateLanguage;