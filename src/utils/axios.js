import axios from "axios";
import { toCamel } from "./normalizer";

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/...";

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
    console.log(error);
  }
);

export default Axios;
