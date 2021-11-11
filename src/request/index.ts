import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: '/api/',
  timeout: 10000,
  headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === 401) {
    console.log(error.response.status)
    window.location.href = "/login";
  }
  return error
});

export default instance