import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Box, Button } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { BiMailSend, BiArrowBack } from "react-icons/bi";
import Layout from "../../Layout";
import "./GroupDetails.scss";
import GroupMember from "./GroupMember/GroupMember";
import GroupMore from "./GroupMore/GroupMore";
import GroupInfo from "./GroupInfo/GroupInfo";
import GroupInvited from "../GroupInvited/GroupInvited";

function GroupDetails() {
  const [value, setValue] = useState("info");
  const [open, setOpen] = useState(false);
  const params = useParams();
  const groupId = params.id;
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigateBackToGroups = () => {
    navigate("/groups");
  };

  return (
    <Layout itemId={2}>
      <Box
        sx={{ width: "100%", minHeight: "70vh", typography: "body1" }}
        className="tab__container"
      >
        <div className="group__detail__header">
          <BiArrowBack
            className="group__detail__header-icon"
            onClick={navigateBackToGroups}
          />
          <Button
            className="button__add-group"
            sx={{ fontSize: 18 }}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            <BiMailSend />
            Invite Member
          </Button>
        </div>
        <Box sx={{ marginTop: "24px" }}>
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
            <TabPanel sx={{ pt: 1 }} value="info">
              <GroupInfo groupId={groupId} loading />
            </TabPanel>
            <TabPanel value="people">
              <GroupMember groupId={groupId} />
            </TabPanel>
            <TabPanel value="more">
              <GroupMore groupId={groupId} />
            </TabPanel>
          </TabContext>
          {/* )} */}
        </Box>
      </Box>

      <GroupInvited groupId={groupId} open={open} handleClose={handleClose} />
    </Layout>
  );
}

export default GroupDetails;
