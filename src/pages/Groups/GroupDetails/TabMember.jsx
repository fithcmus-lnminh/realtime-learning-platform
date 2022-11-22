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
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import React from "react";

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
function TabMember({ groupId }) {
  console.log("groupId", groupId);

  const members = [
    {
      _id: "1",
      name: "Long Huynh",
      role: "co-owner"
    },
    {
      _id: "2",
      name: "Lê Phương Thảo",
      role: "co-owner"
    },
    {
      _id: "3",
      name: "Nguyễn Tuấn Hưng",
      role: "co-owner"
    },
    {
      _id: "4",
      name: "Nguyễn Văn Sơn",
      role: "member"
    },
    {
      _id: "5",
      name: "Phạm Thảo Nhi",
      role: "member"
    },
    {
      _id: "6",
      name: "Phan Tuấn Hải",
      role: "member"
    },
    {
      _id: "7",
      name: "Nguyễn Sơn Thạch",
      role: "member"
    },
    {
      _id: "8",
      name: "Trần Lê Tâm Như",
      role: "member"
    }
  ];
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        maxWidth: 900,
        margin: "20px auto"
      }}
    >
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
            alignItems: "center"
          }}
        >
          <Typography variant="h4" gutterBottom style={{ color: "#dc3f3f" }}>
            Owner
          </Typography>
          <Typography variant="body2" gutterBottom style={{ color: "#dc3f3f" }}>
            {members.length} members
          </Typography>
        </Box>
        <Divider />
        <List
          dense
          sx={{ width: "100%", bgcolor: "background.paper", marginTop: "16px" }}
        >
          {members.map((member, index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;

            const handleChange = (event) => {
              console.log(event.target.value);
            };

            return (
              <ListItem
                /* eslint-disable react/no-array-index-key */
                key={index}
                secondaryAction={
                  <div className="member__action">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-helper-label">
                        Role
                      </InputLabel>
                      <Select
                        labelId="select-role"
                        id="select-role"
                        value={member.role}
                        label="Age"
                        onChange={handleChange}
                        sx={{
                          "&>div": { padding: "6px 10px" }
                        }}
                      >
                        <MenuItem value="co-owner">Co-owner</MenuItem>
                        <MenuItem value="member">Member</MenuItem>
                      </Select>
                    </FormControl>
                    <Tooltip title="Kick" placement="top">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                }
                disablePadding
                className="member__item"
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...stringAvatar(member.name)}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={member.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{
          width: "100%",
          marginTop: "30px"
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#dc3f3f" }}>
          Member
        </Typography>
        <Divider />
        <List
          dense
          sx={{ width: "100%", bgcolor: "background.paper", marginTop: "16px" }}
        >
          {members.map((member, index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;

            const handleChange = (event) => {
              console.log(event.target.value);
            };

            return (
              <ListItem
                /* eslint-disable react/no-array-index-key */
                key={index}
                secondaryAction={
                  <div className="member__action">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-helper-label">
                        Role
                      </InputLabel>
                      <Select
                        labelId="select-role"
                        id="select-role"
                        value={member.role}
                        label="Age"
                        onChange={handleChange}
                        sx={{
                          "&>div": { padding: "6px 10px" }
                        }}
                      >
                        <MenuItem value="co-owner">Co-owner</MenuItem>
                        <MenuItem value="member">Member</MenuItem>
                      </Select>
                    </FormControl>
                    <Tooltip title="Kick" placement="top">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                }
                disablePadding
                className="member__item"
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...stringAvatar(member.name)}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={member.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}

export default TabMember;
