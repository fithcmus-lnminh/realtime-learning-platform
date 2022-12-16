import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ResetPassword.scss";
import kahoot from "../../assets/images/logo.png";
import {
  resetUserPassword,
  verifyTokenResetUserPassword
} from "../../redux/actions/userAction";

const schema = yup
  .object({
    password: yup
      .string()
      .required("Please enter your password")
      .min(8, "Your password must be at least 8 characters or greater"),
    confirmPassword: yup
      .string()
      .required("Please enter your confirm password")
      .min(8, "Your confirm password must be at least 8 characters or greater")
      .oneOf([yup.ref("password")], "Passwords do not match")
  })
  .required();

function ResetPassword() {
  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [verify, setVerify] = useState(false);
  const [message, setMessage] = useState({ success: true, data: "" });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(
      resetUserPassword(data, params.token, setLoading, setMessage, reset)
    );
  };

  useEffect(() => {
    document.title = "Reset Password - RLP";
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(
      verifyTokenResetUserPassword(
        params.token,
        setLoading,
        setMessage,
        setVerify
      )
    );
  }, [params?.token]);

  return (
    <div className="reset">
      <div className="reset__wrapper">
        <div className="reset__main">
          <div className="reset__form">
            <div className="reset__img">
              <img src={kahoot} alt="" />
            </div>
            <h1 className="reset__title">Reset Password</h1>
            {loading ? (
              <Box
                sx={{
                  position: "relative",
                  flex: "1"
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    left: "50%"
                  }}
                >
                  <CircularProgress color="inherit" />
                </Box>
              </Box>
            ) : (
              <>
                <p
                  className={`reset__message ${
                    message.success
                      ? "reset__message-success"
                      : "reset__message-failure"
                  }`}
                >
                  {message.data}
                </p>
                {verify && (
                  <div className="reset__content">
                    <form
                      className="reset__form-wrapper"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="reset__container">
                        <div className="reset__form-field">
                          <p className="reset__label">Password</p>
                          <input
                            type="password"
                            name="password"
                            placeholder="Enter a password"
                            className={`reset__input ${
                              errors.password ? "reset__input-error" : ""
                            }`}
                            /* eslint-disable react/jsx-props-no-spreading */
                            {...register("password")}
                          />
                          <p className="reset__error">
                            {errors.password?.message}
                          </p>
                        </div>
                        <div className="reset__form-field">
                          <p className="reset__label">Confirm Password</p>
                          <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Enter a confirm password"
                            className={`reset__input ${
                              errors.confirmPassword ? "reset__input-error" : ""
                            }`}
                            /* eslint-disable react/jsx-props-no-spreading */
                            {...register("confirmPassword")}
                          />
                          <p className="reset__error">
                            {errors.confirmPassword?.message}
                          </p>
                        </div>
                        <div className="reset__action">
                          <button
                            type="submit"
                            className="reset__btn"
                            disabled={loading}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
