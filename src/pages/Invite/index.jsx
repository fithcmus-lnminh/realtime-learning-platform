import React from "react";
import { Link, useParams } from "react-router-dom";
// import Topbar from "../Topbar";
import "./Invite.scss";

function Invite() {
  const params = useParams();

  console.log(params);

  return (
    <div className="invite__container">
      {/* <Topbar /> */}
      <div className="invite__card">
        <h2 className="invite__title">INVITATION TO JOIN THE GROUP</h2>
        <p className="invite__text">
          You are invited to join{" "}
          <span className="invite__highlight invite__text-bold">
            Group Name
          </span>{" "}
          owned by <span className="invite__highlight">Nhat Minh Le</span>.
        </p>

        <button type="button" className="invite__button">
          Join now!
        </button>
        <p className="invite__text">
          or{" "}
          <Link to="/" className="invite__back-link invite__highlight">
            back to home
          </Link>{" "}
          if you don&#39;t want to join this group.
        </p>
      </div>
    </div>
  );
}

export default Invite;
