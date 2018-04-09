import axios from 'axios';
import store from '../../redux/Store';

var getContentDescriptInfo = function (data) {

  var url = 'http://api.rumex.com/api/contents/' + data;

  axios.get(url)
    .then(response => {
      store.dispatch({
        type: 'CONTENT_FIELDS_GET',
        fullData: response.data,
        inner_name: response.data.inner_name ? response.data.inner_name : '',
        active: response.data.active,
        translations: response.data.translations
      });
    });
};
export default getContentDescriptInfo;
