import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { Box, OutlinedInput } from "@mui/material";
import Layout from "../Layout";
import "./Profile.scss";
import BtnEdit from "../../components/Button/BtnEdit";
import Modal from "../../components/Modal";

function Profile() {
  const [isShowPopupEditName, setIsShowPopupEditName] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const onCloseEditNamePopup = () => {
    setIsShowPopupEditName(false);
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
        onActionClick={() => {}}
      >
        <Box>
          <p className="required">First Name</p>
          <OutlinedInput
            placeholder="Please enter first name"
            sx={{ width: 500, mb: 3, mt: 1 }}
          />
          <p className="required">Last Name</p>
          <OutlinedInput
            placeholder="Please enter last name"
            sx={{ width: 500, mb: 3, mt: 1 }}
          />
        </Box>
      </Modal>
    </Layout>
  );
}

export default Profile;
