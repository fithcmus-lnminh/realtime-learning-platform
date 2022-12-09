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
  Typography
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { BiCommentAdd } from "react-icons/bi";
import moment from "moment";
import Alert from "../../components/Alert";
import "./Presentation.scss";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767)
// ];

// const columns = [
//   { id: "name", label: "Name", minWidth: 170 },
//   { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
//   {
//     id: "population",
//     label: "Population",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toLocaleString("en-US")
//   },
//   {
//     id: "size",
//     label: "Size\u00a0(km\u00b2)",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toLocaleString("en-US")
//   },
//   {
//     id: "density",
//     label: "Density",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toFixed(2)
//   }
// ];

function betweenDate(start, end) {
  // console.log("start:", start);
  // console.log("end:", end);

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
  // console.log("Years:", diffDuration.years());
  // console.log("Months:", diffDuration.months());
  // console.log("Weeks:", diffDuration.weeks());
  // console.log("Days:", diffDuration.days());
  // console.log("Hours:", diffDuration.hours());
  // console.log("Minutes:", diffDuration.minutes());
  // console.log("Seconds:", diffDuration.seconds());

  let result = "";

  if (years > 0) result = years > 1 ? `${years} years ago` : "A year ago";
  else if (months > 0)
    result = months > 1 ? `${months} months ago` : "A month ago";
  else if (weeks > 0) result = weeks > 1 ? `${weeks} weeks ago` : "A week ago";
  else if (days > 0) result = days > 1 ? `${days} days ago` : "A day ago";
  else if (hours > 0) result = hours > 1 ? `${hours} hours ago` : "A hour ago";
  else if (minutes > 0)
    result = minutes > 1 ? `${minutes} minutes ago` : "A minute ago";
  else result = seconds > 1 ? `${seconds} seconds ago` : "A second ago";

  return result;
}

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 180,
    render: (record) => {
      return (
        <Box className="pres__column">{record.name ? record.name : ""}</Box>
      );
    }
  },
  {
    id: "owner",
    label: "Owner",
    minWidth: 90,
    render: (record) => {
      return (
        <Box className="pres__column">{record.owner ? record.owner : ""}</Box>
      );
    }
  },
  {
    id: "modified",
    label: "Modified",
    minWidth: 90,
    render: (record) => {
      return (
        <Box className="presentation__column">
          {record.modified ? betweenDate(record.modified, Date.now()) : ""}
        </Box>
      );
    }
  },
  {
    id: "created",
    label: "Created",
    minWidth: 90,
    render: (record) => {
      return (
        <Box className="pres__column">
          {record.created ? betweenDate(record.created, Date.now()) : ""}
        </Box>
      );
    }
  },
  {
    id: "action",
    label: "Action",
    minWidth: 180,
    align: "right",
    render: (record) => {
      console.log("record:", record);
      return (
        <Box className="actionTable">
          <Button
            className="button__add-group"
            sx={{ fontSize: 13 }}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        </Box>
      );
    }
  }
];

function createData(id, name, owner, created, modified) {
  return { id, name, owner, created, modified };
}

const rows = [
  createData(
    "id01",
    "Presentation 1",
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

  const handleCloseAlert = () => {
    setMessage({
      ...message,
      open: false
    });
  };

  console.log("rows:", rows);

  //   useEffect(() => {}, []);

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
                  //   onClick={handleClickOpen}
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
                            style={{ minWidth: column.minWidth }}
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
    </Box>
  );
}

export default Presentation;
