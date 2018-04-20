import axios from 'axios';

var createLanguage = function (data) {
  axios.post('http://api.rumex.com/api/languages/createOrUpdate',
    {data: data}
  )
    .then(response => {
      if (response.status === 200) {
          window.location ='/language/update/' + response.data.data.id;
      }
    });
};

export default createLanguage;