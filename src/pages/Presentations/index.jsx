import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BiCommentAdd } from "react-icons/bi";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import moment from "moment";
import Alert from "../../components/Alert";
import "./Presentation.scss";
import { getAllPresentations } from "../../redux/actions/presentationAction";
import PresentationAddNew from "./PresentationAddNew";
import PresentationUpdate from "./PresentationUpdate";
import PresentationDelete from "./PresentationDelete";
import Layout from "../Layout";

function Presentations() {
  const dispatch = useDispatch();
  const presentations = useSelector(
    (state) => {
      return state.presentation.presentations;
    },
    (prev, next) => isEqual(prev, next)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    success: true,
    data: "",
    open: false
  });
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [presentationDetail, setPresentationDetail] = useState("");

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdate = (data) => {
    setOpenUpdate(true);
    setPresentationDetail(data);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleClickOpenDelete = (data) => {
    setOpenDelete(true);
    setPresentationDetail(data);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function betweenDate(start, end) {
    const startDate = moment(start);
    const endDate = moment(end);
    const diff = endDate.diff(startDate);
    const diffDuration = moment.duration(diff);
    const years = diffDuration.years();
    const months = diffDuration.months();
    const weeks = diffDuration.weeks();
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();
    const seconds = diffDuration.seconds();

    let result = "";

    if (years > 0) result = years > 1 ? `${years} years ago` : "A year ago";
    else if (months > 0)
      result = months > 1 ? `${months} months ago` : "A month ago";
    else if (weeks > 0)
      result = weeks > 1 ? `${weeks} weeks ago` : "A week ago";
    else if (days > 0) result = days > 1 ? `${days} days ago` : "A day ago";
    else if (hours > 0)
      result = hours > 1 ? `${hours} hours ago` : "A hour ago";
    else if (minutes > 0)
      result = minutes > 1 ? `${minutes} minutes ago` : "A minute ago";
    else result = seconds > 1 ? `${seconds} seconds ago` : "A second ago";

    return result;
  }

  const columns = [
    {
      id: "title",
      label: "Title",
      styleHead: {
        minWidth: 250,
        width: "40%"
      },
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip title={record?.title ? record.title : ""} placement="top">
              <NavLink to={`/presentation/${record.id}`}>
                <Typography
                  variant="span"
                  sx={{ color: "rgba(0, 0, 0, 0.87)", fontWeight: 600 }}
                >
                  {record?.title ? record.title : ""}
                </Typography>
              </NavLink>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "createdAt",
      label: "Created",
      styleHead: {
        minWidth: 100,
        width: "16%"
      },
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip
              title={
                record?.createdAt
                  ? betweenDate(record.createdAt, Date.now())
                  : ""
              }
              placement="top"
            >
              <Typography variant="span">
                {record?.createdAt
                  ? betweenDate(record.createdAt, Date.now())
                  : ""}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "updatedAt",
      label: "Last Modified",
      styleHead: {
        minWidth: 100,
        width: "16%"
      },
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip
              title={
                record?.updatedAt
                  ? betweenDate(record.updatedAt, Date.now())
                  : ""
              }
              placement="top"
            >
              <Typography variant="span">
                {record?.updatedAt
                  ? betweenDate(record.updatedAt, Date.now())
                  : ""}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "action",
      styleHead: {
        minWidth: 180,
        width: "28%",
        textAlign: "right"
      },
      render: (record) => {
        return (
          <Box className="presentation__action">
            <Tooltip title="Edit" placement="top">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleClickOpenUpdate(record)}
              >
                <MdModeEditOutline />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleClickOpenDelete(record)}
              >
                <MdDelete />
              </Button>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    setLoading(true);
    dispatch(getAllPresentations(setLoading));
  }, [presentations]);

  useEffect(() => {
    document.title = "Presentation - RLP";
  }, []);

  return (
    <Layout itemId={3}>
      <Box
        sx={{
          width: "100%",
          minHeight: 600,
          margin: "auto",
          position: "relative",
          padding: "24px"
        }}
        className="presentation"
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
              display: "flex",
              mb: 0,
              justifyContent: "space-between"
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start"
                }}
              >
                <Button
                  className="button__add-group"
                  sx={{ fontSize: 16 }}
                  variant="contained"
                  color="primary"
                  onClick={handleClickOpen}
                >
                  <BiCommentAdd /> New Presentation
                </Button>
              </Box>
              {presentations.length > 0 ? (
                <Box>
                  <TableContainer
                    component={Paper}
                    className="table__container"
                  >
                    <Table
                      sx={{ minWidth: 630 }}
                      aria-label="customized table"
                      className="table"
                    >
                      <TableHead className="table__head">
                        <TableRow className="table__row">
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                ...column.styleHead
                              }}
                              className={`table__cell ${column.classNameHead}`}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className="table__body">
                        {presentations.map((presentation) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={presentation.id}
                              className="table__row"
                            >
                              {columns.map((column) => {
                                const value = presentation[column.id] || "";
                                return (
                                  <TableCell
                                    key={column.id}
                                    className="table__cell"
                                  >
                                    {column.render
                                      ? column.render(presentation)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginTop: 30, fontSize: 18, marginLeft: 30 }}
                >
                  No presentation available.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <PresentationAddNew
          open={open}
          handleClose={handleClose}
          loading={loading}
          setLoading={setLoading}
        />

        <PresentationUpdate
          open={openUpdate}
          handleClose={handleCloseUpdate}
          presentationDetail={presentationDetail}
          loading={loading}
          setLoading={setLoading}
        />

        <PresentationDelete
          open={openDelete}
          handleClose={handleCloseDelete}
          presentationDetail={presentationDetail}
          loading={loading}
          setLoading={setLoading}
        />
      </Box>
    </Layout>
  );
}

export default Presentations;
