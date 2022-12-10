import React, { useState } from "react";
import { DialogContent, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import "./PresentationDelete.scss";
import { deletePresentation } from "../../../redux/actions/presentationAction";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

function PresentationDelete(prop) {
  const {
    open,
    handleClose,
    presentationDetail = {},
    loading,
    setLoading
  } = prop;
  const dispatch = useDispatch();
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
    dispatch(deletePresentation(id, handleClose, setLoading, setMessage));
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
              {presentationDetail?.title}
            </Typography>{" "}
            and any results.
          </Typography>
        </DialogContent>
      </Modal>
    </>
  );
}

export default PresentationDelete;
