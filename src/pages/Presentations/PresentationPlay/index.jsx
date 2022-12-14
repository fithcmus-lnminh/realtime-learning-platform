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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import {
  studentJoinPresentation,
  studentVoteOption
} from "../../../redux/actions/presentationAction";
import "./PresentationPlay.scss";
import Alert from "../../../components/Alert";
import { socket } from "../../../utils/socket";
import { ApiResposeCodeNumber } from "../../../constants/api";
import { isAuthenticated } from "../../../utils/isAuthenticated";

const schema = yup
  .object({
    answer: yup.string().required("Please choose the answer")
  })
  .required();

function PresentationPlay() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [options, setOptions] = useState([]);
  const [slide, setSlide] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlide] = useState(1);
  const params = useParams();
  const dispatch = useDispatch();
  const [isEnding, setIsEnding] = useState(false);
  const [isVote, setIsVote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
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
      const { slide: slideInfo, current_slide, total_slides } = data;
      setSlide(slideInfo);
      setOptions(slideInfo?.content?.options);
      setCurrentSlide(current_slide);
      setTotalSlide(total_slides);
      setIsEnding(false);

      socket.emit("student-check-vote", { access_code: params.code }, (res) => {
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
      });
    });

    socket.on("get-score", (data) => {
      const { options: optionsCurrent } = data;
      setOptions(optionsCurrent);
    });

    socket.on("end-presentation", () => {
      setIsEnding(true);

      if (!isAuthenticated()) {
        localStorage.removeItem("accessToken");
      }
    });
    return () => {
      socket.off("get-slide");
      socket.off("get-score");
      socket.off("end-presentation");
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    if (accessToken && params?.code) {
      dispatch(
        studentJoinPresentation({ accessCode: params.code }, setLoading)
      );
    } else {
      navigate("/play");
    }
  }, [params?.code]);

  return (
    <div className="presentation__play__container">
      <div
        className="presentation__play__card"
        style={{ position: "relative" }}
      >
        <Alert message={message} onClose={handleCloseAlert} />
        {!isEnding && (
          <h2 className="presentation__play__title">
            {slide?.content?.question}
          </h2>
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

                    {isVote && (
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
