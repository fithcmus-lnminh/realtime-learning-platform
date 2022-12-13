import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { io } from "socket.io-client";
import { studentVoteOption } from "../../../redux/actions/presentationAction";
import "./PresentationPlay.scss";
import Alert from "../../../components/Alert";

const schema = yup
  .object({
    answer: yup.string().required("Please choose the answer")
  })
  .required();

function PresentationPlay() {
  const accessToken = localStorage.getItem("accessToken");
  const socket = io(`${process.env.REACT_APP_SERVER_URL}/presentation`, {
    withCredentials: true,
    extraHeaders: {
      token: accessToken
    }
  });
  const [options, setOptions] = useState([]);
  const [slide, setSlide] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlide] = useState(1);

  const userInfo = useSelector(
    (state) => state.user.userInfo,
    (prev, next) => isEqual(prev, next)
  );
  const dispatch = useDispatch();
  // const multipleChoice = {
  //   id: "choice1",
  //   question: "Bạn hôm nay muốn ăn gì?",
  //   options: [
  //     {
  //       id: "ops1",
  //       content: "Thịt gà",
  //       upvoted: ""
  //     },
  //     {
  //       id: "ops2",
  //       content: "Thịt bò",
  //       upvoted: ""
  //     },
  //     {
  //       id: "ops3",
  //       content: "Thịt heo",
  //       upvoted: ""
  //     },
  //     {
  //       id: "ops4",
  //       content: "Thịt dê",
  //       upvoted: ""
  //     }
  //   ]
  // };
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
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(
      studentVoteOption(data, socket, setLoading, setMessage, setIsVote)
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    document.title = "Voting - RLP";
  }, []);

  useEffect(() => {
    socket.on("get-total-students", (data) => {
      // const { total_users } = data;
      console.log("data get-total-students:", data);
    });

    socket.on("get-slide", (data) => {
      const { slide: slideInfo, current_slide, total_slides } = data;
      setSlide(slideInfo);
      // { slide_type: slide.slide_type, content: slide.slide_id }
      setCurrentSlide(current_slide);
      setTotalSlide(total_slides);
      console.log("data get-slide:", data);
    });

    socket.on("get-score", (data) => {
      const { options: optionsCurrent } = data;
      setOptions(optionsCurrent);

      if (optionsCurrent.length > 0) {
        optionsCurrent.forEach((option) => {
          if (userInfo.id === option?.upvotes?.user_id) {
            setValue("answer", option?.id); // cập nhật lại đáp án
          }
        });
      }

      // [{ ...option, numUpvote: option.upvotes.length }, { ...option, numUpvote: option.upvotes.length }]
      console.log("data get-score:", data);
    });

    socket.on("end-presentation", () => {
      setIsEnding(true);
    });
    return () => {
      socket.off("get-total-students");
      socket.off("get-slide");
      socket.off("get-score");
      socket.off("end-presentation");
    };
  }, []);

  console.log("slide:", slide);
  console.log("options:", options);

  return (
    <div className="presentation__play__container">
      <div
        className="presentation__play__card"
        style={{ position: "relative" }}
      >
        <Alert message={message} onClose={handleCloseAlert} />
        <h2 className="presentation__play__title">
          {slide?.content?.question}
        </h2>
        {loading ? (
          <div
            style={{
              width: "500px",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: "50%"
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div>
            {!isEnding ? (
              <div
                style={{
                  width: "500px",
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  left: "50%"
                }}
              >
                The presentation has been ended.
              </div>
            ) : (
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
                              sx={{ width: 500, mb: 1, mt: 1 }}
                              /* eslint-disable react/jsx-props-no-spreading */
                              {...field}
                            >
                              {slide?.content?.options.length > 0 &&
                                slide?.content?.options.map((option) => (
                                  <FormControlLabel
                                    key={option.id}
                                    value={option.id}
                                    control={<Radio />}
                                    label={option.content}
                                    disabled={isVote}
                                  />
                                ))}
                            </RadioGroup>
                            {errors.answer?.message && (
                              <FormHelperText
                                sx={{
                                  width: 500,
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
                                  width: 500,
                                  mb: 2,
                                  mt: 2,
                                  ml: 0,
                                  mr: 0,
                                  fontSize: 14
                                }}
                                id="component-info-text"
                              >
                                You have already voted on this question. Please
                                wait for the presenter to show the next slide.
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
                      isVote ? { cursor: "not-allowed", opacity: "0.7" } : {}
                    }
                  >
                    Submit
                  </button>
                </div>

                <p className="presentation__play__progress">
                  {currentSlide}/{totalSlides}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PresentationPlay;