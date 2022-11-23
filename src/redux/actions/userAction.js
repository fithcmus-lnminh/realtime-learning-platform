import { ApiResposeCodeNumber } from "../../constants/api";
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../../constants/userConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

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
export const loginUser =
  (userData, setLoading, setMessage, reset, navigate) => async (dispatch) => {
    try {
      const res = await $axios.post("/api/auth/login", userData);

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
        navigate("/");
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

/* eslint-disable import/prefer-default-export */
export const getCurrentUser = () => async (dispatch) => {
  try {
    const res = await $axios.get("/api/user/current_user");

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
export const logoutUser = (setLoading, navigate) => async (dispatch) => {
  try {
    const res = await $axios.post("/api/auth/logout");

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      dispatch({
        type: LOGOUT_SUCCESS
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  } catch (error) {
    setLoading(false);
  }
};

/* eslint-disable import/prefer-default-export */
export const updateProfile =
  (data, setLoading, setMessage, setShowPopup) => async (dispatch) => {
    setLoading(true);
    const res = await $axios.put("/api/account", toSnake(data));

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
