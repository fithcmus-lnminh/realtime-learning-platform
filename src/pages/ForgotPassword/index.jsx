import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ForgotPassword.scss";
import kahoot from "../../assets/images/logo.png";
import { forgotUserPassword } from "../../redux/actions/userAction";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter valid email address")
  })
  .required();

function ForgotPassword() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
    dispatch(forgotUserPassword(data, setLoading, setMessage, reset));
  };

  useEffect(() => {
    document.title = "Forgot Password - RLP";
  }, []);

  return (
    <div className="forgot">
      <div className="forgot__wrapper">
        <div className="forgot__main">
          <div className="forgot__form">
            <div className="forgot__img">
              <img src={kahoot} alt="" />
            </div>
            <h1 className="forgot__title">Forgot Password</h1>
            <p
              className={`forgot__message ${
                message.success
                  ? "forgot__message-success"
                  : "forgot__message-failure"
              }`}
            >
              {message.data}
            </p>
            <div className="forgot__content">
              <form
                className="forgot__form-wrapper"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="forgot__container">
                  <div className="forgot__form-field">
                    <p className="forgot__label">Email</p>
                    <input
                      type="text"
                      name="email"
                      placeholder="abc@example.com"
                      className="forgot__input"
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("email")}
                    />
                    <p className="forgot__error">{errors.email?.message}</p>
                  </div>
                  <div className="forgot__action">
                    <button
                      type="submit"
                      className="forgot__btn"
                      disabled={loading}
                    >
                      Request reset link
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="forgot__alert">
              <NavLink to="/login">Back to Login</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
