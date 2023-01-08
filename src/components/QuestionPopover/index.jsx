import React, { useEffect, useState } from "react";
import {
  Popover,
  Box,
  OutlinedInput,
  Tooltip,
  Chip,
  IconButton
} from "@mui/material";
import "./QuestionPopover.scss";
import {
  BsBookmarkCheckFill,
  BsBookmarkX,
  BsChatLeftDots,
  BsChatRightTextFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill
} from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import { socket } from "../../utils/socket";
import { getQuestions } from "../../redux/actions/presentationAction";
import { ApiResposeCodeNumber } from "../../constants/api";
import { toCamel } from "../../utils/normalizer";

function QuestionPopover(prop) {
  const { id, open, anchorEl, onClose, presentationId, isTeacher } = prop;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionReply, setQuestionReply] = useState("");
  const [isQuestion, setIsQuestion] = useState(true);

  const dispatch = useDispatch();

  const getPresentationQuestions = async () => {
    const data = await dispatch(getQuestions({ presentationId, limit: 20 }));
    setQuestions(data);

    console.log("data:", data);

    socket.on("question-received", (res) => {
      console.log("res question-received", res);
      setQuestions([...data, toCamel(res.question)]);
    });
    socket.on("question-updated", (res) => {
      console.log("res question-updated", res);
      const questionUpdated = toCamel(res.question);
      if (data.length > 0) {
        const newData = data.map((item) => {
          if (item.id === questionUpdated.id) {
            return {
              ...item,
              ...questionUpdated
            };
          }
          return item;
        });
        console.log("newData:", newData);
        setQuestions(newData);
      }
    });
  };

  const handleClickAnswer = (data) => {
    setIsQuestion(false);
    setQuestionReply(data);
  };

  const handleClickCancelAnswer = () => {
    setIsQuestion(true);
    setQuestionReply("");
  };

  const handleClickUpvote = (idVote) => {
    socket.emit("vote-question", { question_id: idVote }, (res) => {
      console.log("res vote-question:", res);
      if (res.code === ApiResposeCodeNumber.Success) {
        getPresentationQuestions();
      }
    });
  };

  const handleClickMark = (idMark) => {
    socket.emit("mark-answer", { question_id: idMark }, (res) => {
      console.log("res mark-answer:", res);
      if (res.code === ApiResposeCodeNumber.Success) {
        getPresentationQuestions();
      }
    });
  };

  const onSendQuestion = (e) => {
    e.preventDefault();

    if (question) {
      socket.emit("send-question", { question }, (res) => {
        console.log("res send-question:", res);
        if (res.code === ApiResposeCodeNumber.Success) {
          getPresentationQuestions();
        }
      });
      setQuestion("");
      const chatContentElement = document.querySelector(".question__content");
      if (chatContentElement?.scrollTop)
        chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
  };

  const onSendAnswer = (e) => {
    e.preventDefault();

    if (answer) {
      socket.emit(
        "send-answer",
        { question_id: questionReply.id, answer },
        (res) => {
          console.log("res send-answer:", res);
          if (res.code === ApiResposeCodeNumber.Success) {
            getPresentationQuestions();
          }
        }
      );
      setAnswer("");
      handleClickCancelAnswer();
      const chatContentElement = document.querySelector(".question__content");
      if (chatContentElement?.scrollTop)
        chatContentElement.scrollTop = chatContentElement.scrollHeight;
    }
  };

  useEffect(() => {
    getPresentationQuestions();

    const chatContentElement = document.querySelector(".question__content");
    if (chatContentElement?.scrollTop)
      chatContentElement.scrollTop = chatContentElement.scrollHeight;

    return () => {
      socket.off("question-received");
      socket.off("question-updated");
    };
  }, []);

  console.log("*** questions:", questions);
  console.log("isTeacher:", isTeacher);
  // console.log("question:", question);
  // console.log("answer:", answer);
  // console.log("questionReply:", questionReply);
  // console.log("userInfo:", userInfo);
  // console.log("isQuestion:", isQuestion);

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
            <>
              <div className="question__message-container" key={m.id}>
                <Tooltip
                  title={new Date(m.createdAt).toLocaleString("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })}
                  arrow
                >
                  <span className="question__name">
                    {m.questionerId.firstName} {m.questionerId.lastName}:{" "}
                  </span>
                </Tooltip>
                {m.question}
                <p className="question__action">
                  <span className="question__action-vote">
                    <span>{m?.totalVotes ? m.totalVotes : "0"}</span>
                    <Tooltip title="Upvote">
                      <IconButton
                        sx={{
                          fontSize: "16px"
                        }}
                        onClick={() => handleClickUpvote(m.id)}
                      >
                        {m.isVoted ? (
                          <BsHandThumbsUpFill />
                        ) : (
                          <BsHandThumbsUp />
                        )}
                      </IconButton>
                    </Tooltip>
                  </span>

                  <Tooltip title="Answer">
                    <IconButton
                      sx={{
                        fontSize: "16px"
                      }}
                      onClick={() => handleClickAnswer(m)}
                    >
                      <span className="question__action-comment">
                        <BsChatLeftDots />
                      </span>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Mark">
                    <IconButton
                      sx={{
                        fontSize: "16px"
                      }}
                      onClick={() => (isTeacher ? handleClickMark(m.id) : {})}
                    >
                      <span
                        className="question__action-mark"
                        style={{
                          cursor: `${isTeacher ? "pointer" : "default"}`
                        }}
                      >
                        {m.isAnswered ? (
                          <BsBookmarkCheckFill />
                        ) : (
                          <BsBookmarkX />
                        )}
                      </span>
                    </IconButton>
                  </Tooltip>
                </p>
              </div>

              {m.answer && (
                <div className="question__answer-container">
                  <Tooltip
                    title={new Date(m.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short"
                    })}
                    arrow
                  >
                    <span className="question__name">
                      {m?.answererId?.firstName} {m?.answererId?.lastName}:{" "}
                    </span>
                  </Tooltip>
                  {m.answer}
                </div>
              )}
            </>
          ))}
        </div>

        {isQuestion ? (
          <div className="question__send">
            <form style={{ width: "100%" }} onSubmit={onSendQuestion}>
              <OutlinedInput
                value={question}
                className="question__textbox"
                placeholder="Type a question..."
                onChange={(e) => setQuestion(e.target.value)}
              />
            </form>
            <IoMdSend
              size={30}
              onClick={onSendQuestion}
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <div className="question__wrapper">
            <p>
              <span>
                Replying to{" "}
                <b>
                  {questionReply?.questionerId?.firstName}{" "}
                  {questionReply?.questionerId?.lastName}
                </b>
              </span>
              <Chip label="Cancel" onDelete={handleClickCancelAnswer} />
            </p>
            <div className="question__send-answer">
              <form style={{ width: "100%" }} onSubmit={onSendAnswer}>
                <OutlinedInput
                  value={answer}
                  className="question__textbox"
                  placeholder="Type a answer..."
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </form>
              <IoMdSend
                size={30}
                onClick={onSendAnswer}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        )}
      </Box>
    </Popover>
  );
}

export default QuestionPopover;
