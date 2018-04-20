import axios from 'axios';

var createContent = function (data) {
  axios.post('http://api.rumex.com/api/contents/createOrUpdate',
    {data: data}
  )
    .then(response => {
      if (response.status === 200) {
          window.location ='/content/update/' + response.data.data.id;
      }
    });
};

export default createContent;