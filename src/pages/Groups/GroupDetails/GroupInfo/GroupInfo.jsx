import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../../../components/Alert";
import { getGroup } from "../../../../redux/actions/groupAction";
import GroupUpdate from "../../GroupUpdate/GroupUpdate";

function GroupInfo(prop) {
  const { groupId, value } = prop;
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.user.userInfo,
    (prev, next) => isEqual(prev, next)
  );
  const groupDetail = useSelector(
    (state) => {
      return state.group.groupDetail;
    },
    (prev, next) => isEqual(prev, next)
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

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
      `${process.env.REACT_APP_CLIENT_URL}/invite/${groupId}`
    );
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getGroup(groupId, setLoading));
  }, [groupId, value]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        margin: "20px auto"
      }}
    >
      <Alert message={message} onClose={handleCloseAlert} />

      {loading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
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
                variant="contained"
                color="primary"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
              {groupDetail?.owner?.email === userInfo?.email && (
                <Button
                  className="button__add-group"
                  sx={{ fontSize: 16 }}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ mt: 5, mb: 0 }}>
            <Typography variant="h4" gutterBottom>
              {groupDetail?.group?.name || ""}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ opacity: "0.5", marginBottom: "12px" }}
            >
              {groupDetail.totalMembers}/
              {groupDetail?.group?.maximumMembers || ""}{" "}
              {groupDetail?.group?.maximumMembers > 1 ? "members" : "member"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Description: {groupDetail?.group?.description || ""}
            </Typography>
          </Box>

          <GroupUpdate
            groupId={groupId}
            groupDetail={groupDetail}
            open={open}
            handleClose={handleClose}
          />
        </>
      )}
    </Box>
  );
}

export default GroupInfo;
