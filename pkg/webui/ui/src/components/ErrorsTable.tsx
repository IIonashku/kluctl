import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DeploymentError } from "../models";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { buildRefKindElement } from "../api";

export function ErrorsTable(props: { errors: DeploymentError[] }) {
  return (
    <>
      <Box>
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
                <TableCell>Ref</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.errors?.map((e, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ maxWidth: "150px" }}>
                    <List>
                      {buildRefKindElement(
                        e.ref,
                        <>
                          <ListItem>
                            <ListItemText primary={e.ref.kind} />
                          </ListItem>
                        </>
                      )}
                      <Divider />
                      <ListItem>
                        <ListItemText primary={e.ref.name} />
                      </ListItem>
                      {e.ref.namespace && (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemText primary={e.ref.namespace} />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </TableCell>
                  <TableCell sx={{ maxWidth: "300px" }}>{e.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
