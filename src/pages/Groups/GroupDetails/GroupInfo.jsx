import {
  Alert,
  Box,
  Button,
  DialogContent,
  FormHelperText,
  Grid,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField
} from "@mui/material";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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

function GroupInfo(prop) {
  const { groupId } = prop;
  const groupDetail = useSelector(
    (state) => {
      /* eslint-disable prefer-destructuring */
      const groups = state.group.groups;
      return groups.find((item) => item.groupId.id === groupId) || [];
    },
    (prev, next) => isEqual(prev, next)
  );

  // const { open, handleClose } = prop;
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(createGroup(data, setOpen, setLoading, reset, setMessage));
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  console.log("groupDetail:", groupDetail);

  return (
    <>
      <Box className="group__detail__btn">
        <Box
          sx={{
            margin: "8px 0 24px",
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}
        >
          <Button
            className="button__add-group"
            sx={{ fontSize: 16 }}
            variant="contained"
            color="primary"
            onClick={() => {}}
          >
            Copy Link
          </Button>
          <Button
            className="button__add-group"
            sx={{ fontSize: 16 }}
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Box className="group__detail__container">
        <Box className="group__detail__item">
          <span>Name :</span>
          <TextField
            className="group__detail__text-field"
            variant="standard"
            value={groupDetail?.groupId?.name || ""}
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              }
            }}
          />
        </Box>
        <Box className="group__detail__item">
          <span>Description :</span>
          <TextField
            className="group__detail__text-field"
            variant="standard"
            value={groupDetail?.groupId?.description || ""}
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              }
            }}
          />
        </Box>
        <Box className="group__detail__item">
          <span>Maximum members :</span>
          <TextField
            className="group__detail__text-field"
            variant="standard"
            value={groupDetail?.groupId?.maximumMembers || ""}
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              }
            }}
          />
        </Box>
      </Box>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={message.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            variant="filled"
            onClose={handleCloseAlert}
            severity={message.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message.data}
          </Alert>
        </Snackbar>
      </Stack>

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
                      sx={{ width: 500, mb: 3, mt: 1 }}
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
                      sx={{ width: 500, mb: 3, mt: 1 }}
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

export default GroupInfo;
