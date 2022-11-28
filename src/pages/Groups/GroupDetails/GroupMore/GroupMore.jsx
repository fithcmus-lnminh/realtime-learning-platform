import React, { useState } from "react";
import { Alert, Button, Stack, Snackbar } from "@mui/material";
import { isEqual } from "lodash";
import { red } from "@mui/material/colors";
import { ImExit } from "react-icons/im";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroup, leaveGroup } from "../../../../redux/actions/groupAction";

function GroupMore(prop) {
  const { groupId } = prop;
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.user.userInfo,
    (prev, next) => isEqual(prev, next)
  );
  const groupOwner = useSelector(
    (state) => {
      return state.group.owner;
    },
    (prev, next) => isEqual(prev, next)
  );
  const [alertStatus, setAlertStatus] = useState({
    success: false,
    message: "",
    open: false
  });

  const handleDeleteGroup = () => {
    dispatch(deleteGroup(groupId, setAlertStatus));
  };

  const handleLeaveGroup = () => {
    dispatch(leaveGroup(groupId, setAlertStatus));
  };

  const handleCloseAlert = () => {
    setAlertStatus({
      ...alertStatus,
      open: false
    });
  };

  return (
    <div className="group__more">
      {groupOwner?.email === userInfo?.email ? (
        <Button
          className="button__add-group"
          sx={{ fontSize: 18, backgroundColor: red[400] }}
          variant="contained"
          onClick={handleDeleteGroup}
        >
          <AiOutlineDelete /> Delete Group
        </Button>
      ) : (
        <Button
          className="button__add-group"
          sx={{
            fontSize: 18,
            backgroundColor: red[400],
            "&:hover": { backgroundColor: red[700] }
          }}
          variant="contained"
          color="primary"
          onClick={handleLeaveGroup}
        >
          <ImExit /> Leave Group
        </Button>
      )}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={alertStatus.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            variant="filled"
            onClose={handleCloseAlert}
            severity={alertStatus.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {alertStatus.data}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

export default GroupMore;
