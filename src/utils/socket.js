import { io } from "socket.io-client";

const accessToken = localStorage.getItem("accessToken");

export const callbackSocket = (token = accessToken) => {
  return io(`${process.env.REACT_APP_SERVER_URL}/presentation`, {
    withCredentials: true,
    extraHeaders: {
      token
    }
  });
};

/* eslint-disable import/prefer-default-export */
export const socket = callbackSocket();
