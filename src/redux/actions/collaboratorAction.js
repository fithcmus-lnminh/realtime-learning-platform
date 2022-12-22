import { ApiResposeCodeNumber } from "../../constants/api";
import { GET_COLLABORATORS_SUCCESS } from "../../constants/collaborators";
import $axios from "../../utils/axios";
import { toSnake } from "../../utils/normalizer";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getCollaborators =
  (presentationId, setLoading) => async (dispatch) => {
    try {
      if (setLoading) setLoading(true);
      const res = await $axios.get(
        `${API_URL}/api/presentation/${presentationId}/collaborator`
      );

      if (res.code === ApiResposeCodeNumber.Success) {
        dispatch({
          type: GET_COLLABORATORS_SUCCESS,
          payload: res.data
        });
        if (setLoading) setLoading(false);
      }
    } catch (err) {
      if (setLoading) setLoading(false);
      console.log(err.message);
    }
  };

/* eslint-disable import/prefer-default-export */
export const inviteCollaborator =
  (presentationId, email, setLoading, setMessage) => async () => {
    try {
      setLoading(true);
      const res = await $axios.post(
        `${API_URL}/api/presentation/${presentationId}/collaborator`,
        { email }
      );

      if (res.code === ApiResposeCodeNumber.Success) {
        setLoading(false);
        setMessage({
          success: true,
          message: `An email invitation to collaborate has been sent to ${email}`
        });
      } else {
        setLoading(false);
        setMessage({
          success: false,
          message: res.message
        });
      }

      setTimeout(() => {
        setMessage({
          success: false,
          message: ""
        });
      }, 6000);
    } catch (err) {
      console.log(err.message);
    }
  };

/* eslint-disable import/prefer-default-export */
export const verifyCollaborator =
  (token, setLoading, setMessage) => async () => {
    try {
      setLoading(true);
      const res = await $axios.post(`${API_URL}/api/collaborator/${token}`);

      if (res.code === ApiResposeCodeNumber.Success) {
        setLoading(false);
        setMessage({
          success: true,
          data: "Collaborate presentation successfully"
        });
      } else {
        setLoading(false);
        setMessage({
          success: false,
          data: res.message
        });
      }
    } catch (err) {
      setLoading(false);
      setMessage({
        success: false,
        data: err.message
      });
    }
  };

/* eslint-disable import/prefer-default-export */
export const removeCollaborator =
  (presentationId, userId) => async (dispatch) => {
    try {
      const res = await $axios.put(
        `${API_URL}/api/presentation/${presentationId}/collaborator/delete`,
        toSnake({ userId })
      );

      if (res.code === ApiResposeCodeNumber.Success) {
        dispatch(getCollaborators(presentationId));
      }
    } catch (err) {
      console.log(err.message);
    }
  };
