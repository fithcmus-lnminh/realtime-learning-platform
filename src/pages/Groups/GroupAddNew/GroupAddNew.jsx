import {
  Alert as MuiAlert,
  DialogContent,
  FormHelperText,
  Grid,
  Snackbar,
  TextField,
  Stack
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./GroupAddNew.scss";
import { createGroup } from "../../../redux/actions/groupAction";
import Modal from "../../../components/Modal";

const schema = yup
  .object({
    name: yup.string().required("Please enter group name"),
    maximumMembers: yup
      .number("Please enter number of group members")
      .typeError("Please enter number of group members")
      .min(1, "The number of group members must be greater than 0")
      .max(30, "The number of group members must be less than 30")
      .required("Please enter number of group members")
  })
  .required();

const Alert = React.forwardRef(function Alert(props, ref) {
  /* eslint-disable react/jsx-props-no-spreading */
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GroupAddNew(prop) {
  const { open, handleClose } = prop;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const closeModalHandler = () => {
    handleClose();
    reset();
  };

  const onSubmit = async (data) => {
    dispatch(createGroup(data, handleClose, setLoading, reset, setMessage));
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage({
      success: true,
      data: "",
      open: false
    });
  };

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={message.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={message.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message.data}
          </Alert>
        </Snackbar>
      </Stack>

      <Modal
        title="Create a group"
        loading={loading}
        actions={["Cancel", "OK"]}
        actionText="Create"
        show={open}
        onCloseModal={closeModalHandler}
        onActionClick={handleSubmit(onSubmit)}
      >
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      size="small"
                      error={!!errors.name?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                    />
                    {errors.name?.message && (
                      <FormHelperText id="component-error-text" error>
                        {errors.name.message}
                      </FormHelperText>
                    )}
                  </Grid>
                );
              }}
            />
            <Controller
              name="maximumMembers"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Number of members"
                      size="small"
                      error={!!errors.maximumMembers?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                    />
                    {errors.maximumMembers?.message && (
                      <FormHelperText id="component-error-text" error>
                        {errors.maximumMembers.message}
                      </FormHelperText>
                    )}
                  </Grid>
                );
              }}
            />
          </Grid>
        </DialogContent>
      </Modal>
    </>
  );
}

export default GroupAddNew;
