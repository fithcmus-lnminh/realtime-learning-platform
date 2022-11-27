import React, { useState } from "react";
import "./Sidebar.scss";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineTeam } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import kahoot from "../../assets/images/logo.png";
import { logoutUser } from "../../redux/actions/userAction";

function Sidebar(prop) {
  const { itemId } = prop;
  const [itemActive, setItemActive] = useState(itemId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  const activeHandler = (id) => {
    setItemActive(id);
    switch (id) {
      case 1:
        navigate("/");
        break;
      case 2:
        navigate("/groups");
        break;
      case 3:
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  return (
    <div className="sidebar__container">
      <div className="sidebar__logo">
        <img src={kahoot} alt="logo" />
      </div>
      <div className="sidebar__menu">
        <div
          role="presentation"
          className={`sidebar__item ${
            itemActive === 1 ? "sidebar__item-active" : ""
          }`}
          onClick={() => {
            activeHandler(1);
          }}
        >
          <AiOutlineHome className="sidebar__icon" />
          <span>HOME</span>
        </div>
        <div
          role="presentation"
          className={`sidebar__item ${
            itemActive === 2 ? "sidebar__item-active" : ""
          }`}
          onClick={() => {
            activeHandler(2);
          }}
        >
          <AiOutlineTeam className="sidebar__icon" />
          <span>MY GROUPS</span>
        </div>
        <div
          role="presentation"
          className={`sidebar__item ${
            itemActive === 3 ? "sidebar__item-active" : ""
          }`}
          onClick={() => {
            activeHandler(3);
          }}
        >
          <BsPerson className="sidebar__icon" />
          <span>MY ACCOUNT</span>
        </div>
      </div>
      <button type="button" className="button__logout" onClick={logoutHandler}>
        <CiLogout />
        <span>Log Out</span>
      </button>
    </div>
  );
}

export default Sidebar;
