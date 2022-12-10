import { ApiResposeCodeNumber } from "../../constants/api";
import {
  GET_ALL_PRESENTATIONS_SUCCESS
  // GET_PRESENTATION_SUCCESS
} from "../../constants/presentationConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getAllPresentations = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/presentation`);
    console.log("res:", res);

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
      console.log("res createPresentation:", res);

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        if (setLoading) {
          setLoading(false);
        }
        if (setMessage) {
          setMessage({
            success: true,
            data: "Create presentation successfully",
            open: true
          });
        }

        setTimeout(() => {
          dispatch(getAllPresentations());
        }, 1000);
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
