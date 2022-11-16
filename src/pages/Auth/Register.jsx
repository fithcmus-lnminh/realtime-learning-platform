import React, { useEffect, useState } from "react";
// import axios from "axios";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/actions/userAction";

import kahoot from "../../assets/images/kahoot_logo.svg";
import google from "../../assets/images/google.svg";
import "./Auth.scss";

const schema = yup
  .object({
    first_name: yup.string().required("Please enter your first name"),
    last_name: yup.string().required("Please enter your last name"),
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter valid email address"),
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

function Register() {
  // const { loading, user } = useSelector((state) => state.user);
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
    const { email, password, first_name, last_name } = data;
    dispatch(
      registerUser(
        { email, password, first_name, last_name },
        setLoading,
        setMessage,
        reset
      )
    );
  };

  useEffect(() => {
    document.title = "Register Page";
  }, []);

  return (
    <div className="auth">
      <div className="auth__wrapper">
        <div className="auth__main">
          <div className="auth__form">
            <div className="auth__img">
              <img src={kahoot} alt="" />
            </div>
            <h1 className="auth__title">Register</h1>
            <p
              className={`auth__message ${
                message.success
                  ? "auth__message-success"
                  : "auth__message-failure"
              }`}
            >
              {message.data}
            </p>
            <div className="auth__content">
              <form
                className="auth__form-wrapper"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="auth__container">
                  <div className="auth__form-field">
                    <p className="auth__label">First name</p>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Enter a first name"
                      className={`
                      auth__input ${
                        errors.first_name ? "auth__input-error" : ""
                      }`}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("first_name")}
                    />
                    <p className="auth__error">{errors.first_name?.message}</p>
                  </div>
                  <div className="auth__form-field">
                    <p className="auth__label">Last name</p>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Enter a last name"
                      className={`auth__input ${
                        errors.last_name ? "auth__input-error" : ""
                      }`}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("last_name")}
                    />
                    <p className="auth__error">{errors.last_name?.message}</p>
                  </div>
                  <div className="auth__form-field">
                    <p className="auth__label">Email</p>
                    <input
                      type="text"
                      name="email"
                      placeholder="abc@example.com"
                      className={`auth__input ${
                        errors.email ? "auth__input-error" : ""
                      }`}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("email")}
                    />
                    <p className="auth__error">{errors.email?.message}</p>
                  </div>
                  <div className="auth__form-field">
                    <p className="auth__label">Password</p>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter a password"
                      className={`auth__input ${
                        errors.password ? "auth__input-error" : ""
                      }`}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("password")}
                    />
                    <p className="auth__error">{errors.password?.message}</p>
                  </div>
                  <div className="auth__form-field">
                    <p className="auth__label">Confirm Password</p>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Enter a confirm password"
                      className={`auth__input ${
                        errors.confirmPassword ? "auth__input-error" : ""
                      }`}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("confirmPassword")}
                    />
                    <p className="auth__error">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>
                  <div className="auth__action">
                    <button
                      type="submit"
                      className="auth__btn"
                      disabled={loading}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="auth__bottom">
              <div className="auth__line">
                <hr />
                <span className="auth__line-text">Or</span>
              </div>
              <div className="auth__btn_other">
                <button type="button" className="auth__btn_social">
                  <img src={google} alt="" />
                  <div className="auth__btn-text">Continue with Google</div>
                </button>
              </div>
            </div>

            <div className="auth__alert">
              Already have an account? <NavLink to="/login">Log in</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
