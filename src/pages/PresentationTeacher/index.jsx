import React from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { BsPlayFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import "./PresentationTeacher.scss";

function PresentationTeacher() {
  const param = useParams();

  return (
    <div>
      <div className="presentation__header">
        <div className="presentation__header-left">
          <FiArrowLeft />
          <div className="presentation__header-title">
            <span>Presentation {param.id}</span>
            <span>Created by LNM</span>
          </div>
        </div>

        <div className="button__header">
          <button type="button" className="button__share">
            <FiShare2 /> Share
          </button>
          <button type="button" className="button__primary">
            <BsPlayFill /> Present
          </button>
        </div>
      </div>
      <div className="presentation__actions">
        <button type="button" className="button__primary">
          <AiOutlinePlus /> New Slide
        </button>
      </div>
    </div>
  );
}

export default PresentationTeacher;
