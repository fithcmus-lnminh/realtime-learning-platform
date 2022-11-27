import { ApiResposeCodeNumber } from "../../constants/api";
import {
  GET_ALL_GROUPS_SUCCESS,
  GET_GROUP_SUCCESS,
  GET_GROUP_USERS_SUCCESS
} from "../../constants/groupConstants";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getAllGroups = (setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/group`);

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
export const getGroup = (groupId, setLoading) => async (dispatch) => {
  try {
    const res = await $axios.get(`${API_URL}/api/group/${groupId}`);

    if (res.code === ApiResposeCodeNumber.Success) {
      if (setLoading) {
        setLoading(false);
      }
      dispatch({
        type: GET_GROUP_SUCCESS,
        payload: res.data
      });
    } else {
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
    const res = await $axios.get(`${API_URL}/api/group/${groupId}/user`);

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
      const res = await $axios.post(`${API_URL}/api/group`, toSnake(data));

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
            data: "Create group successfully",
            open: true
          });
        }

        setTimeout(() => {
          dispatch(getAllGroups());
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

/* eslint-disable import/prefer-default-export */
export const updateGroup =
  (groupId, data, handleClose, setLoading, reset, setMessage) =>
  async (dispatch) => {
    try {
      const res = await $axios.put(
        `${API_URL}/api/group/${groupId}`,
        toSnake(data)
      );

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
            data: "Update group successfully",
            open: true
          });
        }

        dispatch(getGroup(groupId));
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
export const deleteGroup = (groupId, setMessage) => async (dispatch) => {
  try {
    const res = await $axios.delete(`${API_URL}/api/group/${groupId}`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setMessage) {
        setMessage({
          success: true,
          data: "Delete group successfully",
          open: true
        });
      }
      setTimeout(() => {
        dispatch(getAllGroups());
      }, 1000);
      window.location.href = "/groups";
    } else {
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
export const leaveGroup = (groupId, setMessage) => async (dispatch) => {
  try {
    const res = await $axios.post(`${API_URL}/api/group/${groupId}/leave`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      if (setMessage) {
        setMessage({
          success: true,
          data: "Leave group successfully",
          open: true
        });
      }
      setTimeout(() => {
        dispatch(getAllGroups());
      }, 1000);
      window.location.href = "/groups";
    } else {
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
export const inviteGroup =
  (groupId, data, handleClose, setLoading, reset, setMessage) =>
  async (dispatch) => {
    try {
      const res = await $axios.post(
        `${API_URL}/api/group/${groupId}/invite`,
        toSnake(data)
      );

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
            data: `An invitation link to join the group has been sent to ${
              data?.email || "this email"
            }`,
            open: true
          });
        }

        setTimeout(() => {
          dispatch(getAllGroups());
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

/* eslint-disable import/prefer-default-export */
export const joinGroup = (groupId, setLoading, setMessage) => async () => {
  try {
    setLoading(true);
    const res = await $axios.post(`${API_URL}/api/group/${groupId}/join`);

    /* eslint-disable prefer-destructuring */
    if (res.code === ApiResposeCodeNumber.Success) {
      setLoading(false);
      setMessage({ success: true, message: "Join group successfully" });
    } else {
      setLoading(false);
      setMessage({ success: false, message: res.message });
    }
  } catch (error) {
    setLoading(false);
    setMessage({ success: false, message: "Internal error" });
  }
};

/* eslint-disable import/prefer-default-export */
export const getGroupByIdNoAuth = (groupId) => async () => {
  const res = await $axios.get(`${API_URL}/api/group/${groupId}`);

  if (res.code === ApiResposeCodeNumber.Success) {
    return res.data;
  }

  return null;
};
