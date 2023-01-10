import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiCopy, BiEditAlt } from "react-icons/bi";
import { groupSocket } from "../../../../utils/socket";
import Alert from "../../../../components/Alert";
import GroupUpdate from "../../GroupUpdate/GroupUpdate";
import { getGroupUsers } from "../../../../redux/actions/groupAction";
import "./GroupInfo.scss";

function GroupInfo(prop) {
  const { groupId } = prop;
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.user.userInfo,
    (prev, next) => isEqual(prev, next)
  );
  const {
    groupDetail,
    owner: groupOwner,
    total_users
  } = useSelector(
    (state) => {
      return state.group;
    },
    (prev, next) => isEqual(prev, next)
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  const [messagePresentation, setMessagePresentation] = useState("");
  const [presentationInfo, setPresentationInfo] = useState({});

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  const handleCopyLink = () => {
    setMessage({
      ...message,
      success: true,
      data: "Copy link successfully",
      open: true
    });

    navigator.clipboard.writeText(
      `${window.location.origin}/invite/${groupId}`
    );
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getGroupUsers(groupId, setLoading));

    groupSocket.emit("join-group", { group_id: groupId }, (data) => {
      console.log(data);
    });
  }, [groupId]);

  useEffect(() => {
    groupSocket.on("start-presentation", (notification) => {
      const { message: messageTitle, data } = notification;

      setMessagePresentation(messageTitle);
      setPresentationInfo(data);
    });

    groupSocket.on("end-presentation", () => {
      setMessagePresentation("");
      setPresentationInfo({});
    });

    return () => {
      groupSocket.off("start-presentation");
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        margin: "20px auto",
        position: "relative"
      }}
    >
      <Alert message={message} onClose={handleCloseAlert} />

      {loading ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%"
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            mb: 0,
            justifyContent: "space-between"
          }}
        >
          {groupDetail &&
          typeof groupDetail === "object" &&
          !Array.isArray(groupDetail) &&
          Object.keys(groupDetail).length > 0 ? (
            <div>
              {messagePresentation && (
                <div className="group__notification">
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ marginBottom: "12px" }}
                  >
                    {messagePresentation}.{" "}
                    <a href={`/play/${presentationInfo?.access_code}`}>
                      <Typography variant="span" sx={{ fontWeight: 600 }}>
                        JOIN NOW
                      </Typography>
                    </a>
                  </Typography>
                </div>
              )}
              <Typography variant="h4" gutterBottom>
                {groupDetail?.name || ""}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ opacity: "0.5", marginBottom: "12px" }}
              >
                {total_users}/{groupDetail?.maximumMembers || ""}{" "}
                {groupDetail?.maximumMembers > 1 ? "members" : "member"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {groupDetail?.description || ""}
              </Typography>
            </div>
          ) : (
            <Box sx={{ width: "100px" }} />
          )}

          <Box className="group__detail__btn">
            <Box
              sx={{
                margin: "8px 0 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px"
              }}
            >
              <Button
                className="button__add-group"
                sx={{ fontSize: 16 }}
                variant="outlined"
                color="primary"
                onClick={handleCopyLink}
              >
                <BiCopy /> Copy Link Invite
              </Button>
              {groupOwner?.email === userInfo?.email && (
                <Button
                  className="button__add-group"
                  sx={{ fontSize: 16 }}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                >
                  <BiEditAlt /> Edit
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <GroupUpdate
        groupId={groupId}
        groupDetail={groupDetail}
        open={open}
        loading={loading}
        setLoading={setLoading}
        handleClose={handleClose}
      />
    </Box>
  );
}

export default GroupInfo;
