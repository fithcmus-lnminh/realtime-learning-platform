import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import {
  BsPlayFill,
  BsPersonCircle,
  BsPeople,
  BsCardHeading,
  BsTextParagraph
} from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { SlChart } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { GrLineChart } from "react-icons/gr";
import { BarChart, XAxis, YAxis, Bar, LabelList } from "recharts";
import "./PresentationTeacher.scss";
import {
  Badge,
  Box,
  CircularProgress,
  OutlinedInput,
  Popover,
  Typography,
  Modal as MUIModal,
  Avatar,
  TextareaAutosize,
  Button,
  FormHelperText
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import {
  createHeadingSlide,
  createMultipleChoiceSlide,
  createNewOption,
  createParagraphSlide,
  deleteHeadingSlide,
  deleteMultipleChoiceSlide,
  deleteOption,
  deleteParagraphSlide,
  getPresentationById,
  setTotalStudents,
  updateHeadingHeading,
  updateHeadingParagraph,
  updateMultipleChoiceSlideQuestion,
  updateParagraphParagraph,
  updateSubHeadingHeading,
  updateTitleOption
} from "../../redux/actions/presentationAction";
import { stringAvatar } from "../../utils/stringAvatar";
import Modal from "../../components/Modal";
import {
  getCollaborators,
  inviteCollaborator,
  removeCollaborator
} from "../../redux/actions/collaboratorAction";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "#fff",
  border: "none",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
  maxHeight: "750px",
  overflowY: "scroll"
};

const schema = yup
  .object({
    collabEmail: yup.string().email("Please enter valid email address")
  })
  .required();

function PresentationTeacher() {
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCollaborator, setLoadingCollaborator] = useState(false);
  const [totalStudent, setTotalStudent] = useState(0);
  const [open, setOpenModal] = useState(false);
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [isOpenResultModal, setOpenResultModal] = useState(false);
  const [isOpenRemoveCollabModal, setIsOpenRemoveCollabModal] = useState(false);
  const [inviteCollabMessage, setInviteCollabMessage] = useState({
    success: false,
    message: ""
  });
  const [isShowResults, setIsShowResults] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues: {
      collabEmail: ""
    },
    resolver: yupResolver(schema)
  });

  const { presentationDetail } = useSelector((state) => state.presentation);
  const { collaborators } = useSelector((state) => state.collaborator);

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

  const handleAddHeadingSlide = () => {
    dispatch(createHeadingSlide(param.id));

    setAnchorEl(null);
  };

  const handleAddParagraphSlide = () => {
    dispatch(createParagraphSlide(param.id));

    setAnchorEl(null);
  };

  const getPresentationDetail = async () => {
    setLoading(true);
    await dispatch(getPresentationById(param.id));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const presentPresentation = () => {
    navigate(`/presentation/${presentationDetail.id}/present`);
  };

  const handleDeleteSlide = (preId, slideId) => {
    switch (currentSlide.slideType) {
      case "MultipleChoice":
        dispatch(deleteMultipleChoiceSlide(preId, slideId));
        break;
      case "Heading":
        dispatch(deleteHeadingSlide(preId, slideId));
        break;
      case "Paragraph":
        dispatch(deleteParagraphSlide(preId, slideId));
        break;
      default:
        break;
    }
  };

  const addCollabHandler = (data) => {
    dispatch(
      inviteCollaborator(
        presentationDetail?.id,
        data.collabEmail,
        setLoadingCollaborator,
        setInviteCollabMessage
      )
    );

    reset();
  };

  useEffect(() => {
    getPresentationDetail();
  }, []);

  useEffect(() => {
    if (presentationDetail.id) {
      dispatch(
        getCollaborators(presentationDetail?.id, setLoadingCollaborator)
      );
    }
  }, [presentationDetail.id]);

  useEffect(() => {
    if (presentationDetail?.slides) {
      setCurrentSlide(
        presentationDetail.slides.filter((slide) => slide.active === true)[0]
      );
      setIsShowResults(false);
      let isShow = false;
      presentationDetail.slides.forEach((slide) => {
        slide.content.options?.forEach((opt) => {
          if (opt.upvotes.length > 0) {
            isShow = true;
            return true;
          }
          return false;
        });
      });
      if (isShow) setIsShowResults(true);
    }
  }, [presentationDetail.slides]);

  useEffect(() => {
    if (presentationDetail?.accessCode) {
      socket.emit(
        "teacher-join-presentation",
        { access_code: presentationDetail?.accessCode },
        (data) => {
          console.log(data);
        }
      );
      socket.on("get-total-students", (data) => {
        dispatch(setTotalStudents(data.total_users));
        setTotalStudent(data.total_users);
      });
    }
  }, [presentationDetail.accessCode]);

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
              <button
                type="button"
                className="button__share"
                onClick={() => setIsOpenShareModal(true)}
              >
                <FiShare2 /> Collaborators
              </button>
              <MUIModal
                open={isOpenShareModal}
                onClose={() => setIsOpenShareModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Collaborators
                  </Typography>
                  <div className="presentation__collaborator">
                    <Typography
                      id="modal-modal-description"
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}
                    >
                      <BsPeople size={20} />
                      <span>
                        Following people have access to{" "}
                        <span style={{ fontWeight: "bold" }}>edit</span> this
                        presentation.
                      </span>
                    </Typography>
                    {collaborators?.map((collab) =>
                      collab.role === "Owner" ? (
                        <div
                          className="presentation__collaborator-item"
                          key={collab?.userId.id}
                        >
                          <Avatar
                            /* eslint-disable react/jsx-props-no-spreading */
                            {...stringAvatar(
                              `${collab.userId?.firstName} ${collab.userId?.lastName}`
                            )}
                          />
                          <div>
                            <p style={{ fontWeight: "bold" }}>
                              {`${collab.userId?.firstName} ${collab.userId?.lastName}`}{" "}
                              (owner)
                            </p>
                            <p>{collab?.userId.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="presentation__collaborator-item"
                          key={collab?.userId.id}
                        >
                          <Avatar
                            /* eslint-disable react/jsx-props-no-spreading */
                            {...stringAvatar(
                              `${collab.userId?.firstName} ${collab.userId?.lastName}`
                            )}
                          />
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                              }}
                            >
                              <p
                                style={{ fontWeight: "bold" }}
                              >{`${collab.userId?.firstName} ${collab.userId?.lastName}`}</p>
                              {presentationDetail?.presentationRole ===
                                "Owner" && (
                                <Box
                                  sx={{
                                    bgcolor: "#F43F3F",
                                    borderRadius: "50%",
                                    padding: "2px",
                                    cursor: "pointer"
                                  }}
                                  onClick={() =>
                                    setIsOpenRemoveCollabModal(true)
                                  }
                                >
                                  <MdClose color="white" size={12} />
                                </Box>
                              )}
                            </div>
                            <p>{collab?.userId.email}</p>
                          </div>
                          <Modal
                            title="Remove collaborator?"
                            actions={["Cancel", "OK"]}
                            actionText="Remove"
                            show={isOpenRemoveCollabModal}
                            onCloseModal={() => {
                              setIsOpenRemoveCollabModal(false);
                            }}
                            onActionClick={() => {
                              dispatch(
                                removeCollaborator(
                                  presentationDetail.id,
                                  collab.userId.id
                                )
                              );
                              setIsOpenRemoveCollabModal(false);
                            }}
                          >
                            Do you really want to remove{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {collab.userId?.firstName}{" "}
                              {collab.userId?.lastName}
                            </span>
                            ?
                          </Modal>
                        </div>
                      )
                    )}

                    <div className="presentation__collaborator-add">
                      <OutlinedInput
                        sx={{ height: 40, width: "80%" }}
                        placeholder="Add a collaborator"
                        error={!!errors.collabEmail}
                        /* eslint-disable react/jsx-props-no-spreading */
                        {...register("collabEmail")}
                      />
                      {loadingCollaborator}
                      <Button
                        className="button__add-collaborator"
                        color="primary"
                        variant="contained"
                        disabled={!isDirty || loadingCollaborator}
                        onClick={handleSubmit(addCollabHandler)}
                      >
                        {loadingCollaborator ? (
                          <CircularProgress size={20} color="secondary" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                    {errors.collabEmail?.message && (
                      <FormHelperText
                        sx={{ mb: 0, mt: 0 }}
                        id="component-error-text"
                        error
                      >
                        {errors.collabEmail?.message}
                      </FormHelperText>
                    )}
                    {inviteCollabMessage.message && (
                      <FormHelperText
                        sx={{
                          mb: 0,
                          mt: 1,
                          color: inviteCollabMessage.success ? "green" : "red",
                          fontSize: 13
                        }}
                        id="component-success-text"
                      >
                        {inviteCollabMessage.message}
                      </FormHelperText>
                    )}
                  </div>
                </Box>
              </MUIModal>
              <button
                type="button"
                className="button__primary"
                onClick={presentPresentation}
              >
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
                <div className="slide__card-wrapper">
                  <div
                    className="slide__card"
                    role="presentation"
                    onClick={handleAddMultipleChoiceSlide}
                  >
                    <SlChart size={30} />
                    <p>Multiple Choice</p>
                  </div>
                  <div
                    className="slide__card"
                    role="presentation"
                    onClick={handleAddHeadingSlide}
                  >
                    <BsCardHeading size={30} />
                    <p>Heading</p>
                  </div>
                  <div
                    className="slide__card"
                    role="presentation"
                    onClick={handleAddParagraphSlide}
                  >
                    <BsTextParagraph size={30} />
                    <p>Paragraph</p>
                  </div>
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
                    {slide?.slideType === "MultipleChoice" && (
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
                        <MdClose
                          className="presentation__slide-delete"
                          color="rgb(147, 148, 151)"
                          cursor="pointer"
                          onClick={() => {
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    )}
                    {slide?.slideType === "Heading" && (
                      <div className="presentation__slide-item-container">
                        <BsCardHeading size={20} />
                        <p
                          style={{
                            color: "#000",
                            wordWrap: "anywhere",
                            padding: "0 4px"
                          }}
                        >
                          {slide?.content.heading || "Heading"}
                        </p>
                        <MdClose
                          className="presentation__slide-delete"
                          color="rgb(147, 148, 151)"
                          cursor="pointer"
                          onClick={() => {
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    )}
                    {slide?.slideType === "Paragraph" && (
                      <div className="presentation__slide-item-container">
                        <BsTextParagraph size={20} />
                        <p
                          style={{
                            color: "#000",
                            wordWrap: "anywhere",
                            padding: "0 4px"
                          }}
                        >
                          {slide?.content.heading || "Paragraph"}
                        </p>
                        <MdClose
                          className="presentation__slide-delete"
                          color="rgb(147, 148, 151)"
                          cursor="pointer"
                          onClick={() => {
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="presentation__content-container">
              {isShowResults && (
                <div className="presentation__result">
                  <div className="presentation__result-left">
                    <GrLineChart className="presentation__result-icon" />
                    <span>This presentation has results</span>
                  </div>
                  <button
                    type="button"
                    className="presentation__result-button"
                    onClick={() => setOpenResultModal(true)}
                  >
                    View Results
                  </button>
                  <MUIModal
                    open={isOpenResultModal}
                    onClose={() => setOpenResultModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        <GrLineChart size={20} />
                        Presentation results
                      </Typography>
                      <div className="presentation__collaborator">
                        <Typography id="modal-modal-description" sx={{ mb: 2 }}>
                          <span>
                            Results for Multiple Choice slides of{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {presentationDetail.title}
                            </span>{" "}
                            presentation.
                          </span>
                        </Typography>
                      </div>
                      {presentationDetail?.slides
                        ?.filter(
                          (slide) => slide.slideType === "MultipleChoice"
                        )
                        .map((slide) => (
                          <div key={slide.content.id}>
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#2a518f",
                                fontSize: "20px"
                              }}
                            >
                              {slide.content.question || "Multiple Choice"}
                            </span>
                            {slide.content.options?.map(
                              (opt) =>
                                opt.upvotes && (
                                  <div
                                    style={{ marginLeft: "32px" }}
                                    key={opt.id}
                                  >
                                    <span style={{ fontWeight: "bold" }}>
                                      {opt.content}
                                    </span>
                                    {opt.upvotes.length > 0 ? (
                                      opt.upvotes.map((upvote) => (
                                        <div
                                          key={upvote.id}
                                          style={{ marginLeft: "32px" }}
                                        >
                                          {upvote.userType === "Anonymous"
                                            ? upvote.userId?.name
                                            : `${upvote.userId?.firstName} ${upvote.userId?.lastName}`}{" "}
                                          -{" "}
                                          {new Date(
                                            upvote.createdAt
                                          ).toLocaleString("vi-VN")}
                                        </div>
                                      ))
                                    ) : (
                                      <div
                                        style={{
                                          marginLeft: "32px",
                                          fontStyle: "italic",
                                          color: "#ccc"
                                        }}
                                      >
                                        Nobody choose this option.
                                      </div>
                                    )}
                                  </div>
                                )
                            )}
                          </div>
                        ))}
                    </Box>
                  </MUIModal>
                </div>
              )}
              <div
                className="presentation__content"
                style={{ marginTop: isShowResults ? 0 : "56px" }}
              >
                <p className="presentation__content-header">
                  Go to{" "}
                  <span style={{ fontStyle: "italic" }}>
                    {process.env.REACT_APP_CLIENT_URL}/play
                  </span>{" "}
                  and enter code{" "}
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
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                {currentSlide?.slideType === "Heading" && (
                  <div className="presentation__content-main-heading">
                    <h1>
                      {currentSlide?.content.heading || "Slide with Heading"}
                    </h1>
                    <p>{currentSlide?.content.subheading || "Subheading"}</p>
                  </div>
                )}
                {currentSlide?.slideType === "Paragraph" && (
                  <div className="presentation__content-main-heading">
                    <h1>
                      {currentSlide?.content.heading || "Slide with Paragraph"}
                    </h1>
                    <p>{currentSlide?.content.paragraph || "Paragraph"}</p>
                  </div>
                )}
                <div className="presentation__badge">
                  <Badge
                    color="primary"
                    badgeContent={totalStudent === 0 ? "0" : totalStudent}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left"
                    }}
                  >
                    <BsPersonCircle size={30} />
                  </Badge>
                </div>
              </div>
            </div>

            <div className="presentation__customize">
              {currentSlide?.slideType === "MultipleChoice" && (
                <div>
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
                              onBlur={() => {
                                dispatch(
                                  updateTitleOption(
                                    presentationDetail?.id,
                                    currentSlide?.content.id,
                                    option.id,
                                    currentSlide?.content.options.find(
                                      (opt) => opt.id === option.id
                                    ).content
                                  )
                                );
                              }}
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
                                    options:
                                      currentSlide.content.options.filter(
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
              )}
              {currentSlide?.slideType === "Heading" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <p className="presentation__customize-label">Heading</p>
                    <OutlinedInput
                      placeholder="Slide with Heading"
                      value={currentSlide?.content.heading || ""}
                      onBlur={() => {
                        dispatch(
                          updateHeadingHeading(
                            presentationDetail?.id,
                            currentSlide?.content.id,
                            currentSlide?.content.heading
                          )
                        );
                      }}
                      onChange={(e) => {
                        setCurrentSlide({
                          ...currentSlide,
                          content: {
                            ...currentSlide?.content,
                            heading: e.target.value
                          }
                        });
                      }}
                      fullWidth
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <p className="presentation__customize-label">Subheading</p>
                    <TextareaAutosize
                      className="presentation__text-area"
                      placeholder="Subheading"
                      minRows={3}
                      value={currentSlide?.content.subheading || ""}
                      onBlur={() => {
                        dispatch(
                          updateSubHeadingHeading(
                            presentationDetail?.id,
                            currentSlide?.content.id,
                            currentSlide?.content.subheading
                          )
                        );
                      }}
                      onChange={(e) => {
                        setCurrentSlide({
                          ...currentSlide,
                          content: {
                            ...currentSlide?.content,
                            subheading: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}
              {currentSlide?.slideType === "Paragraph" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <p className="presentation__customize-label">Heading</p>
                    <OutlinedInput
                      placeholder="Slide with Paragraph"
                      value={currentSlide?.content.heading || ""}
                      onBlur={() => {
                        dispatch(
                          updateHeadingParagraph(
                            presentationDetail?.id,
                            currentSlide?.content.id,
                            currentSlide?.content.heading
                          )
                        );
                      }}
                      onChange={(e) => {
                        setCurrentSlide({
                          ...currentSlide,
                          content: {
                            ...currentSlide?.content,
                            heading: e.target.value
                          }
                        });
                      }}
                      fullWidth
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <p className="presentation__customize-label">Paragraph</p>
                    <TextareaAutosize
                      className="presentation__text-area"
                      placeholder="Subheading"
                      minRows={3}
                      value={currentSlide?.content.paragraph || ""}
                      onBlur={() => {
                        dispatch(
                          updateParagraphParagraph(
                            presentationDetail?.id,
                            currentSlide?.content.id,
                            currentSlide?.content.paragraph
                          )
                        );
                      }}
                      onChange={(e) => {
                        setCurrentSlide({
                          ...currentSlide,
                          content: {
                            ...currentSlide?.content,
                            paragraph: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Delete slide"
        loading={loading}
        actions={["Cancel", "OK"]}
        actionText="Yes, Delete it"
        show={open}
        onCloseModal={() => {
          setOpenModal(false);
        }}
        onActionClick={() => {
          handleDeleteSlide(presentationDetail?.id, currentSlide?.content?.id);
          setOpenModal(false);
        }}
      >
        Do you really want to delete this slide?
      </Modal>
    </div>
  );
}

export default PresentationTeacher;
