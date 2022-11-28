import {
  Box,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  DialogContent,
  CircularProgress
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/Modal";
import { kickUser, promoteUser } from "../../../../redux/actions/groupAction";
import Alert from "../../../../components/Alert";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
  };
}

/* eslint-disable react/prop-types */
function RenderButtonDelete({
  member = {},
  roleUser = "",
  handleClickDelete = () => {}
}) {
  let isShow = false;

  if (roleUser === "Owner") {
    isShow = true;
    /* eslint-disable no-else-return */
  } else if (roleUser === "Co-Owner") {
    if (member.role === "Member") {
      isShow = true;
    }
  }

  if (isShow) {
    return (
      <Tooltip title="Kick" placement="top">
        <IconButton onClick={handleClickDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

/* eslint-disable react/no-unstable-nested-components */
function RenderModalKickMember({
  member,
  openModal,
  loading,
  setOpenModal = () => {},
  handleKickMember = () => {}
}) {
  return (
    <Modal
      title="Kick member?"
      loading={loading}
      actions={["Cancel", "OK"]}
      actionText="Kick"
      show={openModal}
      onCloseModal={() => setOpenModal(false)}
      onActionClick={() => handleKickMember(member?.userId?.id)}
    >
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Are you sure you want to kick{" "}
          <Typography variant="span" sx={{ fontWeight: 600 }}>
            {`${member?.userId?.firstName} ${member?.userId?.lastName}`}
          </Typography>{" "}
          from the group?
        </Typography>
      </DialogContent>
    </Modal>
  );
}

/* eslint-disable react/no-unstable-nested-components */
function RenderButtonSelectRole({
  member = {},
  roleUser = "",
  handleChange = () => {}
}) {
  let isShow = true;

  if (roleUser === "Owner") {
    isShow = false;
  }

  if (!isShow) {
    return (
      <FormControl sx={{ minWidth: 120 }} size="small">
        <Select
          value={member?.role}
          onChange={handleChange}
          displayEmpty
          sx={{
            "&>div": { padding: "6px 10px" }
          }}
        >
          <MenuItem value="Co-Owner">Co-Owner</MenuItem>
          <MenuItem value="Member">Member</MenuItem>
        </Select>
      </FormControl>
    );
  }
}

/* eslint-disable react/prop-types */
function RenderListMember({
  title = "",
  members = {},
  roleUser = "",
  setMemberKick = () => {},
  setOpenModal = () => {},
  handleChangeRoleMember = () => {}
}) {
  const handleClickDelete = (member) => {
    setOpenModal(true);
    setMemberKick(member);
  };

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "30px"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px"
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#1967d2" }}>
          {title}
        </Typography>
        {title !== "Owner" ? (
          <Typography variant="body2" gutterBottom sx={{ color: "#1967d2" }}>
            {members.length} {members.length > 1 ? "members" : "member"}
          </Typography>
        ) : null}
      </Box>
      <Divider />
      <List
        dense
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          marginTop: "16px",
          paddingRight: "0px"
        }}
      >
        {members.map((member, index) => {
          const handleChangeRole = (event) => {
            if (member.role !== event.target.value) {
              handleChangeRoleMember({
                userId: member?.userId?.id,
                role: event.target.value
              });
            }
          };

          return (
            <ListItem
              /* eslint-disable react/no-array-index-key */
              key={index}
              secondaryAction={
                <div className="member__action">
                  {title !== "Owner" ? (
                    <>
                      <RenderButtonSelectRole
                        member={member}
                        roleUser={roleUser}
                        handleChange={handleChangeRole}
                      />
                      <RenderButtonDelete
                        member={member}
                        roleUser={roleUser}
                        handleClickDelete={() => handleClickDelete(member)}
                      />
                    </>
                  ) : null}
                </div>
              }
              disablePadding
              className="member__item"
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    /* eslint-disable react/jsx-props-no-spreading */
                    {...stringAvatar(
                      `${member?.userId?.firstName} ${member?.userId?.lastName}`
                    )}
                  />
                </ListItemAvatar>
                <ListItemText
                  id={`list-member-text-${index}`}
                  primary={`${member?.userId?.firstName} ${member?.userId?.lastName}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

/* eslint-disable react/prop-types */
function GroupMember(prop) {
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
  const groupUsersOwner = useSelector(
    (state) => state.group.groupUsers.filter((user) => user.role === "Owner"),
    (prev, next) => isEqual(prev, next)
  );
  const groupUsersMember = useSelector(
    (state) => {
      return state.group.groupUsers.filter((user) => user.role !== "Owner");
    },
    (prev, next) => isEqual(prev, next)
  );
  const [roleUser, setRoleUser] = useState("Member");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberKick, setMemberKick] = useState({});
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });

  useEffect(() => {
    const userInGroup = groupUsers.find(
      (user) => user?.userId?.id === userInfo?.id
    );
    if (userInGroup && userInGroup.role) {
      setRoleUser(userInGroup?.role);
    }
  }, [groupUsers]);

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      success: true,
      data: "",
      open: false
    });
  };

  const handleKickMember = (id) => {
    setLoading(true);
    dispatch(
      kickUser(groupId, { userId: id }, setLoading, setMessage, setOpenModal)
    );
  };

  const handleChangeRoleMember = (data) => {
    setLoading(true);
    dispatch(promoteUser(groupId, data, setLoading, setMessage));
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        maxWidth: 900,
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
            width: "100%",
            minHeight: 200,
            maxWidth: 900,
            margin: "20px auto"
          }}
        >
          <RenderListMember
            title="Owner"
            members={groupUsersOwner}
            roleUser={roleUser}
            setMemberKick={setMemberKick}
            setOpenModal={setOpenModal}
            handleChangeRoleMember={handleChangeRoleMember}
          />
          <RenderListMember
            title="Member"
            members={groupUsersMember}
            roleUser={roleUser}
            setMemberKick={setMemberKick}
            setOpenModal={setOpenModal}
            handleChangeRoleMember={handleChangeRoleMember}
          />
          {openModal && (
            <RenderModalKickMember
              member={memberKick}
              openModal={openModal}
              loading={loading}
              setOpenModal={setOpenModal}
              handleKickMember={handleKickMember}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default GroupMember;
