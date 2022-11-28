import {
  Button,
  CircularProgress,
  Box,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid
} from "@mui/material";
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

/* eslint-disable react/prop-types */
function RenderListGroup({ groups, navigateToGroupDetail }) {
  return (
    <Box sx={{ width: 1 }} className="group__box">
      <Grid
        container
        spacing={{ xs: 2, md: 3, lg: 4 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 24, xl: 24 }}
      >
        {groups.map((group) => (
          <Grid
            item
            xs={4}
            sm={8}
            md={6}
            lg={8}
            xl={6}
            key={
              group && group.groupId && group.groupId.id ? group.groupId.id : ""
            }
          >
            <Card
              variant="outlined"
              sx={{
                maxWidth: "100%",
                backgroundColor: "#2a518f",
                color: "#fff",
                border: "none",
                boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px"
              }}
              onClick={() => {
                navigateToGroupDetail(
                  group && group.groupId && group.groupId.id
                    ? group.groupId.id
                    : ""
                );
              }}
            >
              <CardHeader
                title={
                  group && group.groupId && group.groupId.name
                    ? group.groupId.name
                    : ""
                }
              />
              <CardContent>
                <Typography variant="body2" color="#fff">
                  {group?.totalUsers || 1}/{group?.groupId?.maximumMembers}{" "}
                  members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

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
    dispatch(getAllGroups(value, setLoading));
  }, [groups, value]);

  useEffect(() => {
    document.title = "Group - RLP";
  }, []);

  return (
    <Layout itemId={2}>
      <div className="group">
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
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            minHeight: "70vh",
            position: "relative"
          }}
          className="tab__container"
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", fontSize: 18 }}>
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
              {loading ? (
                <Box className="tab__loading">
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <div>
                  {groups.length > 0 ? (
                    <RenderListGroup
                      groups={groups}
                      navigateToGroupDetail={navigateToGroupDetail}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ marginTop: 30 }}
                    >
                      You don&apos;t have a group yet
                    </Typography>
                  )}
                </div>
              )}
            </TabPanel>
            <TabPanel value="join">
              {loading ? (
                <Box className="tab__loading">
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <div>
                  {groups.length > 0 ? (
                    <RenderListGroup
                      groups={groups}
                      navigateToGroupDetail={navigateToGroupDetail}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ marginTop: 30 }}
                    >
                      You don&apos;t have a group yet
                    </Typography>
                  )}
                </div>
              )}
            </TabPanel>
          </TabContext>
        </Box>
        <GroupAddNew open={open} handleClose={handleClose} />
      </div>
    </Layout>
  );
}

export default Groups;
