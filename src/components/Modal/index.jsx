import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
      maxWidth={false}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={onCloseModal}>
        <span className="modal__title">{title}</span>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box sx={{ px: 3, py: 1 }}>{children}</Box>
        <div className="button__actions">
          {isShowCancelButton && (
            <Button variant="outlined" color="secondary" onClick={onCloseModal}>
              Cancel
            </Button>
          )}
          {isShowSubmitButton && (
            <Button
              autoFocus
              disabled={loading}
              variant="contained"
              onClick={onActionClick}
            >
              {loading ? "Loading..." : actionText}
            </Button>
          )}
        </div>
      </DialogContent>
    </BootstrapDialog>
  );
}

export default Modal;
