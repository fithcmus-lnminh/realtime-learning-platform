import {
  FormHelperText,
  Grid,
  OutlinedInput,
  DialogContent
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./GroupInvited.scss";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";
import { inviteGroup } from "../../../redux/actions/groupAction";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Please enter your email address")
      .email("Please enter valid email address")
  })
  .required();

function GroupInvited(prop) {
  const { groupId, open, handleClose } = prop;
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
    dispatch(
      inviteGroup(groupId, data, handleClose, setLoading, reset, setMessage)
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />
      <Modal
        title="Invite members"
        loading={loading}
        actions={["Cancel", "OK"]}
        actionText="Invite"
        show={open}
        onCloseModal={closeModalHandler}
        onActionClick={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <Grid>
            <Controller
              name="email"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Email</p>
                    <OutlinedInput
                      id="email"
                      placeholder="Enter a email address"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
                      error={!!errors.email?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                    />
                    {errors.email?.message && (
                      <FormHelperText id="component-error-text" error>
                        {errors.email.message}
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

export default GroupInvited;
