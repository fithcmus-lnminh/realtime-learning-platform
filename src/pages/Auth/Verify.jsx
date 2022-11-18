import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { verifyUser } from "../../redux/actions/userAction";
import "./Auth.scss";

/* eslint-disable react/function-component-definition */
const Verify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ success: true, data: "" });

  const onClickNavigate = () => {
    navigate("/login");
  };

  const verifyAccount = () => {
    setLoading(true);
    if (params.token === "google-login-error") {
      setLoading(false);
      setMessage({
        success: false,
        data: "Can't login with Google. This issue happens due to internal error or you have previously signed up with a different signin method."
      });
    } else dispatch(verifyUser(params.token, setLoading, setMessage));
  };

  useEffect(() => {
    document.title = "Verify Page";
    verifyAccount();
  }, []);

  return (
    <div className="verify">
      {loading ? (
        <div className="verify__loading" />
      ) : (
        <p
          className={`verify__message ${
            message.success
              ? "verify__message-success"
              : "verify__message-failure"
          }`}
        >
          {message.data}
        </p>
      )}
      <button
        type="button"
        className="verify__button"
        onClick={onClickNavigate}
        disabled={loading}
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default Verify;
