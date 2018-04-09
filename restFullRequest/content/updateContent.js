import axios from 'axios';
import store from '../../redux/Store';
import getContentDescriptInfo from './getContentDescriptInfo';

var updateContent = function (idContent, data) {
  axios.post('http://api.rumex.com/api/contents/createOrUpdate',
    {data: data}
  )
    .then(response => {
      if (response.status === 200) {
        store.dispatch({
          type: 'CONTENT_EDITED'
        });
        getContentDescriptInfo(idContent);

      } else {
        getContentDescriptInfo(idContent);
      }
    })
};

export default updateContent;