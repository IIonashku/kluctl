import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export function PropertiesTable(props: {
  properties: { name: string; value: React.ReactNode }[];
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        background: "none",
      }}
    >
      <Table
        sx={{
          "& .MuiTableCell-root": {
            position: "relative",
            borderBottom: "0.5px solid #39403E",
            "::after": {
              content: '""',
              position: "absolute",
              width: "0.5px",
              height: "50%",
              background: "#39403E",
              right: 0,
              top: "50%",
              transform: "translate(0, -50%)",
            },
            ":last-child": {
              "::after": {
                display: "none",
              },
            },
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.properties.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
