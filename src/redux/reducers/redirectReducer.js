import {
  UPDATE_REDIRECT_ROUTE,
  RESET_REDIRECT_ROUTE
} from "../../constants/common";

const initialState = {
  redirect: "/"
};

/* eslint-disable import/prefer-default-export */
export const redirectReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_REDIRECT_ROUTE:
      return {
        ...state,
        redirect: action.payload
      };
    case RESET_REDIRECT_ROUTE:
      return { ...state, redirect: "/" };
    default:
      return state;
  }
};
