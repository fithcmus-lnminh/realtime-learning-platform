import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isEqual } from "lodash";
import { Tab, Box, CircularProgress, Button } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { getGroup } from "../../../redux/actions/groupAction";
import Layout from "../../Layout";
import "./GroupDetails.scss";
import GroupMember from "./GroupMember/GroupMember";
import GroupMore from "./GroupMore/GroupMore";
import GroupInfo from "./GroupInfo/GroupInfo";
import GroupInvited from "../GroupInvited/GroupInvited";

function GroupDetails() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(
    (state) => state.group.groupDetail,
    (prev, next) => isEqual(prev, next)
  );
  const [value, setValue] = useState("info");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const params = useParams();
  const groupId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getGroup(groupId, setLoading));
  }, [groupId]);

  return (
    <Layout itemId={2}>
      <Box
        sx={{ width: "100%", typography: "body1" }}
        className="tab__container"
      >
        {groupDetail?.isJoined && (
          <Button
            className="button__add-group"
            sx={{ fontSize: 18 }}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            Invite Member
          </Button>
        )}
        <Box sx={{ marginTop: "24px" }}>
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
                          value === "info" ? "tab__active" : ""
                        }`}
                      >
                        Information
                      </span>
                    }
                    value="info"
                  />
                  <Tab
                    label={
                      <span
                        className={`tab__label ${
                          value === "people" ? "tab__active" : ""
                        }`}
                      >
                        People
                      </span>
                    }
                    value="people"
                  />
                  <Tab
                    label={
                      <span
                        className={`tab__label ${
                          value === "more" ? "tab__active" : ""
                        }`}
                      >
                        More
                      </span>
                    }
                    value="more"
                  />
                </TabList>
              </Box>
              <TabPanel value="info">
                <GroupInfo groupId={groupId} />
              </TabPanel>
              <TabPanel value="people">
                <GroupMember groupId={groupId} />
              </TabPanel>
              <TabPanel value="more">
                <GroupMore groupId={groupId} />
              </TabPanel>
            </TabContext>
          )}
        </Box>
      </Box>

      <GroupInvited groupId={groupId} open={open} handleClose={handleClose} />
    </Layout>
  );
}

export default GroupDetails;
