import React from "react";
import { Popover, Box, OutlinedInput } from "@mui/material";
import "./MessagePopover.scss";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

function MassagePopover(prop) {
  const { id, open, anchorEl, onClose } = prop;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
    >
      <Box p={2} width={500}>
        <h3 className="chat__header">
          <BsChatRightTextFill /> CHAT BOX
        </h3>
        <div className="chat__content">
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
            Hello cac ban Hello cac ban Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
          <div className="chat__message-container">
            <span className="chat__name">Nguyen Van A: </span> Hello cac ban
          </div>
        </div>

        <div className="chat__send">
          <OutlinedInput
            className="chat__textbox"
            placeholder="Type a message..."
          />
          <IoMdSend size={30} />
        </div>
      </Box>
    </Popover>
  );
}

export default MassagePopover;
