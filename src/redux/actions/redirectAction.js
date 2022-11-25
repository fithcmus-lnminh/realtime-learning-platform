import {
  RESET_REDIRECT_ROUTE,
  UPDATE_REDIRECT_ROUTE
} from "../../constants/common";

export const updateRedirect = (route) => async (dispatch) => {
  dispatch({
    type: UPDATE_REDIRECT_ROUTE,
    payload: route
  });
  localStorage.setItem("redirect", route);
};

export const resetRedirect = () => async (dispatch) => {
  dispatch({
    type: RESET_REDIRECT_ROUTE
  });
  localStorage.removeItem("redirect");
};
