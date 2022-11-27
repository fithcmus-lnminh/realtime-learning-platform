import { Snackbar, Stack, Alert as MuiAlert } from "@mui/material";
import React from "react";
import "./Alert.scss";

function Alert(prop) {
  const { message, onClose, duration = 6000 } = prop;
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={message.open}
        autoHideDuration={duration}
        onClose={onClose}
      >
        <MuiAlert
          variant="filled"
          onClose={onClose}
          severity={message.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message.data}
        </MuiAlert>
      </Snackbar>
    </Stack>
  );
}

export default Alert;
