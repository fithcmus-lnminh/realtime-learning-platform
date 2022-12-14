import { io } from "socket.io-client";

const accessToken = localStorage.getItem("accessToken");

/* eslint-disable import/prefer-default-export */
export const socket = (token = accessToken) => {
  return io(`${process.env.REACT_APP_SERVER_URL}/presentation`, {
    withCredentials: true,
    extraHeaders: {
      token
    }
  });
};
