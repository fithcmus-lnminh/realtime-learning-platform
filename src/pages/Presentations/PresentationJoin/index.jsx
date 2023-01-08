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

function PresentationJoin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [messageName, setMessageName] = useState("");
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

  const watchAccessCode = watch("accessCode");

  const onSubmit = async (data) => {
    setLoading(true);

    dispatch(
      studentJoinPresentation(
        data,
        setLoading,
        () => {},
        setMessage,
        setIsAuth,
        navigate
      )
    );
  };

  const onSubmitAnonymous = async () => {
    if (name === "") {
      setMessageName("Please enter your name");
    } else {
      setLoading(true);
      dispatch(
        studentJoinPresentationAnonymous(
          { name },
          { accessCode: watchAccessCode },
          setLoading,
          setMessage,
          setIsAuth,
          navigate
        )
      );
    }
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
          <div>
            <div>
              {isAuth ? (
                <Controller
                  name="accessCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Grid item xs={12}>
                        <OutlinedInput
                          name="accessCode"
                          placeholder="Enter a code"
                          sx={{ minWidth: "500px", mb: 1, mt: 1 }}
                          fullWidth
                          error={!!errors.accessCode?.message}
                          /* eslint-disable react/jsx-props-no-spreading */
                          {...field}
                        />
                        {errors.accessCode?.message && (
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
                            {errors.accessCode.message}
                          </FormHelperText>
                        )}
                      </Grid>
                    );
                  }}
                />
              ) : (
                <>
                  <Grid item xs={12}>
                    <OutlinedInput
                      name="name"
                      placeholder="Enter your name"
                      sx={{ minWidth: "500px", mb: 1, mt: 1 }}
                      fullWidth
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value === "") {
                          setMessageName("Please enter your name");
                        } else {
                          setMessageName("");
                        }
                      }}
                    />
                  </Grid>
                  {messageName && (
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
                      {messageName}
                    </FormHelperText>
                  )}
                </>
              )}

              <button
                type="button"
                className="presentation__join__button"
                onClick={isAuth ? handleSubmit(onSubmit) : onSubmitAnonymous}
                style={loading ? { cursor: "not-allowed", opacity: "0.7" } : {}}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresentationJoin;
