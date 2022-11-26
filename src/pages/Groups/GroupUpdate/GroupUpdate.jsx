import {
  FormHelperText,
  Grid,
  OutlinedInput,
  DialogContent
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./GroupUpdate.scss";
import { updateGroup } from "../../../redux/actions/groupAction";
import Modal from "../../../components/Modal";
import Alert from "../../../components/Alert";

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

function GroupUpdate(prop) {
  const { groupId, groupDetail, open, handleClose } = prop;
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
    dispatch(
      updateGroup(groupId, data, handleClose, setLoading, reset, setMessage)
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    setValue("name", groupDetail?.group?.name);
    setValue("description", groupDetail?.group?.description);
    setValue("maximumMembers", groupDetail?.group?.maximumMembers);
  }, [open]);

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

      <Modal
        title="EDIT GROUP"
        loading={loading}
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
                      placeholder="Enter a name"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
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
                    <p className="required form__label">Number of members</p>
                    <OutlinedInput
                      id="maximumMembers"
                      placeholder="Enter a number of members"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
                      type="number"
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Description</p>
                    <OutlinedInput
                      id="description"
                      placeholder="Enter a description"
                      sx={{ width: 500, mb: 1, mt: 1 }}
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

export default GroupUpdate;
