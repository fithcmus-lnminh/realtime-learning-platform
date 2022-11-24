import { ApiResposeCodeNumber } from "../../constants/api";
import {
  GET_ALL_GROUPS_SUCCESS,
  GET_GROUP_USERS_SUCCESS
} from "../../constants/groupConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

/* eslint-disable import/prefer-default-export */
export const getAllGroups = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get("/api/group");

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setLoading) {
        setLoading(false);
      }
      dispatch({
        type: GET_ALL_GROUPS_SUCCESS,
        payload: {
          groups: res.data.groups,
          totalPages: res.data.totalPages
        }
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
export const getGroupUsers = (groupId, setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`/api/group/${groupId}/user`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setLoading) {
        setLoading(false);
      }
      dispatch({
        type: GET_GROUP_USERS_SUCCESS,
        payload: {
          groupUsers: res.data.groupUsers,
          totalPages: res.data.totalPages,
          totalUsers: res.data.totalUsers
        }
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
