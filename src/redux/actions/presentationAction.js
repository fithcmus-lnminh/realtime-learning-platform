import { ApiResposeCodeNumber } from "../../constants/api";
import { GET_ALL_PRESENTATIONS_SUCCESS } from "../../constants/presentationConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getAllPresentations = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/presentation`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setLoading) {
        setLoading(false);
      }
      dispatch({
        type: GET_ALL_PRESENTATIONS_SUCCESS,
        payload: res.data.presentations
      });
    } else {
      /* eslint-disable no-lonely-if */
      if (setLoading) {
        setLoading(false);
      }
    }
  } catch (error) {
    if (setLoading) {
      setLoading(false);
    }
  }
};

/* eslint-disable import/prefer-default-export */
export const createPresentation =
  (data, handleClose, setLoading, reset, setMessage) => async (dispatch) => {
    try {
      const res = await $axios.post(
        `${API_URL}/api/presentation`,
        toSnake(data)
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Create presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };

/* eslint-disable import/prefer-default-export */
export const updatePresentation =
  (presentationId, data, handleClose, setLoading, reset, setMessage) =>
  async (dispatch) => {
    try {
      const res = await $axios.put(
        `${API_URL}/api/presentation/${presentationId}`,
        toSnake(data)
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Update presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };

/* eslint-disable import/prefer-default-export */
export const deletePresentation =
  (presentationId, handleClose, setLoading, setMessage) => async (dispatch) => {
    try {
      const res = await $axios.delete(
        `${API_URL}/api/presentation/${presentationId}`
      );

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        handleClose();
        if (setMessage) {
          setMessage({
            success: true,
            data: "Delete presentation successfully",
            open: true
          });
        }

        dispatch(getAllPresentations(setLoading));
      } else {
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: false,
            data: res.message,
            open: true
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      if (setLoading) {
        setLoading(false);
      }
      if (setMessage) {
        setMessage({
          success: false,
          data: error.message,
          open: true
        });
      }
    }
  };
