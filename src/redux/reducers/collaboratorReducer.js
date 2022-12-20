import { GET_COLLABORATORS_SUCCESS } from "../../constants/collaborators";

const initialState = {
  collaborators: []
};

/* eslint-disable import/prefer-default-export */
export const collaboratorReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_COLLABORATORS_SUCCESS:
      return {
        ...state,
        collaborators: action.payload
      };
    default:
      return state;
  }
};
