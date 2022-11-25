import React, { useEffect } from "react";
import { getCurrentUser } from "../../redux/actions/userAction";

function GoogleLogin() {
  const redirect = localStorage.getItem("redirect");
  getCurrentUser();

  useEffect(() => {
    window.location.href = redirect;
  }, []);

  return <div style={{ display: "none" }}>Google Login Authentication</div>;
}

export default GoogleLogin;
