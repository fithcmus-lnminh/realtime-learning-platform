import {
  GET_ALL_PRESENTATIONS_SUCCESS,
  GET_PRESENTATION_SUCCESS
} from "../../constants/presentationConstants";

const initialState = {
  presentations: [],
  presentationDetail: {}
};

/* eslint-disable import/prefer-default-export */
export const presentationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_ALL_PRESENTATIONS_SUCCESS:
      return {
        ...state,
        presentations: action.payload
      };
    case GET_PRESENTATION_SUCCESS:
      return {
        ...state,
        presentationDetail: action.payload
      };
    default:
      return state;
  }
};
