import {
  CircularProgress,
  FormHelperText,
  Grid,
  OutlinedInput
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PresentationJoin.scss";
import Alert from "../../../components/Alert";
import {
  studentJoinPresentation,
  studentJoinPresentationAnonymous
} from "../../../redux/actions/presentationAction";

const schema = yup
  .object({
    accessCode: yup.string().required("Please enter the code")
  })
  .required();

const nameSchema = yup
  .object({
    name: yup.string().required("Please enter your name")
  })
  .required();

function PresentationJoin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });
  const {
    handleSubmit: handleSubmitName,
    formState: { errors: errorsName },
    control: controlName
  } = useForm({
    resolver: yupResolver(nameSchema)
  });

  const watchAccessCode = watch("accessCode");

  const onSubmit = async (data) => {
    setLoading(true);

    dispatch(
      studentJoinPresentation(data, setLoading, setMessage, setIsAuth, navigate)
    );
  };

  const onSubmitAnonymous = async (data) => {
    setLoading(true);
    dispatch(
      studentJoinPresentationAnonymous(
        data,
        { accessCode: watchAccessCode },
        setLoading,
        setMessage,
        setIsAuth
      )
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    document.title = "Enter the code - RLP";
  }, []);

  return (
    <div className="presentation__join__container">
      <div
        className="presentation__join__card"
        style={{ position: "relative" }}
      >
        <Alert message={message} onClose={handleCloseAlert} />
        <h2 className="presentation__join__title">
          {isAuth ? "Please enter the code" : "Please enter your name"}
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
            {isAuth ? (
              <div>
                <Controller
                  name="accessCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Grid item xs={12}>
                        <OutlinedInput
                          id="accessCode"
                          placeholder="Enter a code"
                          sx={{ width: 500, mb: 1, mt: 1 }}
                          fullWidth
                          error={!!errors.accessCode?.message}
                          onChange={() => {
                            console.log("Access code change");
                          }}
                          /* eslint-disable react/jsx-props-no-spreading */
                          {...field}
                        />
                        {errors.accessCode?.message && (
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
                            {errors.accessCode.message}
                          </FormHelperText>
                        )}
                      </Grid>
                    );
                  }}
                />

                <button
                  type="button"
                  className="presentation__join__button"
                  onClick={handleSubmit(onSubmit)}
                  // onClick={loading ? () => {} : handleSubmit(onSubmit)}
                  style={
                    loading ? { cursor: "not-allowed", opacity: "0.7" } : {}
                  }
                >
                  Submit
                </button>
              </div>
            ) : (
              <div>
                <Controller
                  name="name"
                  control={controlName}
                  render={({ field }) => {
                    return (
                      <Grid item xs={12}>
                        <OutlinedInput
                          id="name"
                          placeholder="Enter your name"
                          sx={{ width: 500, mb: 1, mt: 1 }}
                          fullWidth
                          error={!!errorsName.name?.message}
                          /* eslint-disable react/jsx-props-no-spreading */
                          {...field}
                        />
                        {errorsName.name?.message && (
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
                            {errorsName.name.message}
                          </FormHelperText>
                        )}
                      </Grid>
                    );
                  }}
                />

                <button
                  type="button"
                  className="presentation__join__button"
                  onClick={handleSubmitName(onSubmitAnonymous)}
                >
                  Submit
                </button>
                {/* <button
                  type="button"
                  className="presentation__join__button presentation__join__button-back"
                  onClick={() => setIsAuth(true)}
                >
                  Enter the code
                </button> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PresentationJoin;
