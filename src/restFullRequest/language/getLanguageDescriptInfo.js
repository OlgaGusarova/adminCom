import axios from 'axios';
import store from '../../redux/Store';

var getLanguageDescriptInfo = function(data) {

    var url = 'http://api.rumex.com/api/languages/' + data;
    
    axios.get(url)
      .then(response=> {
        store.dispatch({
          type: 'LANGUAGE_FIELDS_GET',
          fullData: response.data,
          code: response.data.code ? response.data.code : '',
          is_default: response.data.is_default,
          is_mini_site: response.data.is_mini_site,
          mini_site_main_content_id: response.data.mini_site_main_content_id ? response.data.mini_site_main_content_id : '',
          translations: response.data.translations
        });
    });

};
export default getLanguageDescriptInfo;
