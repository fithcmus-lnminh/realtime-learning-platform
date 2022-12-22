import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyCollaborator } from "../../redux/actions/collaboratorAction";
import { logoutUser } from "../../redux/actions/userAction";
import { isAuthenticated } from "../../utils/isAuthenticated";
import "./VerifyCollaborator.scss";

function VerifyCollaborator() {
  const param = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ success: true, data: "" });

  const verify = () => {
    dispatch(verifyCollaborator(param.token, setLoading, setMessage));

    setTimeout(() => {
      if (isAuthenticated()) dispatch(logoutUser());
      else window.location.href = "/login";
    }, 3000);
  };

  useEffect(() => {
    document.title = "Collaborate Presentation - RLP";
    verify();
  }, []);

  return (
    <div className="verify">
      {loading ? (
        <div className="verify__loading" />
      ) : (
        <div>
          <p
            className={`verify__message ${
              message.success
                ? "verify__message-success"
                : "verify__message-failure"
            }`}
          >
            {message.data}
          </p>
          <p style={{ marginTop: "12px" }}>Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}

export default VerifyCollaborator;
