import {
  FormHelperText,
  Grid,
  OutlinedInput,
  DialogContent
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PresentationUpdate.scss";
// import { createGroup } from "../../../redux/actions/groupAction";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

const schema = yup
  .object({
    name: yup.string().required("Please enter group name")
  })
  .required();

function PresentationUpdate(prop) {
  const { presentationDetail, open, handleClose } = prop;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  //   const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
    setValue
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
    // dispatch(updateGroup(data, handleClose, setLoading, reset, setMessage));
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    setValue("name", presentationDetail?.name);
  }, [open]);

  console.log("presentationDetail:", presentationDetail);

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

      <Modal
        title="Update presentation"
        loading={loading}
        disableAction={!isDirty}
        actions={["Cancel", "OK"]}
        actionText="Save"
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
                      placeholder="Enter a presentation name"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
                      error={!!errors.name?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                    />
                    {errors.name?.message && (
                      <FormHelperText
                        sx={{ mb: 2, mt: 0 }}
                        id="component-error-text"
                        error
                      >
                        {errors.name.message}
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

export default PresentationUpdate;
