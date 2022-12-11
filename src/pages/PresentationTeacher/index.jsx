import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { BsPlayFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { SlChart } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { BarChart, XAxis, YAxis, Bar, LabelList } from "recharts";
import "./PresentationTeacher.scss";
import { Box, CircularProgress, OutlinedInput, Popover } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createMultipleChoiceSlide,
  createNewOption,
  deleteOption,
  getPresentationById,
  updateMultipleChoiceSlideQuestion,
  updateTitleOption
} from "../../redux/actions/presentationAction";

function PresentationTeacher() {
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { presentationDetail } = useSelector((state) => state.presentation);

  const [currentSlide, setCurrentSlide] = useState(
    presentationDetail?.slides?.filter((slide) => slide.active === true)[0]
  );

  const addOptionHandler = () => {
    dispatch(createNewOption(presentationDetail?.id, currentSlide?.content.id));
  };

  const onChangeOptionTitle = (e, option) => {
    setCurrentSlide({
      ...currentSlide,
      content: {
        ...currentSlide.content,
        options: currentSlide.content.options.map((item) =>
          item.id === option.id ? { ...item, content: e.target.value } : item
        )
      }
    });
    dispatch(
      updateTitleOption(
        presentationDetail?.id,
        currentSlide?.content.id,
        option.id,
        e.target.value
      )
    );
  };

  const onChangeSlide = (slideId) => {
    const clickedSlide = presentationDetail.slides.find(
      (slide) => slide.content.id === slideId
    );

    setCurrentSlide(clickedSlide);
  };

  const redirectToPresentation = () => {
    navigate("/presentations");
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const isOpenPopover = Boolean(anchorEl);
  const id = isOpenPopover ? "simple-popover" : undefined;

  const handleAddMultipleChoiceSlide = () => {
    dispatch(createMultipleChoiceSlide(param.id));

    setAnchorEl(null);
  };

  const getPresentationDetail = async () => {
    setLoading(true);
    await dispatch(getPresentationById(param.id));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getPresentationDetail();
  }, []);

  useEffect(() => {
    setCurrentSlide(
      presentationDetail?.slides?.filter((slide) => slide.active === true)[0]
    );
  }, [presentationDetail]);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress size={60} color="primary" />
        </Box>
      ) : (
        <div className="presentation__wrapper">
          <div className="presentation__header">
            <div className="presentation__header-left">
              <FiArrowLeft cursor="pointer" onClick={redirectToPresentation} />
              <div className="presentation__header-title">
                <span>{presentationDetail?.title}</span>
                <span>
                  Created by {presentationDetail?.user?.firstName}{" "}
                  {presentationDetail?.user?.lastName}
                </span>
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
            <button
              type="button"
              className="button__primary"
              onClick={handleOpenPopover}
            >
              <AiOutlinePlus /> New Slide
            </button>
            <Popover
              id={id}
              open={isOpenPopover}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
            >
              <div className="slide__create-popover">
                <p
                  style={{
                    marginBottom: "12px",
                    fontWeight: "bold",
                    fontSize: "18px"
                  }}
                >
                  Popular question types
                </p>
                <div
                  className="slide__card"
                  role="presentation"
                  onClick={handleAddMultipleChoiceSlide}
                >
                  <SlChart size={30} />
                  <p>Multiple Choice</p>
                </div>
              </div>
            </Popover>
          </div>
          <div className="presentation__main">
            <div className="presentation__slide-list">
              {presentationDetail?.slides?.map((slide, index) => (
                <div
                  key={slide.content.id}
                  className={`presentation__slide-content ${
                    slide.content.id === currentSlide?.content.id
                      ? "presentation__slide-active"
                      : ""
                  }`}
                  role="presentation"
                  onClick={() => onChangeSlide(slide.content.id)}
                >
                  <div className="presentation__slide-info">
                    <span>{index + 1}</span>
                    {slide.content.id === currentSlide?.content?.id && (
                      <BsPlayFill className="presentation__slide-icon" />
                    )}
                  </div>
                  <div className="presentation__slide-item">
                    {currentSlide?.slideType === "MultipleChoice" && (
                      <div className="presentation__slide-item-container">
                        <SlChart size={20} />
                        <p
                          style={{
                            color: "#000",
                            wordWrap: "anywhere",
                            padding: "0 4px"
                          }}
                        >
                          {slide.content.question || "Multiple Choice"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="presentation__content">
              <p className="presentation__content-header">
                Go to bla bla and enter code{" "}
                <span style={{ fontWeight: "bold" }}>
                  {presentationDetail?.accessCode}
                </span>
              </p>
              {currentSlide?.slideType === "MultipleChoice" && (
                <div className="presentation__content-main">
                  <h1 style={{ marginTop: 16, wordWrap: "anywhere" }}>
                    {currentSlide?.content.question || "Multiple Choice"}
                  </h1>
                  {currentSlide?.content?.options.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <BarChart
                        width={750}
                        height={350}
                        data={currentSlide?.content.options}
                        barSize={90}
                        margin={{ top: 20 }}
                      >
                        <XAxis dataKey="content" />
                        <YAxis tick={false} axisLine={false} />
                        <Bar dataKey="numUpvote" fill="#2a518f">
                          <LabelList dataKey="numUpvote" position="top" />
                        </Bar>
                      </BarChart>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="presentation__customize">
              {presentationDetail?.slides?.length > 0 && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <p className="presentation__customize-label">
                      Your question
                    </p>
                    <OutlinedInput
                      placeholder="Enter your question"
                      value={currentSlide?.content.question || ""}
                      onBlur={() => {
                        dispatch(
                          updateMultipleChoiceSlideQuestion(
                            presentationDetail?.id,
                            currentSlide?.content.id,
                            currentSlide?.content.question
                          )
                        );
                      }}
                      onChange={(e) => {
                        setCurrentSlide({
                          ...currentSlide,
                          content: {
                            ...currentSlide?.content,
                            question: e.target.value
                          }
                        });
                      }}
                      fullWidth
                    />
                  </div>
                  <div>
                    <p className="presentation__customize-label">Options</p>
                    {currentSlide?.content.options?.map((option) => (
                      <div
                        className="presentation__customize-option"
                        key={option.id}
                      >
                        <OutlinedInput
                          placeholder="Enter your option"
                          value={option.content}
                          fullWidth
                          onChange={(e) => onChangeOptionTitle(e, option)}
                          sx={{ mb: 1 }}
                        />
                        <MdClose
                          color="rgb(180, 181, 184)"
                          cursor="pointer"
                          onClick={() => {
                            setCurrentSlide({
                              ...currentSlide,
                              content: {
                                ...currentSlide?.content,
                                options: currentSlide.content.options.filter(
                                  (item) => item.id !== option.id
                                )
                              }
                            });
                            dispatch(
                              deleteOption(
                                presentationDetail?.id,
                                currentSlide?.content.id,
                                option.id
                              )
                            );
                          }}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PresentationTeacher;
