import React from "react";
import { useParams } from "react-router-dom";
import { Tab, Box } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Layout from "../../Layout";
import "./GroupDetails.scss";
import TabMember from "./TabMember";

function GroupDetails() {
  const [value, setValue] = React.useState("info");

  const params = useParams();
  const groupId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout itemId={2}>
      <Box
        sx={{ width: "100%", typography: "body1" }}
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
          <TabPanel value="info">Group #{groupId}</TabPanel>
          <TabPanel value="people">
            <TabMember groupId={groupId} />
          </TabPanel>
          <TabPanel value="more">Item Three</TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}

export default GroupDetails;
