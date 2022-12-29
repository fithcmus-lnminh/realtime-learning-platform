import {
  FormHelperText,
  Grid,
  OutlinedInput,
  DialogContent,
  Select,
  MenuItem
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isEqual } from "lodash";
import "./PresentationUpdate.scss";
import { updatePresentation } from "../../../redux/actions/presentationAction";
import { getAllGroups } from "../../../redux/actions/groupAction";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

const schema = yup
  .object({
    title: yup.string().required("Please enter presentation title"),
    type: yup.string().required("Please select type of presentation")
  })
  .required();

function PresentationUpdate(prop) {
  const {
    open,
    handleClose,
    presentationDetail = {},
    loading,
    setLoading
  } = prop;
  const dispatch = useDispatch();
  const groups = useSelector(
    (state) => {
      return state.group.groups;
    },
    (prev, next) => isEqual(prev, next)
  );
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  const closeModalHandler = () => {
    handleClose();
    reset();
  };

  const onSubmit = async (data) => {
    let newData = "";
    if (data.type === "public") {
      newData = {
        title: data.title,
        isPublic: true
      };
    } else if (data.type === "private") {
      newData = {
        title: data.title,
        isPublic: false
      };
    }

    setLoading(true);
    dispatch(
      updatePresentation(
        presentationDetail?.id,
        newData,
        handleClose,
        setLoading,
        reset,
        setMessage
      )
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    setValue("title", presentationDetail?.title);
    if (presentationDetail?.isPublic) {
      setValue("type", "public");
    } else {
      setValue("type", "private");
    }
  }, [open]);

  useEffect(() => {
    dispatch(getAllGroups("own"));
  }, [groups]);

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

      <Modal
        title="Update presentation"
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
            <Controller
              name="type"
              defaultValue=""
              control={control}
              render={({ field }) => {
                return (
                  <Grid item xs={12}>
                    <p className="required form__label">Type</p>
                    <Select
                      id="type"
                      sx={{ width: 500, mb: 1, mt: 1 }}
                      fullWidth
                      error={!!errors.type?.message}
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <MenuItem value="private">Private</MenuItem>
                      <MenuItem value="public">Public</MenuItem>
                    </Select>
                    {errors.type?.message && (
                      <FormHelperText
                        sx={{ mb: 2, mt: 0 }}
                        id="component-error-text"
                        error
                      >
                        {errors.type.message}
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
