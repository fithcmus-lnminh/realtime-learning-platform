import React, { useState } from "react";
import { DialogContent, Typography } from "@mui/material";
import "./PresentationDelete.scss";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

function PresentationDelete(prop) {
  const { open, handleClose, presentationDetail = {} } = prop;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  const closeModalHandler = () => {
    handleClose();
  };

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  const handleClickDelete = (id) => {
    setLoading(true);
    console.log("delete id:", id);
    // dispatch(handleDelete);
  };

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

      <Modal
        title="Delete presentation?"
        loading={loading}
        actions={["Cancel", "OK"]}
        actionText="Delete"
        show={open}
        onCloseModal={closeModalHandler}
        onActionClick={() => handleClickDelete(presentationDetail?.id)}
      >
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: "16px" }} gutterBottom>
            This will permanently delete{" "}
            <Typography variant="span" sx={{ fontWeight: 600 }}>
              {presentationDetail?.name}
            </Typography>{" "}
            and any results.
          </Typography>
        </DialogContent>
      </Modal>
    </>
  );
}

export default PresentationDelete;
