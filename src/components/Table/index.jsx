import {
  Paper,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import React from "react";

function Table(prop) {
  const { dataSource = [], columns = [], style = {}, className = "" } = prop;

  return (
    <TableContainer
      component={Paper}
      className={`table__container ${className}`}
    >
      <MuiTable
        sx={{ minWidth: 630 }}
        style={{ ...style }}
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
          {dataSource.map((record) => {
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={record.id}
                className="table__row"
              >
                {columns.map((column) => {
                  const value = record[column.id] || "";
                  return (
                    <TableCell key={column.id} className="table__cell">
                      {column.render ? column.render(record) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
