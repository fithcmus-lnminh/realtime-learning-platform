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
import {
  changeUserPassword,
  updateProfile
} from "../../redux/actions/userAction";

function Profile() {
  const [isShowPopupEditName, setIsShowPopupEditName] = useState(false);
  const [isShowPopupEditPassword, setIsShowPopupEditPassword] = useState(false);
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

  const schemaPassword = yup.object().shape({
    currentPassword: yup.string().min(8).label("Current password"),
    newPassword: yup.string().min(8).label("New password"),
    confirmNewPassword: yup
      .string()
      .min(8)
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .label("Confirm new password")
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isDirty: isDirtyPassword },
    reset: resetFormPassword
  } = useForm({
    resolver: yupResolver(schemaPassword)
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

  const onCloseEditPasswordPopup = () => {
    setIsShowPopupEditPassword(false);
    resetFormPassword();
  };

  const editUserNameHandler = (data) => {
    dispatch(
      updateProfile(data, setIsLoading, setAlertStatus, setIsShowPopupEditName)
    );
  };

  const editPasswordHandler = (data) => {
    dispatch(
      changeUserPassword(
        data,
        setIsLoading,
        setAlertStatus,
        setIsShowPopupEditPassword
      )
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
              endAdornment: (
                <BtnEdit onClick={() => setIsShowPopupEditPassword(true)} />
              )
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

      <Modal
        title="CHANGE PASSWORD"
        actionText="Change"
        loading={isLoading}
        show={isShowPopupEditPassword}
        disableAction={!isDirtyPassword}
        onCloseModal={onCloseEditPasswordPopup}
        onActionClick={handleSubmitPassword(editPasswordHandler)}
      >
        <p className="required edit__label first">Current Password</p>
        <OutlinedInput
          placeholder="Please enter your current password"
          type="password"
          sx={{ width: 500 }}
          error={errorsPassword?.currentPassword}
          /* eslint-disable react/jsx-props-no-spreading */
          {...registerPassword("currentPassword")}
        />
        <p className="validation__error">
          {errorsPassword.currentPassword?.message}
        </p>
        <p className="required edit__label">New Password</p>
        <OutlinedInput
          placeholder="Please enter new passwprd"
          type="password"
          sx={{ width: 500 }}
          error={errorsPassword?.newPassword}
          /* eslint-disable react/jsx-props-no-spreading */
          {...registerPassword("newPassword")}
        />
        <p className="validation__error">
          {errorsPassword.newPassword?.message}
        </p>
        <p className="required edit__label">Confirm New Password</p>
        <OutlinedInput
          placeholder="Please enter confirm new password"
          type="password"
          sx={{ width: 500 }}
          error={errorsPassword?.confirmNewPassword}
          /* eslint-disable react/jsx-props-no-spreading */
          {...registerPassword("confirmNewPassword")}
        />
        <p className="validation__error">
          {errorsPassword.confirmNewPassword?.message}
        </p>
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
