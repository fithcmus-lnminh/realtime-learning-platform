import { ApiResposeCodeNumber } from "../../constants/api";
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../../constants/userConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const registerUser =
  (userData, setLoading, setMessage, reset) => async () => {
    try {
      const res = await $axios.post(`${API_URL}/api/auth/register`, userData);

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
export const loginUser =
  (userData, setLoading, setMessage, reset, navigate, redirect) =>
  async (dispatch) => {
    try {
      const res = await $axios.post(`${API_URL}/api/auth/login`, userData);

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        setLoading(false);
        setMessage({
          success: true,
          data: "Login successful"
        });
        reset();
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = redirect ?? "/";
      } else {
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
        data: error.message
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const verifyUser = (token, setLoading, setMessage) => async () => {
  try {
    const res = await $axios.post(`${API_URL}/api/auth/verify/${token}`);

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

/* eslint-disable import/prefer-default-export */
export const getCurrentUser = () => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/user/current_user`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      localStorage.setItem("user", JSON.stringify(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

/* eslint-disable import/prefer-default-export */
export const logoutUser = () => async (dispatch) => {
  try {
    const res = await $axios.post(`${API_URL}/api/auth/logout`);
    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      dispatch({
        type: LOGOUT_SUCCESS
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("redirect");
      window.location.href = "/login";
    }
  } catch (error) {
    console.log(error);
  }
};

/* eslint-disable import/prefer-default-export */
export const updateProfile =
  (data, setLoading, setMessage, setShowPopup) => async (dispatch) => {
    setLoading(true);
    const res = await $axios.put(`${API_URL}/api/account`, toSnake(data));

    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      setMessage({ success: true, data: "Edit name successfully", open: true });
      setShowPopup(false);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    } else if (res.code === ApiResposeCodeNumber.ErrorCodeByServer) {
      setLoading(false);
      setMessage({
        success: false,
        data: res.message,
        open: true
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const changeUserPassword =
  (data, setLoading, setMessage, setShowPopup) => async (dispatch) => {
    setLoading(true);
    const res = await $axios.put(
      `${API_URL}/api/account/password`,
      toSnake(data)
    );

    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      setMessage({
        success: true,
        data: "Change password successfully. You will be signed out in 5 seconds",
        open: true
      });
      setShowPopup(false);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setTimeout(() => {
        dispatch(logoutUser());
      }, 5000);
    } else if (res.code === ApiResposeCodeNumber.ValidationError) {
      setLoading(false);
      setMessage({
        success: false,
        data: res.message,
        open: true
      });
    }
  };
