import {
  CircularProgress,
  FormHelperText,
  Grid,
  OutlinedInput
} from "@mui/material";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PresentationJoin.scss";
import Alert from "../../../components/Alert";

const schema = yup
  .object({
    code: yup.string().required("Please choose the answer")
  })
  .required();

function PresentationJoin() {
  const accessToken = localStorage.getItem("accessToken");
  const socket = io(`${process.env.REACT_APP_SERVER_URL}/presentation`, {
    withCredentials: true,
    extraHeaders: {
      token: accessToken
    }
  });
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
    setLoading(false);
    console.log("data:", data);
    // socket.emit("student-join-presentation", [
    //   { access_code: data.code },
    //   (data2) => {
    //     console.log("callback client:", data2);
    //   }
    // ]);
    socket.emit(
      "student-join-presentation",
      { access_code: data.code },
      (data2) => {
        console.log("callback client:", data2);
      }
    );
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

  console.log("accessToken:", accessToken);
  console.log("socket:", socket);

  useEffect(() => {
    // socket.emit("student-vote-option", { option_id: "1" }, () => {});

    // socket.emit("disconnecting");

    socket.on("get-total-students", (data) => {
      // const { total_users } = data;
      console.log("data get-total-students:", data);
    });

    socket.on("get-slide", (data) => {
      // const { slide, current_slide, total_slides } = data;
      console.log("data get-slide:", data);
    });

    socket.on("get-score", (data) => {
      // const { options } = data;
      console.log("data get-score:", data);
    });

    socket.on("connect", () => {
      console.log("connect");
    });

    return () => {
      socket.off("connect");
      socket.off("get-total-students");
      socket.off("get-slide");
      socket.off("get-score");
    };
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
