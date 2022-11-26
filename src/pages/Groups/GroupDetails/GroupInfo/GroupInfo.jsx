import { Box, Button, Typography } from "@mui/material";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../../components/Alert";
import GroupUpdate from "../../GroupUpdate/GroupUpdate";

function GroupInfo(prop) {
  const { groupId } = prop;
  const groupDetail = useSelector(
    (state) => {
      /* eslint-disable prefer-destructuring */
      const groups = state.group.groups;
      return groups.find((item) => item.groupId.id === groupId) || [];
    },
    (prev, next) => isEqual(prev, next)
  );
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
    // dispatch lấy detail group ở đây
    console.log("chạy useEffect groupInfo");
    console.log(process.env);
  }, [groupId]);

  return (
    <>
      <Alert message={message} onClose={handleCloseAlert} />

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
          {groupDetail.role === "Owner" && (
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
          {groupDetail?.groupId?.name || ""}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ opacity: "0.5", marginBottom: "12px" }}
        >
          1/{groupDetail?.groupId?.maximumMembers || ""}{" "}
          {groupDetail?.groupId?.maximumMembers > 1 ? "members" : "member"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Description: {groupDetail?.groupId?.description || ""}
        </Typography>
      </Box>

      <GroupUpdate
        groupId={groupId}
        groupDetail={groupDetail}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
}

export default GroupInfo;
