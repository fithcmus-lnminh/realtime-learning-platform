import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import "./Modal.scss";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

/* eslint-disable react/prop-types */
function BootstrapDialogTitle(prop) {
  const { children, onClose, ...other } = prop;

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <DialogTitle sx={{ m: 0, px: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function Modal(prop) {
  const {
    show,
    title,
    actions = ["Cancel", "OK"],
    actionText = "OK",
    loading = false,
    onCloseModal,
    onActionClick,
    children
  } = prop;

  const isShowSubmitButton = actions?.includes("OK");
  const isShowCancelButton = actions?.includes("Cancel");

  return (
    <BootstrapDialog
      onClose={onCloseModal}
      aria-labelledby="customized-dialog-title"
      open={show}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={onCloseModal}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent>
        {children}
        <div className="button__actions">
          {isShowCancelButton && (
            <Button variant="outlined" color="secondary" onClick={onCloseModal}>
              Cancel
            </Button>
          )}
          {isShowSubmitButton && (
            <LoadingButton
              autoFocus
              loading={loading}
              // loadingPosition="end"
              variant="contained"
              onClick={onActionClick}
            >
              {actionText}
            </LoadingButton>
          )}
        </div>
      </DialogContent>
    </BootstrapDialog>
  );
}

export default Modal;
