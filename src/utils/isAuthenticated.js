import store from "../redux/store";

/* eslint-disable import/prefer-default-export */
export const isAuthenticated = () => {
  const user = store.getState().user?.userInfo;
  return user && Object.keys(user).length > 0;
};
