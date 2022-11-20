import React from "react";
import { useParams } from "react-router-dom";
import { Tab, Box } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Layout from "../../Layout";
import "./GroupDetails.scss";

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
        className="tab-group__container"
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Information" value="info" />
              <Tab label="People" value="people" />
              <Tab label="More" value="more" />
            </TabList>
          </Box>
          <TabPanel value="info">Group #{groupId}</TabPanel>
          <TabPanel value="people">Item Two</TabPanel>
          <TabPanel value="more">Item Three</TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}

export default GroupDetails;
