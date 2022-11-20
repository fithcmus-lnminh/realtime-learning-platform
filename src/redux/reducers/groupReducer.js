import { GET_ALL_GROUPS_SUCCESS } from "../../constants/groupConstants";

const initialState = {
  groups: [],
  groupDetail: {},
  totalPages: 1
};

/* eslint-disable import/prefer-default-export */
export const groupReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_ALL_GROUPS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
