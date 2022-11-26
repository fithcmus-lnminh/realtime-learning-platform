import React, { useEffect, useState } from "react";
import { Alert, Button, Stack, Snackbar } from "@mui/material";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroup } from "../../../redux/actions/groupAction";

function GroupMore(prop) {
  const { groupId } = prop;
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.user.userInfo,
    (prev, next) => isEqual(prev, next)
  );
  const groupUsers = useSelector(
    (state) => state.group.groupUsers,
    (prev, next) => isEqual(prev, next)
  );
  const [roleUser, setRoleUser] = useState("Member");
  const [alertStatus, setAlertStatus] = useState({
    success: false,
    message: "",
    open: false
  });
  const handleDeleteGroup = () => {
    dispatch(deleteGroup(groupId, setAlertStatus));
  };

  const handleCloseAlert = () => {
    setAlertStatus({
      ...alertStatus,
      open: false
    });
  };

  useEffect(() => {
    const userInGroup = groupUsers.find(
      (user) => user?.userId?.id === userInfo.id
    );
    setRoleUser(userInGroup.role);
  }, [groupUsers]);

  return (
    <div className="group__more">
      {roleUser === "Owner" ? (
        <Button
          className="button__add-group"
          sx={{ fontSize: 18 }}
          variant="contained"
          color="primary"
          onClick={handleDeleteGroup}
        >
          Delete Group
        </Button>
      ) : (
        <Button
          className="button__add-group"
          sx={{ fontSize: 18 }}
          variant="contained"
          color="primary"
          onClick={() => {}}
        >
          Leave Group
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
