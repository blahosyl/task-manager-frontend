import axios from "axios";

// URL of deployed API on Heroku
axios.defaults.baseURL =
  "https://pp5-task-manager-api-380974d293dd.herokuapp.com/";
// data contains text & images (multipart)
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
// prevent errors when sending cookies
axios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
