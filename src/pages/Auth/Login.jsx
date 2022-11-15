import React, { useEffect, useState } from "react";
// import axios from "axios";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Auth.scss";
import kahoot from "../../assets/images/kahoot_logo.svg";
import google from "../../assets/images/google.svg";
import $axios from "../../utils/axios";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter valid email address"),
    password: yup
      .string()
      .required("Please enter your password")
      .min(8, "Your password must be at least 8 characters or greater")
  })
  .required();

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    console.log("submit data", data);
    setIsLoading(false);
    reset();
  };

  const fetchDta = async () => {
    const res = await $axios.post("/api/auth/login", {
      email: "lenhatminh11a1@gmail.com",
      password: "123456"
    });

    console.log(res);
  };

  useEffect(() => {
    fetchDta();
  });

  return (
    <div className="auth">
      <div className="auth__wrapper">
        <div className="auth__main">
          <div className="auth__form">
            <div className="auth__img">
              <img src={kahoot} alt="" />
            </div>
            <h1 className="auth__title">Log in</h1>
            <div className="auth__content">
              <form
                className="auth__form-wrapper"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="auth__container">
                  <div className="auth__form-field">
                    <p className="auth__label">Email</p>
                    <input
                      type="text"
                      name="email"
                      placeholder="abc@example.com"
                      className="auth__input"
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
                      className="auth__input"
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...register("password")}
                    />
                    <p className="auth__error">{errors.password?.message}</p>
                  </div>
                  <div className="auth__action">
                    <button
                      type="submit"
                      className="auth__btn"
                      disabled={isLoading}
                    >
                      {!isLoading ? "Login" : "Login..."}
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
              Dont&apos;t have an account?{" "}
              <NavLink to="/sign-up">Sign up</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
