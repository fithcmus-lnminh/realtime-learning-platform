import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../redux/actions/userAction";

function GoogleLogin() {
  const redirect = localStorage.getItem("redirect");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  dispatch(getCurrentUser());

  useEffect(() => {
    navigate(redirect ?? "/");
  }, []);

  return <div style={{ display: "none" }}>Google Login Authentication</div>;
}

export default GoogleLogin;
