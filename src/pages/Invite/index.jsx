import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  resetRedirect,
  updateRedirect
} from "../../redux/actions/redirectAction";
import { isAuthenticated } from "../../utils/isAuthenticated";
import "./Invite.scss";

function Invite() {
  const params = useParams();
  const isJoined = false;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetRedirectHandler = () => {
    dispatch(resetRedirect());
  };

  const joinGroupHandler = () => {
    if (isAuthenticated()) {
      // handle join
    } else {
      dispatch(updateRedirect(`/invite/${params.groupId}`));
      navigate("/login");
    }
  };

  return (
    <div className="invite__container">
      <div className="invite__card">
        <h2 className="invite__title">INVITATION TO JOIN THE GROUP</h2>
        {isJoined ? (
          <p className="invite__text invite__highlight invite__text-bold">
            You have already joined this group
          </p>
        ) : (
          <p className="invite__text ">
            You are invited to join{" "}
            <span className="invite__highlight invite__text-bold">
              Group Name
            </span>{" "}
            owned by <span className="invite__highlight">Nhat Minh Le</span>.
          </p>
        )}

        {isJoined ? (
          <button type="button" className="invite__button">
            GO TO THE GROUP
          </button>
        ) : (
          <button
            type="button"
            className="invite__button"
            onClick={joinGroupHandler}
          >
            Join now
          </button>
        )}

        {!isJoined && (
          <p className="invite__text">
            or{" "}
            {isAuthenticated() ? (
              <a href="/" className="invite__back-link invite__highlight">
                back to home
              </a>
            ) : (
              <a
                href="/login"
                className="invite__back-link invite__highlight"
                onClick={resetRedirectHandler}
              >
                back to login page
              </a>
            )}{" "}
            if you don&#39;t want to join this group.
          </p>
        )}
      </div>
    </div>
  );
}

export default Invite;
