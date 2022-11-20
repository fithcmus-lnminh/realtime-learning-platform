import React from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import Layout from "../Layout";
import "./Profile.scss";
import BtnEdit from "../../components/Button/BtnEdit";

function Profile() {
  const { userInfo } = useSelector((state) => state.user);

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
              endAdornment: <BtnEdit />
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
              endAdornment: <BtnEdit />
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
    </Layout>
  );
}

export default Profile;
