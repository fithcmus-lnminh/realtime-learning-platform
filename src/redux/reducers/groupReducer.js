import {
  GET_ALL_GROUPS_SUCCESS,
  GET_GROUP_SUCCESS,
  GET_GROUP_USERS_SUCCESS
} from "../../constants/groupConstants";

const initialState = {
  groups: [],
  groupDetail: {},
  groupUsers: [],
  total_pages: 1,
  total_groups: 1,
  totalDetailPages: 1,
  totalUsers: 1
};

/* eslint-disable import/prefer-default-export */
export const groupReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_ALL_GROUPS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case GET_GROUP_SUCCESS:
      return {
        ...state,
        groupDetail: action.payload
      };
    case GET_GROUP_USERS_SUCCESS:
      return {
        ...state,
        groupUsers: action.payload.groupUsers,
        totalUsers: action.payload.totalUsers,
        totalDetailPages: action.payload.totalPages
      };
    default:
      return state;
  }
};
