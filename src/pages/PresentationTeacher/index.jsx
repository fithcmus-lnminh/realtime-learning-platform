import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { BsPlayFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { BarChart, XAxis, YAxis, Bar, LabelList } from "recharts";
import "./PresentationTeacher.scss";
import { OutlinedInput } from "@mui/material";

const slides = [
  {
    id: Math.random(),
    type: "Multiple Choice",
    question: "",
    options: [
      { id: Math.random(), title: "Option 1", upvote: 0 },
      { id: Math.random(), title: "Option 2", upvote: 0 },
      { id: Math.random(), title: "Option 3", upvote: 0 }
    ],
    active: true
  },
  {
    id: Math.random(),
    type: "Multiple Choice",
    question: "Slide 2",
    options: [
      { id: Math.random(), title: "Option 4", upvote: 3 },
      { id: Math.random(), title: "Option 5", upvote: 4 },
      { id: Math.random(), title: "Option 6", upvote: 5 }
    ]
  }
];

function PresentationTeacher() {
  const param = useParams();

  const [currentSlide, setCurrentSlide] = useState(
    slides.filter((slide) => slide.active === true)[0]
  );

  const addOptionHandler = () => {
    setCurrentSlide({
      ...currentSlide,
      options: [
        ...currentSlide.options,
        { id: Math.random(), title: "", upvote: 0 }
      ]
    });
  };

  const onChangeOptionTitle = (e, option) => {
    setCurrentSlide({
      ...currentSlide,
      options: currentSlide.options.map((item) =>
        item.id === option.id ? { ...item, title: e.target.value } : item
      )
    });
  };

  const onChangeSlide = (slideId) => {
    const clickedSlide = slides.find((slide) => slide.id === slideId);

    setCurrentSlide(clickedSlide);
  };

  return (
    <div className="presentation__wrapper">
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
      <div className="presentation__main">
        <div className="presentation__slide-list">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`presentation__slide-content ${
                slide.id === currentSlide.id ? "presentation__slide-active" : ""
              }`}
              role="presentation"
              onClick={() => onChangeSlide(slide.id)}
            >
              <div className="presentation__slide-info">
                <span>{index + 1}</span>
                <BsPlayFill className="presentation__slide-icon" />
              </div>
              <div className="presentation__slide-item" />
            </div>
          ))}
        </div>
        <div className="presentation__content">
          <p className="presentation__content-header">
            Go to bla bla and enter code{" "}
            <span style={{ fontWeight: "bold" }}>1241 1212</span>
          </p>
          {currentSlide.type === "Multiple Choice" && (
            <div className="presentation__content-main">
              <h1 style={{ marginTop: 16, wordWrap: "anywhere" }}>
                {currentSlide.question || "Multiple Choice"}
              </h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BarChart
                  width={750}
                  height={350}
                  data={currentSlide.options}
                  barSize={90}
                  margin={{ top: 20 }}
                >
                  <XAxis dataKey="title" />
                  <YAxis tick={false} axisLine={false} />
                  <Bar dataKey="upvote" fill="#2a518f">
                    <LabelList dataKey="upvote" position="top" />
                  </Bar>
                </BarChart>
              </div>
            </div>
          )}
        </div>
        <div className="presentation__customize">
          <div style={{ marginBottom: "20px" }}>
            <p className="presentation__customize-label">Your question</p>
            <OutlinedInput
              placeholder="Enter your question"
              value={currentSlide.question}
              onChange={(e) => {
                setCurrentSlide({ ...currentSlide, question: e.target.value });
              }}
              fullWidth
            />
          </div>
          <div>
            <p className="presentation__customize-label">Options</p>
            {currentSlide.options?.map((option) => (
              <div className="presentation__customize-option" key={option.id}>
                <OutlinedInput
                  placeholder="Enter your option"
                  value={option.title}
                  fullWidth
                  onChange={(e) => onChangeOptionTitle(e, option)}
                  sx={{ mb: 1 }}
                />
                <MdClose
                  color="rgb(180, 181, 184)"
                  cursor="pointer"
                  onClick={() =>
                    setCurrentSlide({
                      ...currentSlide,
                      options: currentSlide.options.filter(
                        (item) => item.id !== option.id
                      )
                    })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="button__share button__add-option"
              onClick={addOptionHandler}
            >
              <AiOutlinePlus /> Add option
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresentationTeacher;
