import {
  FormHelperText,
  Grid,
  OutlinedInput,
  DialogContent,
  Select,
  MenuItem
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isEqual } from "lodash";
import "./PresentationAddNew.scss";
import { createPresentation } from "../../../redux/actions/presentationAction";
import { getAllGroups } from "../../../redux/actions/groupAction";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

const schema = yup
  .object({
    title: yup.string().required("Please enter presentation title"),
    type: yup.string().required("Please select type of presentation")
  })
  .required();

function PresentationAddNew(prop) {
  const { open, handleClose, loading, setLoading } = prop;
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
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [errorGroup, setErrorGroup] = useState("");
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  const closeModalHandler = () => {
    handleClose();
    reset();
  };

  const typePresentation = watch("type");

  const onSubmit = async (data) => {
    let newData = "";
    if (data.type === "public") {
      newData = {
        title: data.title
      };
    } else if (data.type === "private") {
      if (data.groupId === "") {
        setErrorGroup("Please select group of presentation");
        return;
      }
      newData = {
        title: data.title,
        groupId: data.groupId
      };
    }

    setLoading(true);
    dispatch(
      createPresentation(newData, handleClose, setLoading, reset, setMessage)
    );
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  useEffect(() => {
    dispatch(getAllGroups("own"));
  }, [groups]);

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

      <Modal
        title="Create new presentation"
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
              name="title"
              defaultValue=""
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
                        if (e.target.value === "public") {
                          setValue("groupId", "");
                          setErrorGroup("");
                        }
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
            {typePresentation === "private" && (
              <Controller
                name="groupId"
                defaultValue=""
                control={control}
                render={({ field }) => {
                  return (
                    <Grid item xs={12}>
                      <p className="required form__label">Group</p>
                      <Select
                        id="groupId"
                        sx={{ width: 500, mb: 1, mt: 1 }}
                        fullWidth
                        error={!!errorGroup}
                        /* eslint-disable react/jsx-props-no-spreading */
                        {...field}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setErrorGroup(
                              "Please select group of presentation"
                            );
                          } else {
                            setErrorGroup("");
                          }
                          field.onChange(e);
                        }}
                      >
                        {groups.length > 0
                          ? groups.map((group) => (
                              <MenuItem
                                value={group?.groupId.id}
                                key={group?.groupId?.id}
                              >
                                {group?.groupId?.name}
                              </MenuItem>
                            ))
                          : null}
                      </Select>
                      {errorGroup && (
                        <FormHelperText
                          sx={{ mb: 2, mt: 0 }}
                          id="component-error-text"
                          error
                        >
                          {errorGroup}
                        </FormHelperText>
                      )}
                    </Grid>
                  );
                }}
              />
            )}
          </Grid>
        </DialogContent>
      </Modal>
    </>
  );
}

export default PresentationAddNew;
