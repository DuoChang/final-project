import axios from 'axios';

export default {
  fetchUser(){
    return axios.get('https://g777708.com/checktoken/checkmasterexpire/api/userprofile/master')
      .then(res =&gt; res.data)
      .catch(error =&gt; console.log(error));
  }

}