import {
  Alert as MuiAlert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Stack
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./GroupAddNew.scss";
import { createGroup } from "../../../redux/actions/groupAction";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    width: "600px"
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

/* eslint-disable react/prop-types */
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

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
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GroupAddNew({ open, handleClose }) {
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

      <BootstrapDialog
        onClose={() => {
          handleClose();
          reset();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => {
            handleClose();
            reset();
          }}
        >
          Create a group
        </BootstrapDialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={4}>
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

          <DialogActions>
            {/* <Button autoFocus type="submit" color="primary" variant="contained">
              Create
            </Button> */}
            <LoadingButton
              autoFocus
              type="submit"
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Create
            </LoadingButton>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}

export default GroupAddNew;
