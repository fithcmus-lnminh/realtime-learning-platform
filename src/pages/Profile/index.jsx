import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { Alert, OutlinedInput, Snackbar, Stack } from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../Layout";
import "./Profile.scss";
import BtnEdit from "../../components/Button/BtnEdit";
import Modal from "../../components/Modal";
import { updateProfile } from "../../redux/actions/userAction";

function Profile() {
  const [isShowPopupEditName, setIsShowPopupEditName] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState({
    success: false,
    message: "",
    open: false
  });
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    firstName: yup.string().required().label("First name"),
    lastName: yup.string().required().label("Last name")
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const defaultValues = {};
    defaultValues.firstName = userInfo?.firstName;
    defaultValues.lastName = userInfo?.lastName;
    reset({ ...defaultValues });
  }, [userInfo]);

  const onCloseEditNamePopup = () => {
    setIsShowPopupEditName(false);
    reset();
  };

  const editUserNameHandler = (data) => {
    dispatch(
      updateProfile(data, setIsLoading, setAlertStatus, setIsShowPopupEditName)
    );
  };

  const handleCloseAlert = () => {
    setAlertStatus({
      ...alertStatus,
      open: false
    });
  };

  return (
    <Layout itemId={3}>
      <h2 className="common__title">MY ACCOUNT</h2>
      <div className="profile__container">
        <div className="profile__item">
          <span>Full Name :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              },
              endAdornment: (
                <BtnEdit
                  onClick={() => {
                    setIsShowPopupEditName(true);
                  }}
                />
              )
            }}
          />
        </div>
        <div className="profile__item">
          <span>Email :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={userInfo?.email || ""}
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              }
            }}
          />
        </div>
        <div className="profile__item">
          <span>Password :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value="0000000000"
            type="password"
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              },
              endAdornment: <BtnEdit />
            }}
          />
        </div>
        <div className="profile__item">
          <span>Account Type : </span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={
              userInfo?.source === "google"
                ? "Google Account"
                : "Normal Account"
            }
            InputProps={{
              readOnly: true,
              style: {
                fontSize: 18
              }
            }}
          />
        </div>
      </div>
      <Modal
        title="EDIT NAME"
        actionText="Edit"
        loading={isLoading}
        show={isShowPopupEditName}
        disableAction={!isDirty}
        onCloseModal={onCloseEditNamePopup}
        onActionClick={handleSubmit(editUserNameHandler)}
      >
        <p className="required edit__label first">First Name</p>
        <OutlinedInput
          placeholder="Please enter first name"
          sx={{ width: 500 }}
          error={errors.firstName}
          /* eslint-disable react/jsx-props-no-spreading */
          {...register("firstName")}
        />
        <p className="validation__error">{errors.firstName?.message}</p>
        <p className="required edit__label">Last Name</p>
        <OutlinedInput
          placeholder="Please enter last name"
          sx={{ width: 500 }}
          error={errors.lastName}
          /* eslint-disable react/jsx-props-no-spreading */
          {...register("lastName")}
        />
        <p className="validation__error">{errors.lastName?.message}</p>
      </Modal>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={alertStatus.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            variant="filled"
            onClose={handleCloseAlert}
            severity={alertStatus.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {alertStatus.data}
          </Alert>
        </Snackbar>
      </Stack>
    </Layout>
  );
}

export default Profile;
