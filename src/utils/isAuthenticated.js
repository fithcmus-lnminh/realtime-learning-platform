/* eslint-disable import/prefer-default-export */
export const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  return user && Object.keys(user).length > 0;
};
