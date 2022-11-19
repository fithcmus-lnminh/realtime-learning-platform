import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../../constants/userConstants";

const initialState = {
  userInfo: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {}
};

/* eslint-disable import/prefer-default-export */
export const userReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload
      };
    case LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
};
