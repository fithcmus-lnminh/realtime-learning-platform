import React from "react";
import { BsPerson } from "react-icons/bs";
import { useSelector } from "react-redux";
import "./Topbar.scss";

function Topbar() {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div className="topbar__container">
      <div className="topbar__content">
        <BsPerson className="topbar__icon" />
        <span>{`${userInfo?.firstName || ""} ${
          userInfo?.lastName || ""
        }`}</span>
        <span style={{ color: "#ccc" }}> | </span>
        <span>{`${userInfo?.email || ""}`}</span>
      </div>
      <div className="topbar__content">
        <BsPerson className="topbar__icon" />
        FAQ
      </div>
    </div>
  );
}

export default Topbar;
