import React from "react";
import { FaPen } from "react-icons/fa";
import "./BtnEdit.scss";

function BtnEdit(prop) {
  const { onClick } = prop;

  return (
    <button type="button" className="button__edit" onClick={onClick}>
      <FaPen className="icon__edit" />
    </button>
  );
}

export default BtnEdit;
