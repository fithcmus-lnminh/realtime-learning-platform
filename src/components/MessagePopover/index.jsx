import React, { useEffect, useState } from "react";
import { Popover, Box, OutlinedInput, Tooltip } from "@mui/material";
import "./MessagePopover.scss";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { getMessages } from "../../redux/actions/presentationAction";
import { ApiResposeCodeNumber } from "../../constants/api";
import { deepEqual } from "../../utils/objectHelper";

function MassagePopover(prop) {
  const { id, open, anchorEl, onClose, presentationId } = prop;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(20);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const getPresentationMessages = async () => {
    const data = await dispatch(getMessages({ presentationId, limit }));

    if (!deepEqual(data, messages)) {
      setMessages(data);
    }
  };

  const onScroll = () => {
    const content = document.querySelector(".chat__content");
    const contentScrollTop = content.scrollTop;

    if (contentScrollTop === 0) {
      setIsLoadMore(true);
      setLimit(limit + 20);
    }
  };

  const onSendMessage = (e) => {
    e.preventDefault();
    setIsLoadMore(false);

    if (message) {
      socket.emit("send-message", { content: message }, async (res) => {
        if (res.code === ApiResposeCodeNumber.Success) {
          await getPresentationMessages();
          setLimit(limit + 1);
        }
      });
      setMessage("");
      const chatContentElement = document.querySelector(".chat__content");
      if (chatContentElement?.scrollTop)
        chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
  };

  useEffect(() => {
    getPresentationMessages();

    socket.on("message-received", async () => {
      await getPresentationMessages();
      setLimit(limit + 1);
      const chatContentElement = document.querySelector(".chat__content");
      if (chatContentElement)
        chatContentElement.scrollTop = chatContentElement.scrollHeight;
    });
  }, []);

  useEffect(() => {
    const chatContentElement = document.querySelector(".chat__content");
    if (messages.length > 0 && chatContentElement && !isLoadMore) {
      chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
    if (messages.length > 0 && chatContentElement && isLoadMore) {
      chatContentElement.scrollTop = chatContentElement.scrollHeight / 2;
    }
  }, [messages]);

  useEffect(() => {
    getPresentationMessages();
  }, [limit]);

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
        <div className="chat__content" onScroll={onScroll}>
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
                  {m.senderType === "User"
                    ? `${m.senderId.firstName} ${m.senderId.lastName}: `
                    : `${m.senderId.name}: `}
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
