import React, { useEffect, useState } from "react";
import { Popover, Box, OutlinedInput, Tooltip } from "@mui/material";
import "./MessagePopover.scss";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { getMessages } from "../../redux/actions/presentationAction";
import { ApiResposeCodeNumber } from "../../constants/api";
import { toCamel } from "../../utils/normalizer";

function MassagePopover(prop) {
  const { id, open, anchorEl, onClose, presentationId } = prop;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const getPresentationMessages = async () => {
    const data = await dispatch(getMessages({ presentationId, limit: 20 }));
    setMessages(data);

    socket.on("message-received", (res) => {
      setMessages([...data, toCamel(res.message)]);
    });
  };

  const onSendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("send-message", { content: message }, (res) => {
        if (res.code === ApiResposeCodeNumber.Success) {
          getPresentationMessages();
        }
      });
      setMessage("");
      const chatContentElement = document.querySelector(".chat__content");
      chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
  };

  useEffect(() => {
    getPresentationMessages();
  }, []);

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
          {messages?.map((m) => (
            <div
              style={{
                textAlign: m.senderId.id === userInfo?.id ? "right" : "left"
              }}
              className="chat__message-container"
              key={m.id}
            >
              <Tooltip
                title={new Date(m.createdAt).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short"
                })}
                arrow
              >
                <span className="chat__name">
                  {m.senderId.firstName} {m.senderId.lastName}:{" "}
                </span>
              </Tooltip>
              {m.content}
            </div>
          ))}
        </div>

        <div className="chat__send">
          <form style={{ width: "100%" }} onSubmit={onSendMessage}>
            <OutlinedInput
              value={message}
              className="chat__textbox"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
          <IoMdSend size={30} onClick={onSendMessage} />
        </div>
      </Box>
    </Popover>
  );
}

export default MassagePopover;
