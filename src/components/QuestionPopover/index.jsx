import React, { useEffect, useState } from "react";
import {
  Popover,
  Box,
  OutlinedInput,
  Tooltip,
  IconButton,
  Select,
  MenuItem
} from "@mui/material";
import "./QuestionPopover.scss";
import {
  BsBookmarkCheckFill,
  BsBookmarkX,
  BsChatLeftDots,
  BsChatRightTextFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsX
} from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import { socket } from "../../utils/socket";
import { getQuestions } from "../../redux/actions/presentationAction";
import { ApiResposeCodeNumber } from "../../constants/api";
import { toCamel } from "../../utils/normalizer";
import { isArrayData } from "../../utils/generator";

function QuestionPopover(prop) {
  const {
    id,
    open,
    anchorEl,
    onClose,
    presentationId,
    isTeacher,
    isPlay = false
  } = prop;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionReply, setQuestionReply] = useState("");
  const [isQuestion, setIsQuestion] = useState(true);
  const [sort, setSort] = useState("newest");

  const dispatch = useDispatch();

  const getPresentationQuestions = async (sortOption) => {
    const sortChoice = sortOption || sort;
    const data = await dispatch(
      getQuestions({ presentationId, limit: 20, sort: sortChoice })
    );
    setQuestions(data);

    socket.on("question-received", (res) => {
      setQuestions([...data, toCamel(res.question)]);
    });
    socket.on("question-updated", (res) => {
      getPresentationQuestions();

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
        setQuestions(newData);
      }
    });
  };

  const sortOptions = [
    {
      key: "newest",
      name: "Newest"
    },
    {
      key: "oldest",
      name: "Oldest"
    },
    {
      key: "most-votes",
      name: "Most votes"
    },
    {
      key: "least-votes",
      name: "Least votes"
    },
    {
      key: "marked",
      name: "Marked"
    },
    {
      key: "unmarked",
      name: "Unmarked"
    }
  ];

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
      if (res.code === ApiResposeCodeNumber.Success) {
        getPresentationQuestions();
      }
    });
  };

  const handleClickMark = (idMark) => {
    socket.emit("mark-answer", { question_id: idMark }, (res) => {
      if (res.code === ApiResposeCodeNumber.Success) {
        getPresentationQuestions();
      }
    });
  };

  const onSendQuestion = (e) => {
    e.preventDefault();

    if (question) {
      socket.emit("send-question", { question }, (res) => {
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
          <span className="question__heading">
            <BsChatRightTextFill /> QUESTION BOX
          </span>
          <Select
            sx={{
              fontSize: "13px",
              width: "120px",
              "& > div": {
                padding: "6px 8px"
              }
            }}
            id="type"
            defaultValue="newest"
            placeholder="Add a filter"
            onChange={(e) => {
              setSort(e.target.value);
              getPresentationQuestions(e.target.value);
            }}
          >
            {sortOptions?.map((option) => (
              <MenuItem
                value={option.key}
                key={option.key}
                sx={{ fontSize: "13px" }}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </h3>
        <div
          className="question__content"
          style={
            /* eslint-disable no-nested-ternary */
            isPlay
              ? isQuestion
                ? { maxHeight: "260px" }
                : { maxHeight: "200px" }
              : isQuestion
              ? { maxHeight: "350px" }
              : { maxHeight: "290px" }
          }
        >
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
                    {m?.questionerType === "User" &&
                      `${m?.questionerId?.firstName} ${m?.questionerId?.lastName}`}
                    {m?.questionerType === "Anonymous" &&
                      `${m?.questionerId?.name}`}
                  </span>
                </Tooltip>
                {": "}
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

                  {isTeacher && (
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
                  )}

                  {isTeacher && (
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
                  )}
                </p>
              </div>

              {isArrayData(m.answers) &&
                m.answers.map((ans) => (
                  <div className="question__answer-container">
                    <Tooltip arrow>
                      <span className="question__name">
                        {ans?.answererId?.firstName} {ans?.answererId?.lastName}
                        :{" "}
                      </span>
                    </Tooltip>
                    {ans?.answer}
                  </div>
                ))}
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
                  {questionReply?.questionerType === "User" &&
                    `${questionReply?.questionerId?.firstName} ${questionReply?.questionerId?.lastName}`}
                  {questionReply?.questionerType === "Anonymous" &&
                    `${questionReply?.questionerId?.name}`}
                </b>
              </span>
              <Tooltip title="Cancel">
                <IconButton onClick={handleClickCancelAnswer}>
                  <BsX style={{ cursor: "pointer" }} />
                </IconButton>
              </Tooltip>
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
