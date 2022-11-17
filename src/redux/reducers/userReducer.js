import { LOGIN_SUCCESS } from "../../constants/userConstants";

/* eslint-disable import/prefer-default-export */
export const userReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};
