import {
  Alert as MuiAlert,
  FormHelperText,
  Grid,
  Snackbar,
  Stack,
  OutlinedInput,
  DialogContent
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
    description: yup.string().required("Please enter group description"),
    maximumMembers: yup
      .number("Please enter number of group members")
      .typeError("Please enter number of group members")
      .min(1, "The number of group members must be greater than 0")
      .max(30, "The number of group members must be less than 30")
      .required("Please enter number of group members")
  })
  .required();

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
    setLoading(true);
    dispatch(createGroup(data, handleClose, setLoading, reset, setMessage));
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
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
          <MuiAlert
            variant="filled"
            onClose={handleCloseAlert}
            severity={message.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message.data}
          </MuiAlert>
        </Snackbar>
      </Stack>

      <Modal
        title="CREATE A GROUP"
        loading={loading}
        actions={["Cancel", "OK"]}
        actionText="Create"
        show={open}
        onCloseModal={closeModalHandler}
        onActionClick={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <Grid>
            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Name</p>
                    <OutlinedInput
                      id="name"
                      sx={{ width: 500, mb: 3, mt: 1 }}
                      fullWidth
                      error={!!errors.name?.message}
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
                    <p className="required form__label">Number of members</p>
                    <OutlinedInput
                      id="maximumMembers"
                      sx={{ width: 500, mb: 3, mt: 1 }}
                      fullWidth
                      type="number"
                      error={!!errors.maximumMembers?.message}
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Description</p>
                    <OutlinedInput
                      id="description"
                      sx={{ width: 500, mb: 3, mt: 1 }}
                      fullWidth
                      error={!!errors.description?.message}
                      {...field}
                    />
                    {errors.description?.message && (
                      <FormHelperText id="component-error-text" error>
                        {errors.description.message}
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
