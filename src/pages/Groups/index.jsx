import {
  // Backdrop,
  Button,
  CircularProgress,
  Box,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { isEqual } from "lodash";
import { getAllGroups } from "../../redux/actions/groupAction";
import Layout from "../Layout";
import GroupAddNew from "./GroupAddNew/GroupAddNew";
import "./Groups.scss";

function Groups() {
  const [value, setValue] = React.useState("own");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groups = useSelector(
    (state) => {
      return state.group.groups;
    },
    (prev, next) => isEqual(prev, next)
  );
  const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigateToGroupDetail = (id) => {
    navigate(`/group/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getAllGroups(setLoading));
  }, [groups]);

  useEffect(() => {
    document.title = "Group - RLP";
  }, []);

  return (
    <Layout itemId={2}>
      <div className="group">
        {!loading && (
          <Button
            className="button__add-group"
            sx={{ fontSize: 18 }}
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            <AiOutlineUsergroupAdd />
            Create Group
          </Button>
        )}
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            minHeight: "70vh",
            position: "relative"
          }}
          className="tab__container"
        >
          {loading ? (
            <div className="tab__loading">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <TabContext value={value}>
              <Box
                sx={{ borderBottom: 1, borderColor: "divider", fontSize: 18 }}
              >
                <TabList
                  textColor="secondary"
                  indicatorColor="secondary"
                  onChange={handleChange}
                >
                  <Tab
                    label={
                      <span
                        className={`tab__label ${
                          value === "own" ? "tab__active" : ""
                        }`}
                      >
                        Group I Manage
                      </span>
                    }
                    value="own"
                  />
                  <Tab
                    label={
                      <span
                        className={`tab__label ${
                          value === "join" ? "tab__active" : ""
                        }`}
                      >
                        Group I&#39;ve Joined
                      </span>
                    }
                    value="join"
                  />
                </TabList>
              </Box>
              <TabPanel value="own">
                {groups.length > 0 ? (
                  <Box sx={{ width: 1 }} className="group__box">
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(12, 1fr)"
                      gap={3}
                    >
                      {groups.map((group) => (
                        <Box
                          gridColumn="span 3"
                          key={group.id}
                          onClick={() => {
                            navigateToGroupDetail(group.id);
                          }}
                        >
                          <Card sx={{ maxWidth: "100%" }}>
                            <CardHeader
                              action={
                                <IconButton aria-label="settings">
                                  <MoreVertIcon />
                                </IconButton>
                              }
                              title={
                                group && group.groupId && group.groupId.name
                                  ? group.groupId.name
                                  : ""
                              }
                            />
                            <CardContent>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {group &&
                                group.groupId &&
                                group.groupId.maximumMembers
                                  ? group.groupId.maximumMembers
                                  : ""}{" "}
                                members
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ marginTop: 30 }}
                  >
                    You don&apos;t have a group yet
                  </Typography>
                )}

                <GroupAddNew open={open} handleClose={handleClose} />
              </TabPanel>
              <TabPanel value="join">Item Two</TabPanel>
            </TabContext>
          )}
        </Box>
      </div>
    </Layout>
  );
}

export default Groups;
