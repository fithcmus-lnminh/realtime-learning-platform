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
// import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PresentationPlay.scss";
import Alert from "../../../components/Alert";

const schema = yup
  .object({
    answer: yup.string().required("Please choose the answer")
  })
  .required();

function PresentationPlay() {
  const multipleChoice = {
    id: "choice1",
    question: "Bạn hôm nay muốn ăn gì?",
    options: [
      {
        id: "ops1",
        content: "Thịt gà",
        upvoted: ""
      },
      {
        id: "ops2",
        content: "Thịt bò",
        upvoted: ""
      },
      {
        id: "ops3",
        content: "Thịt heo",
        upvoted: ""
      },
      {
        id: "ops4",
        content: "Thịt dê",
        upvoted: ""
      }
    ]
  };
  const [status, setStatus] = useState("not_choose");
  //   const status = "choose";
  //   const status = "next";

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  //   const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control
    // reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setDisabled(true);
    // setStatus("choose");
    setStatus("next");
    console.log("data:", data);
    // dispatch(createGroup(data, handleClose, setLoading, reset, setMessage));
    setLoading(false);
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

  return (
    <div className="presentation__play__container">
      <div
        className="presentation__play__card"
        style={{ position: "relative" }}
      >
        <Alert message={message} onClose={handleCloseAlert} />
        <h2 className="presentation__play__title">{multipleChoice.question}</h2>
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
                          {multipleChoice.options.length > 0 ? (
                            <>
                              {multipleChoice.options.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  value={option.id}
                                  control={<Radio />}
                                  label={option.content}
                                  disabled={disabled}
                                />
                              ))}
                            </>
                          ) : null}
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
                        {status === "choose" && (
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
                            You have already voted on this question. Please wait
                            for the presenter to show the next slide.
                          </FormHelperText>
                        )}
                        {status === "next" && (
                          <FormHelperText
                            sx={{
                              width: 500,
                              mb: 2,
                              mt: 2,
                              ml: 0,
                              mr: 0,
                              fontSize: 14,
                              color: "#2a518f"
                            }}
                            id="component-info-text"
                            success
                          >
                            The presenter has changed slide.
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  );
                }}
              />

              {status === "not_choose" && (
                <button
                  type="button"
                  className="presentation__play__button"
                  onClick={disabled ? () => {} : handleSubmit(onSubmit)}
                  style={
                    disabled ? { cursor: "not-allowed", opacity: "0.7" } : {}
                  }
                >
                  Submit
                </button>
              )}

              {status === "choose" && (
                <button
                  type="button"
                  className="presentation__play__button presentation__play__button-refresh"
                >
                  Refresh
                </button>
              )}

              {status === "next" && (
                <button type="button" className="presentation__play__button">
                  Go to slide
                </button>
              )}
            </div>

            <p className="presentation__play__progress">1/3</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresentationPlay;
