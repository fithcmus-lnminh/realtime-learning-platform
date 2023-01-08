import { Badge, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
  MdClose
} from "react-icons/md";
import {
  BsFillChatDotsFill,
  BsPersonCircle,
  BsQuestionLg
} from "react-icons/bs";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import MessagePopover from "../../components/MessagePopover";
// import { getPresentationById } from "../../redux/actions/presentationAction";
import "./PresentPresentation.scss";
import { socket } from "../../utils/socket";
import { toCamel } from "../../utils/normalizer";
import QuestionPopover from "../../components/QuestionPopover";
import NotificationSound from "../../assets/audio/mixkit-software-interface-back-2575.wav";

function PresentPresentation() {
  const param = useParams();
  const navigate = useNavigate();
  const handleFullScreen = useFullScreenHandle();
  const [loading] = useState(false);
  const { presentationDetail } = useSelector((state) => state.presentation);

  const [currentSlide, setCurrentSlide] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const [questionAnchorEl, setQuestionAnchorEl] = useState(null);
  const [isNewMessage, setIsNewMessage] = useState(false);

  const audioPlayer = useRef(null);

  const playAudio = () => {
    audioPlayer.current.play();
  };

  const handleGoToPreviousSlide = () => {
    setCurrentSlideIndex(currentSlideIndex - 1);
    socket.emit("teacher-previous-slide", {}, (data) => {
      console.log(data);
    });
  };

  const handleGoToNextSlide = async () => {
    setCurrentSlideIndex(currentSlideIndex + 1);
    socket.emit("teacher-next-slide", {}, (data) => {
      console.log(data);
    });
  };

  const handleExitPresent = () => {
    navigate(`/presentation/${param.id}`);
    socket.emit("teacher-end-presentation", {}, () => {});
  };

  useEffect(() => {
    socket.emit(
      "teacher-start-presentation",
      { access_code: presentationDetail?.accessCode, current_slide: 1 },
      (data) => {
        console.log(data);
      }
    );
    socket.on("get-slide", (data) => {
      console.log(data.slide);
      setCurrentSlide(toCamel(data.slide));
    });
  }, []);

  useEffect(() => {
    socket.on("get-score", (data) => {
      setCurrentSlide({
        ...currentSlide,
        content: { ...currentSlide?.content, options: data.options }
      });
    });
  }, [currentSlide]);

  const isOpenMessagePopover = Boolean(messageAnchorEl);
  const idMessagePopover = isOpenMessagePopover ? "simple-popover" : undefined;
  const isOpenQuestionPopover = Boolean(questionAnchorEl);
  const idQuestionPopover = isOpenQuestionPopover
    ? "simple-popover"
    : undefined;

  useEffect(() => {
    if (isNewMessage && !isOpenMessagePopover) {
      playAudio();
    }
  }, [isNewMessage]);

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
        <FullScreen handle={handleFullScreen}>
          <div className="present__container">
            <div className="present__wrapper">
              <div className="present__exit">
                <button
                  type="button"
                  className="present__controller-button"
                  onClick={handleExitPresent}
                >
                  <MdClose />
                </button>
              </div>
              <div className="present__message">
                <button
                  aria-describedby={idMessagePopover}
                  type="button"
                  className="present__message-button"
                  onClick={(e) => {
                    setMessageAnchorEl(e.currentTarget);
                    setIsNewMessage(false);
                  }}
                >
                  <BsFillChatDotsFill />
                  {isNewMessage && !isOpenMessagePopover && (
                    <div className="present__notifier" />
                  )}
                </button>
                <audio ref={audioPlayer} src={NotificationSound}>
                  <track default kind="captions" />
                </audio>
                <MessagePopover
                  id={idMessagePopover}
                  open={isOpenMessagePopover}
                  anchorEl={messageAnchorEl}
                  presentationId={presentationDetail?.id}
                  setIsNewMessage={setIsNewMessage}
                  onClose={() => setMessageAnchorEl(null)}
                />
              </div>
              <div className="present__question">
                <button
                  aria-describedby={idQuestionPopover}
                  type="button"
                  className="present__question-button"
                  onClick={(e) => setQuestionAnchorEl(e.currentTarget)}
                >
                  <BsQuestionLg />
                </button>
                <QuestionPopover
                  id={idQuestionPopover}
                  open={isOpenQuestionPopover}
                  anchorEl={questionAnchorEl}
                  presentationId={presentationDetail?.id}
                  onClose={() => setQuestionAnchorEl(null)}
                  /* eslint-disable react/jsx-boolean-value */
                  isTeacher={true}
                />
              </div>
              <div className="present__controller">
                {handleFullScreen.active ? (
                  <button
                    type="button"
                    className="present__controller-button"
                    style={{ marginRight: 28 }}
                    onClick={handleFullScreen.exit}
                  >
                    <BiCollapse />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="present__controller-button"
                    style={{ marginRight: 28 }}
                    onClick={handleFullScreen.enter}
                  >
                    <BiExpand />
                  </button>
                )}
                <button
                  type="button"
                  className="present__controller-button"
                  disabled={currentSlideIndex === 0}
                  onClick={handleGoToPreviousSlide}
                >
                  <MdOutlineArrowBackIosNew />
                </button>
                <button
                  type="button"
                  className="present__controller-button"
                  disabled={
                    currentSlideIndex === presentationDetail.slides.length - 1
                  }
                  onClick={handleGoToNextSlide}
                >
                  <MdOutlineArrowForwardIos />
                </button>
              </div>
              <div className="present__content">
                <p className="present__content-header">
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
                  <div className="present__content-main">
                    <h1
                      style={{
                        marginTop: 16,
                        wordWrap: "anywhere",
                        fontSize: 48
                      }}
                    >
                      {currentSlide?.content.question || "Multiple Choice"}
                    </h1>
                    {currentSlide?.content?.options.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 64
                        }}
                      >
                        <BarChart
                          width={1000}
                          height={550}
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
                  <div className="present__content-main-heading">
                    <h1>
                      {currentSlide?.content.heading || "Slide with Heading"}
                    </h1>
                    <p>{currentSlide?.content.subheading || "Subheading"}</p>
                  </div>
                )}
                {currentSlide?.slideType === "Paragraph" && (
                  <div className="present__content-main-heading">
                    <h1>
                      {currentSlide?.content.heading || "Slide with Paragraph"}
                    </h1>
                    <p>{currentSlide?.content.paragraph || "Paragraph"}</p>
                  </div>
                )}
                <div className="present__badge">
                  <Badge
                    color="primary"
                    badgeContent={
                      presentationDetail?.totalStudents
                        ? "0"
                        : presentationDetail?.totalStudents
                    }
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left"
                    }}
                  >
                    <BsPersonCircle size={45} />
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </FullScreen>
      )}
    </div>
  );
}

export default PresentPresentation;
