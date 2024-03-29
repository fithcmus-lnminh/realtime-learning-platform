import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { useParams } from "react-router-dom";
import { BsFillChatDotsFill, BsQuestionLg } from "react-icons/bs";
import {
  studentJoinPresentation,
  studentVoteOption
} from "../../../redux/actions/presentationAction";
import "./PresentationPlay.scss";
import Alert from "../../../components/Alert";
import { socket } from "../../../utils/socket";
import { ApiResposeCodeNumber } from "../../../constants/api";
import { isAuthenticated } from "../../../utils/isAuthenticated";
import MessagePopover from "../../../components/MessagePopover";
import QuestionPopover from "../../../components/QuestionPopover";
import NotificationSound from "../../../assets/audio/mixkit-software-interface-back-2575.wav";

const schema = yup
  .object({
    answer: yup.string().required("Please choose the answer")
  })
  .required();

function PresentationPlay() {
  const accessToken = localStorage.getItem("accessToken");
  const [options, setOptions] = useState([]);
  const [slide, setSlide] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlide] = useState(1);
  const params = useParams();
  const dispatch = useDispatch();
  const [isEnding, setIsEnding] = useState(false);
  const [isVote, setIsVote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  const [isTeacher, setIsTeacher] = useState(false);
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const [questionAnchorEl, setQuestionAnchorEl] = useState(null);
  const [presentationId, setPresentationId] = useState(null);
  const [isNewMessage, setIsNewMessage] = useState(false);

  const audioPlayer = useRef(null);

  const playAudio = () => {
    audioPlayer.current.play();
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(studentVoteOption(data, setLoading, setMessage, setIsVote));
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    document.title = "Voting - RLP";

    socket.on("get-slide", (data) => {
      const {
        slide: slideInfo,
        current_slide,
        total_slides,
        presentation_id
      } = data;
      setSlide(slideInfo);
      setCurrentSlide(current_slide);
      setTotalSlide(total_slides);
      setIsEnding(false);
      setPresentationId(presentation_id);

      if (slideInfo?.slide_type === "MultipleChoice") {
        setOptions(slideInfo?.content?.options);

        socket.emit(
          "student-check-vote",
          { access_code: params.code },
          (res) => {
            if (res.code === ApiResposeCodeNumber.Success) {
              if (res?.data?.option_id) {
                setValue("answer", res?.data?.option_id);
              }
              setIsVote(res?.data?.is_voted);
            } else {
              setMessage({
                success: false,
                data: res.message,
                open: true
              });
            }
          }
        );
      }
    });

    socket.on("get-score", (data) => {
      const { options: optionsCurrent } = data;
      setOptions(optionsCurrent);
    });

    socket.on("end-presentation", () => {
      setIsEnding(true);

      if (accessToken && !isAuthenticated()) {
        localStorage.removeItem("accessToken");
        window.open(`/play`, "_self");
      }
    });
  }, []);

  const isOpenMessagePopover = Boolean(messageAnchorEl);
  const idMessagePopover = isOpenMessagePopover ? "simple-popover" : undefined;

  useEffect(() => {
    if (isNewMessage && !isOpenMessagePopover) {
      playAudio();
    }
  }, [isNewMessage]);

  useEffect(() => {
    setLoading(true);
    if (accessToken && params?.code) {
      dispatch(
        studentJoinPresentation(
          { accessCode: params.code },
          setLoading,
          setIsTeacher
        )
      );
    } else {
      /* eslint-disable no-lonely-if */
      if (isAuthenticated()) {
        dispatch(
          studentJoinPresentation(
            { accessCode: params.code },
            setLoading,
            setIsTeacher
          )
        );
      } else {
        window.open(`/play`, "_self");
      }
    }
  }, [params?.code]);

  const isOpenQuestionPopover = Boolean(questionAnchorEl);
  const idQuestionPopover = isOpenQuestionPopover
    ? "simple-popover"
    : undefined;

  return (
    <div className="presentation__play__container">
      <div
        className="presentation__play__card"
        style={{ position: "relative" }}
      >
        <Alert message={message} onClose={handleCloseAlert} />
        {!isEnding && (
          <>
            <h2 className="presentation__play__title">
              {slide?.slide_type === "MultipleChoice" &&
                slide?.content?.question}
            </h2>
            <h2
              className="presentation__play__title"
              style={{ textAlign: "center" }}
            >
              {slide?.slide_type === "Heading" && slide?.content?.heading}
              {slide?.slide_type === "Paragraph" && slide?.content?.heading}
            </h2>
          </>
        )}
        {loading ? (
          <div
            style={{
              minWidth: "500px",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: "50%",
              textAlign: "center"
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          /* eslint-disable react/jsx-no-useless-fragment */
          <>
            {isEnding ? (
              <div
                style={{
                  minWidth: "500px",
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  fontSize: "28px",
                  textAlign: "center"
                }}
              >
                <Typography variant="h1" gutterBottom sx={{ fontSize: "28px" }}>
                  The presentation has been ended.
                </Typography>
                <button
                  type="button"
                  className="presentation__play__button"
                  onClick={() => {
                    window.open(`/play`, "_self");
                  }}
                  style={{
                    width: "auto",
                    padding: "12px 24px"
                  }}
                >
                  Join another presentation
                </button>
              </div>
            ) : (
              /* eslint-disable react/jsx-no-useless-fragment */
              <>
                {slide &&
                typeof slide === "object" &&
                Object.keys(slide).length > 0 &&
                slide.content &&
                typeof slide.content === "object" &&
                Object.keys(slide.content).length > 0 &&
                slide.content ? (
                  <>
                    {slide?.slide_type === "MultipleChoice" && (
                      <div className="presentation__play__form">
                        <Controller
                          name="answer"
                          control={control}
                          render={({ field }) => {
                            return (
                              <Grid item xs={12}>
                                <FormControl>
                                  <RadioGroup
                                    aria-labelledby="radio-buttons-answer"
                                    name="answer"
                                    sx={{ minWidth: "500px", mb: 1, mt: 1 }}
                                    /* eslint-disable react/jsx-props-no-spreading */
                                    {...field}
                                  >
                                    {slide?.content?.options.length > 0 &&
                                      slide?.content?.options.map((option) => (
                                        <FormControlLabel
                                          /* eslint-disable no-underscore-dangle */
                                          key={option._id}
                                          /* eslint-disable no-underscore-dangle */
                                          value={option._id}
                                          control={<Radio />}
                                          label={option.content}
                                          /* eslint-disable no-underscore-dangle */
                                          checked={
                                            getValues("answer") === option._id
                                          }
                                          disabled={isVote}
                                        />
                                      ))}
                                  </RadioGroup>
                                  {errors.answer?.message && (
                                    <FormHelperText
                                      sx={{
                                        minWidth: "500px",
                                        mb: 2,
                                        mt: 2,
                                        ml: 0,
                                        mr: 0,
                                        fontSize: 14
                                      }}
                                      id="component-error-text"
                                      error
                                    >
                                      {errors.answer.message}
                                    </FormHelperText>
                                  )}
                                  {isVote && (
                                    <FormHelperText
                                      sx={{
                                        minWidth: "500px",
                                        mb: 2,
                                        mt: 2,
                                        ml: 0,
                                        mr: 0,
                                        fontSize: 14
                                      }}
                                      id="component-info-text"
                                    >
                                      You have already voted on this question.
                                      Please wait for the presenter to show the
                                      next slide.
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            );
                          }}
                        />

                        <button
                          type="button"
                          className="presentation__play__button"
                          onClick={isVote ? () => {} : handleSubmit(onSubmit)}
                          style={
                            isVote
                              ? { cursor: "not-allowed", opacity: "0.7" }
                              : {}
                          }
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {slide?.slide_type === "Heading" && (
                      <div
                        className="presentation__play-content-heading"
                        style={{
                          textAlign: "center",
                          minWidth: "500px",
                          maxWidth: "700px"
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {slide?.content?.subheading}
                        </Typography>
                      </div>
                    )}

                    {slide?.slide_type === "Paragraph" && (
                      <div
                        className="presentation__play-content-paragraph"
                        style={{
                          textAlign: "center",
                          minWidth: "500px",
                          maxWidth: "700px"
                        }}
                      >
                        <Typography variant="" gutterBottom>
                          {slide?.content?.paragraph}
                        </Typography>
                      </div>
                    )}

                    {slide?.slide_type === "MultipleChoice" && isVote && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "700px",
                          border: "1px solid #fff"
                        }}
                      >
                        <BarChart
                          width={1000}
                          height={550}
                          data={options}
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

                    <p className="presentation__play__progress">
                      {currentSlide}/{totalSlides}
                    </p>

                    <div>
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
                          presentationId={presentationId}
                          setIsNewMessage={setIsNewMessage}
                          onClose={() => setMessageAnchorEl(null)}
                          /* eslint-disable react/jsx-boolean-value */
                          isPlay={true}
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
                          presentationId={presentationId}
                          onClose={() => setQuestionAnchorEl(null)}
                          isTeacher={isTeacher}
                          /* eslint-disable react/jsx-boolean-value */
                          isPlay={true}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      minWidth: "500px",
                      position: "absolute",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      left: "50%",
                      fontSize: "28px",
                      textAlign: "center"
                    }}
                  >
                    <Typography
                      variant="h1"
                      gutterBottom
                      sx={{ fontSize: "28px" }}
                    >
                      Please wait for the Host to start this presentation.
                    </Typography>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PresentationPlay;
