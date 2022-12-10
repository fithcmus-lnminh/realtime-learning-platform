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
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BiCommentAdd } from "react-icons/bi";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import moment from "moment";
import Alert from "../../components/Alert";
import "./Presentation.scss";
import PresentationAddNew from "./PresentationAddNew";
import PresentationUpdate from "./PresentationUpdate";
import PresentationDelete from "./PresentationDelete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function Presentation() {
  const [presentation] = useState([
    {
      _id: "id01",
      name: "Title 1",
      group_id: null,
      slides: [],
      access_code: "1"
    },
    {
      _id: "id02",
      name: "Title 2",
      group_id: null,
      slides: [],
      access_code: "1"
    },
    {
      _id: "id03",
      name: "Title 3",
      group_id: null,
      slides: [],
      access_code: "1"
    }
  ]);
  const [loading] = useState(false);
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

  function createData(id, name, owner, created, modified) {
    return { id, name, owner, created, modified };
  }

  const columns = [
    {
      id: "name",
      label: "Name",
      minWidth: 180,
      width: "28%",
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip title={record?.name ? record.name : ""} placement="top">
              <NavLink to={`/presentation/${record.id}`}>
                <Typography
                  variant="span"
                  sx={{ color: "rgba(0, 0, 0, 0.87)" }}
                >
                  {record?.name ? record.name : ""}
                </Typography>
              </NavLink>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "owner",
      label: "Owner",
      minWidth: 90,
      width: "16%",
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip title={record?.owner ? record.owner : ""} placement="top">
              <Typography variant="span">
                {record?.owner ? record.owner : ""}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "created",
      label: "Created",
      minWidth: 90,
      width: "16%",
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip
              title={
                record?.created ? betweenDate(record.created, Date.now()) : ""
              }
              placement="top"
            >
              <Typography variant="span">
                {record?.created ? betweenDate(record.created, Date.now()) : ""}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "modified",
      label: "Last Modified",
      minWidth: 90,
      width: "16%",
      render: (record) => {
        return (
          <Box className="presentation__column">
            <Tooltip
              title={
                record?.modified ? betweenDate(record.modified, Date.now()) : ""
              }
              placement="top"
            >
              <Typography variant="span">
                {record?.modified
                  ? betweenDate(record.modified, Date.now())
                  : ""}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    },
    {
      id: "action",
      label: "",
      minWidth: 180,
      align: "right",
      width: "28%",
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

  const rows = [
    createData(
      "id01",
      "Presentation 1 nhưng sao dài quá",
      "User 1",
      "2022-11-26T06:58:35.493Z",
      "2022-12-09T10:10:14.763Z"
    ),
    createData(
      "id02",
      "Presentation 2",
      "User 2",
      "2022-11-26T06:58:35.493Z",
      "2015-12-16T17:10:14.763Z"
    ),
    createData(
      "id03",
      "Presentation 3",
      "User 3",
      "2022-11-26T06:58:35.493Z",
      "2022-12-09T14:54:29.648Z"
    ),
    createData(
      "id04",
      "Presentation 4",
      "User 4",
      "2022-11-26T06:58:35.493Z",
      "2022-12-07T17:10:14.763Z"
    ),
    createData(
      "id05",
      "Presentation 5",
      "User 5",
      "2022-11-26T06:58:35.493Z",
      "2022-12-06T17:10:14.763Z"
    ),
    createData(
      "id06",
      "Presentation 6",
      "User 6",
      "2022-11-26T06:58:35.493Z",
      "2022-11-28T17:10:14.763Z"
    ),
    createData(
      "id07",
      "Presentation 7",
      "User 7",
      "2022-11-26T06:58:35.493Z",
      "2022-11-28T17:10:14.763Z"
    ),
    createData(
      "id08",
      "Presentation 8",
      "User 8",
      "2022-11-26T06:58:35.493Z",
      "2022-11-28T17:10:14.763Z"
    )
  ];

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(getAllPresentations(groupId, setLoading));
  // }, [groupId]);

  useEffect(() => {
    document.title = "Presentation - RLP";
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
        margin: "auto",
        position: "relative"
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
          {presentation.length > 0 ? (
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
                  justifyContent: "end"
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
              <Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 630 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                              width: column.width
                            }}
                          >
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        return (
                          <StyledTableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            {columns.map((column) => {
                              const value = row[column.id] || "";
                              return (
                                <StyledTableCell
                                  key={column.id}
                                  align={column.align}
                                >
                                  {column.render ? column.render(row) : value}
                                </StyledTableCell>
                              );
                            })}
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
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
      )}

      <PresentationAddNew open={open} handleClose={handleClose} />

      <PresentationUpdate
        open={openUpdate}
        handleClose={handleCloseUpdate}
        presentationDetail={presentationDetail}
      />

      <PresentationDelete
        open={openDelete}
        handleClose={handleCloseDelete}
        presentationDetail={presentationDetail}
      />
    </Box>
  );
}

export default Presentation;
