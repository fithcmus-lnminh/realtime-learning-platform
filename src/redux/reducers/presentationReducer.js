import {
  GET_ALL_PRESENTATIONS_SUCCESS,
  GET_PRESENTATION_GROUPS,
  GET_PRESENTATION_SUCCESS,
  SET_TOTAL_STUDENTS
} from "../../constants/presentationConstants";

const initialState = {
  presentations: [],
  presentationDetail: {},
  presentationGroups: [],
  totalStudents: 0
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
    case SET_TOTAL_STUDENTS:
      return {
        ...state,
        totalStudents: action.payload
      };
    case GET_PRESENTATION_GROUPS:
      return {
        ...state,
        presentationGroups: action.payload
      };
    default:
      return state;
  }
};
