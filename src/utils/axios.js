import axios from "axios";
import keysToCamel from "./toCamel";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/...";

const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json"
  }
});

Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      /* eslint-disable no-param-reassign */
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(config.headers);
    return config;
  },
  (error) => {
    Promise.reject(error.response || error.message);
  }
);

Axios.interceptors.response.use(
  (response) => {
    const res = keysToCamel(response);
    return res.data;
  },
  (error) => {
    console.log(error);
  }
);

export default Axios;
