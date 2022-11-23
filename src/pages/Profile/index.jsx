import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { Box, OutlinedInput } from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../Layout";
import "./Profile.scss";
import BtnEdit from "../../components/Button/BtnEdit";
import Modal from "../../components/Modal";

function Profile() {
  const [isShowPopupEditName, setIsShowPopupEditName] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const schema = yup.object().shape({
    firstName: yup.string().required().label("First name"),
    lastName: yup.string().required().label("Last name")
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const editUserNameHandler = (data) => {
    console.log(data);
  };

  const onCloseEditNamePopup = () => {
    setIsShowPopupEditName(false);
    reset();
  };

  return (
    <Layout itemId={3}>
      <h2 className="common__title">MY ACCOUNT</h2>
      <div className="profile__container">
        <div className="profile__item">
          <span>First Name :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={userInfo?.firstName || ""}
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
          <span>Last Name :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={userInfo?.lastName || ""}
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
          <span>Join Date :</span>
          <TextField
            className="profile__text-field"
            variant="standard"
            value={new Date(userInfo?.createdAt).toLocaleString("en") || ""}
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
        show={isShowPopupEditName}
        onCloseModal={onCloseEditNamePopup}
        onActionClick={handleSubmit(editUserNameHandler)}
      >
        <Box>
          <p className="required edit__label">First Name</p>
          <OutlinedInput
            placeholder="Please enter first name"
            sx={{ width: 500, mb: 3, mt: 1 }}
            /* eslint-disable react/jsx-props-no-spreading */
            {...register("firstName")}
          />
          <p className="auth__error">{errors.firstName?.message}</p>
          <p className="required edit__label">Last Name</p>
          <OutlinedInput
            placeholder="Please enter last name"
            sx={{ width: 500, mb: 3, mt: 1 }}
            /* eslint-disable react/jsx-props-no-spreading */
            {...register("lastName")}
          />
          <p className="auth__error">{errors.lastName?.message}</p>
        </Box>
      </Modal>
    </Layout>
  );
}

export default Profile;
