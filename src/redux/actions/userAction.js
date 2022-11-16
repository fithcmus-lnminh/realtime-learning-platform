import { ApiResposeCodeNumber } from "../../constants/api";
// import {
//   LOGIN_REQUEST,
//   LOGIN_FAIL,
//   LOGIN_SUCCESS,
//   REGISTER_USER_REQUEST,
//   REGISTER_USER_SUCCESS,
//   REGISTER_USER_FAIL
// } from "../../constants/userConstants";
import $axios from "../../utils/axios";

// Register
/* eslint-disable import/prefer-default-export */
export const registerUser =
  (userData, setLoading, setMessage, reset) => async () => {
    try {
      const res = await $axios.post("/api/auth/register", userData);

      if (res.code === ApiResposeCodeNumber.Success) {
        setLoading(false);
        setMessage({
          success: true,
          data: "An account activation link has been sent to your email"
        });
        reset();
      } else if (res.code === ApiResposeCodeNumber.Fail) {
        setLoading(false);
        setMessage({
          success: false,
          data: res.message
        });
      }
    } catch (error) {
      setLoading(false);
      setMessage({
        success: false,
        data: error.response.data.message
      });
    }
  };
/* eslint-disable import/prefer-default-export */
export const verifyUser = (token, setLoading, setMessage) => async () => {
  try {
    const res = await $axios.post(`/api/auth/verify/${token}`);

    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      setMessage({
        success: true,
        data: "Authentication successful"
      });
    } else if (res.code === ApiResposeCodeNumber.ErrorCodeByServer) {
      setLoading(false);
      setMessage({
        success: false,
        data: res.message
      });
    }
  } catch (error) {
    setLoading(false);
    setMessage({
      success: false,
      data: error.response.data.message
    });
  }
};
