import axios from "axios";
import { toCamel } from "./normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

const Axios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
    return config;
  },
  (error) => {
    Promise.reject(error.response || error.message);
  }
);

Axios.interceptors.response.use(
  (response) => {
    const res = toCamel(response);
    return res.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      /* eslint-disable no-return-assign */
      return (window.location.href = "/login");
    }
    if (error.response?.status === 403) {
      /* eslint-disable no-return-assign */
      return (window.location.href = "/403");
    }

    return Promise.reject(error);
  }
);

export default Axios;
