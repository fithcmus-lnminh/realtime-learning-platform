import React from "react";
import { FaPen } from "react-icons/fa";
import "./BtnEdit.scss";

function BtnEdit() {
  return (
    <button type="button" className="button__edit">
      <FaPen className="icon__edit" />
    </button>
  );
}

export default BtnEdit;
