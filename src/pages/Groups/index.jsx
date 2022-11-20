import {
  Backdrop,
  Button,
  CircularProgress,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../redux/actions/groupAction";
import Layout from "../Layout";
import GroupAddNew from "./GroupAddNew/GroupAddNew";
import "./Groups.scss";

function Groups() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.groups);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getAllGroups(setLoading));

    document.title = "Group - RLP";
  }, []);

  return (
    <Layout itemId={2}>
      <div className="group">
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create Group
        </Button>
        {groups.length > 0 ? (
          <Box sx={{ width: 1 }} className="group__box">
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
              {groups.map((group) => (
                <Box gridColumn="span 3" key={group.id}>
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
                      <Typography variant="body2" color="text.secondary">
                        {group && group.groupId && group.groupId.maximumMembers
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </Layout>
  );
}

export default Groups;
