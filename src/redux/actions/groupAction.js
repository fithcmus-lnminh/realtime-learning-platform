import { ApiResposeCodeNumber } from "../../constants/api";
import { GET_ALL_GROUPS_SUCCESS } from "../../constants/groupConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

/* eslint-disable import/prefer-default-export */
export const getAllGroups = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get("/api/group");

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      dispatch({
        type: GET_ALL_GROUPS_SUCCESS,
        payload: {
          groups: res.data.groups,
          totalPages: res.data.totalPages
        }
      });
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

/* eslint-disable import/prefer-default-export */
export const createGroup =
  (data, handleClose, setLoading, reset, setMessage) => async (dispatch) => {
    try {
      const res = await $axios.post("/api/group", toSnake(data));

      /* eslint-disable prefer-destructuring */
      if (res.code === ApiResposeCodeNumber.Success) {
        reset();
        handleClose();
        setLoading(false);
        setMessage({
          success: true,
          data: "Create a successful group",
          open: true
        });

        // console.log("getState:", getState);

        // dispatch({
        //   type: GET_ALL_GROUPS_SUCCESS,
        //   payload: {
        //     groups: res.data.groups,
        //     totalPages: res.data.totalPages
        //   }
        // });
        dispatch(getAllGroups());
      } else {
        setLoading(false);
        setMessage({
          success: false,
          data: res.message,
          open: true
        });
      }
    } catch (error) {
      console.log("error:", error);
      setLoading(false);
      setMessage({
        success: false,
        data: error.message,
        open: true
      });
    }
  };
