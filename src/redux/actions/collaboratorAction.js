import { ApiResposeCodeNumber } from "../../constants/api";
import { GET_COLLABORATORS_SUCCESS } from "../../constants/collaborators";
import $axios from "../../utils/axios";

const API_URL = process.env.REACT_APP_SERVER_URL;

/* eslint-disable import/prefer-default-export */
export const getCollaborators =
  (presentationId, setLoading) => async (dispatch) => {
    try {
      setLoading(true);
      const res = await $axios.get(
        `${API_URL}/api/presentation/${presentationId}/collaborator`
      );

      if (res.code === ApiResposeCodeNumber.Success) {
        dispatch({
          type: GET_COLLABORATORS_SUCCESS,
          payload: res.data
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

/* eslint-disable import/prefer-default-export */
export const inviteCollaborator = (presentationId, email) => async () => {
  try {
    const res = await $axios.post(
      `${API_URL}/api/presentation/${presentationId}/collaborator`,
      { email }
    );

    console.log(res);

    if (res.code === ApiResposeCodeNumber.Success) {
      console.log(res);
    }
  } catch (err) {
    console.log(err.message);
  }
};
