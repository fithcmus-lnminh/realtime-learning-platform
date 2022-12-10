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
import "./PresentationAddNew.scss";
import { createPresentation } from "../../../redux/actions/presentationAction";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

const schema = yup
  .object({
    title: yup.string().required("Please enter presentation title")
  })
  .required();

function PresentationAddNew(prop) {
  const { open, handleClose, loading, setLoading } = prop;
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors, isDirty },
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
    console.log("data:", data);
    dispatch(
      createPresentation(data, handleClose, setLoading, reset, setMessage)
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
        title="Create new presentation"
        loading={loading}
        disableAction={!isDirty}
        actions={["Cancel", "OK"]}
        actionText="Create"
        show={open}
        onCloseModal={closeModalHandler}
        onActionClick={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <Grid>
            <Controller
              name="title"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Title</p>
                    <OutlinedInput
                      id="title"
                      placeholder="Enter a presentation title"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
                      error={!!errors.title?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                    />
                    {errors.title?.message && (
                      <FormHelperText
                        sx={{ mb: 2, mt: 0 }}
                        id="component-error-text"
                        error
                      >
                        {errors.title.message}
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

export default PresentationAddNew;
