import React, { useEffect, useState } from "react";
import { Popover, Box, OutlinedInput, Tooltip } from "@mui/material";
import "./QuestionPopover.scss";
import {
  BsChatLeftDots,
  BsChatRightTextFill,
  BsHandThumbsUp
  // BsHandThumbsUpFill
} from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import { getMessages } from "../../redux/actions/presentationAction";
import { ApiResposeCodeNumber } from "../../constants/api";
import { toCamel } from "../../utils/normalizer";

// const messagesDemo = [
//   {
//     id: "63b8598a57c4e56de1a569b6",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63b6f7c6581b7dbd374b685f",
//       firstName: "Demo",
//       lastName: "Account"
//     },
//     content: "alo 113",
//     createdAt: "2023-01-06T17:25:30.349Z",
//     updatedAt: "2023-01-06T17:25:30.349Z",
//     v: 0
//   },
//   {
//     id: "63b8598f57c4e56de1a569c1",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63b6f7c6581b7dbd374b685f",
//       firstName: "Demo",
//       lastName: "Account"
//     },
//     content: "co khong ne",
//     createdAt: "2023-01-06T17:25:35.665Z",
//     updatedAt: "2023-01-06T17:25:35.665Z",
//     v: 0
//   },
//   {
//     id: "63b8599757c4e56de1a569cc",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63b6f7c6581b7dbd374b685f",
//       firstName: "Demo",
//       lastName: "Account"
//     },
//     content: "bạn khỏe không",
//     createdAt: "2023-01-06T17:25:43.429Z",
//     updatedAt: "2023-01-06T17:25:43.429Z",
//     v: 0
//   },
//   {
//     id: "63b859b457c4e56de1a569d7",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63b6f7c6581b7dbd374b685f",
//       firstName: "Demo",
//       lastName: "Account"
//     },
//     content: "33rr4",
//     createdAt: "2023-01-06T17:26:12.008Z",
//     updatedAt: "2023-01-06T17:26:12.008Z",
//     v: 0
//   },
//   {
//     id: "63b859eb57c4e56de1a56a05",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63764b8680d93d7e11e696ec",
//       firstName: "Huỳnh",
//       lastName: "Long Pyn01"
//     },
//     content: "1233",
//     createdAt: "2023-01-06T17:27:07.152Z",
//     updatedAt: "2023-01-06T17:27:07.152Z",
//     v: 0
//   },
//   {
//     id: "63b85a5f57c4e56de1a56a1a",
//     presentationId: "63b30fd3436f8bfabb496f12",
//     senderType: "User",
//     senderId: {
//       id: "63b6f7c6581b7dbd374b685f",
//       firstName: "Demo",
//       lastName: "Account"
//     },
//     content: "uaw",
//     createdAt: "2023-01-06T17:29:03.306Z",
//     updatedAt: "2023-01-06T17:29:03.306Z",
//     v: 0
//   }
// ];

function QuestionPopover(prop) {
  const { id, open, anchorEl, onClose, presentationId } = prop;

  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const getPresentationQuestions = async () => {
    const data = await dispatch(getMessages({ presentationId, limit: 20 }));
    setQuestions(data);

    socket.on("message-received", (res) => {
      setQuestions([...data, toCamel(res.message)]);
    });
    // socket.on("question-received", (res) => {
    //   setQuestions([...data, toCamel(res.message)]);
    // });
  };

  const onSendQuestion = (e) => {
    e.preventDefault();

    if (question) {
      socket.emit("send-message", { content: question }, (res) => {
        if (res.code === ApiResposeCodeNumber.Success) {
          getPresentationQuestions();
        }
      });
      // socket.emit("send-question", { content: question }, (res) => {
      //   if (res.code === ApiResposeCodeNumber.Success) {
      //     getPresentationQuestions();
      //   }
      // });
      setQuestion("");
      const chatContentElement = document.querySelector(".question__content");
      if (chatContentElement?.scrollTop)
        chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
  };

  // const onSendAnswer = (e) => {
  //   e.preventDefault();

  //   if (question) {
  //     socket.emit("send-answer", { content: { question_id, answer } }, (res) => {
  //       if (res.code === ApiResposeCodeNumber.Success) {
  //         getPresentationQuestions();
  //       }
  //     });
  //     setAnswer("");
  //     const chatContentElement = document.querySelector(".question__content");
  //     if (chatContentElement?.scrollTop)
  //       chatContentElement.scrollTop = chatContentElement.scrollHeight;
  //   }
  // };

  useEffect(() => {
    getPresentationQuestions();

    const chatContentElement = document.querySelector(".question__content");
    console.log(chatContentElement);
    if (chatContentElement?.scrollTop)
      chatContentElement.scrollTop = chatContentElement.scrollHeight;
  }, []);

  console.log("questions:", questions);

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
        <h3 className="question__header">
          <BsChatRightTextFill /> QUESTION BOX
        </h3>
        <div className="question__content">
          {questions?.map((m) => (
            <div
              style={{
                // textAlign: m.senderId.id === userInfo?.id ? "right" : "left",
                marginLeft: m.senderId.id === userInfo?.id ? "0px" : "16px"
              }}
              className="question__message-container"
              key={m.id}
            >
              <Tooltip
                title={new Date(m.createdAt).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short"
                })}
                arrow
              >
                <span className="question__name">
                  {m.senderId.firstName} {m.senderId.lastName}:{" "}
                </span>
              </Tooltip>
              {m.content}
              <p className="question__action">
                <span className="question__action-vote">
                  <span>1</span>
                  <BsHandThumbsUp />
                </span>
                <span className="question__action-comment">
                  <BsChatLeftDots />
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="question__send">
          <form style={{ width: "100%" }} onSubmit={onSendQuestion}>
            <OutlinedInput
              value={question}
              className="question__textbox"
              placeholder="Type a question..."
              onChange={(e) => setQuestion(e.target.value)}
            />
          </form>
          <IoMdSend size={30} onClick={onSendQuestion} />
        </div>
      </Box>
    </Popover>
  );
}

export default QuestionPopover;
