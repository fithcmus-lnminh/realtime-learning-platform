import {
  CircularProgress,
  FormHelperText,
  Grid,
  OutlinedInput
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PresentationJoin.scss";
import Alert from "../../../components/Alert";

const schema = yup
  .object({
    code: yup
      .number("Please enter the code")
      .typeError("Please enter the code")
      .required("Please enter the code")
  })
  .required();

function PresentationJoin() {
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
    console.log("data:", data);
    // dispatch(createGroup(data, handleClose, setLoading, reset, setMessage));
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
        <h2 className="presentation__join__title">Please enter the code</h2>
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
            <div>
              <Controller
                name="code"
                control={control}
                render={({ field }) => {
                  return (
                    <Grid item xs={12}>
                      <OutlinedInput
                        id="code"
                        placeholder="Enter a code"
                        sx={{ width: 500, mb: 1, mt: 1 }}
                        fullWidth
                        error={!!errors.code?.message}
                        /* eslint-disable react/jsx-props-no-spreading */
                        {...field}
                      />
                      {errors.code?.message && (
                        <FormHelperText
                          sx={{ mb: 2, mt: 0 }}
                          id="component-error-text"
                          error
                        >
                          {errors.code.message}
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
