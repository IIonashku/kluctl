import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { buildRefKindElement, buildRefString } from "../../api";
import { Box, Typography } from "@mui/material";
import { CodeViewer } from "../targetDashboard/CodeViewer";
import { DiffStatus } from "./nodes/NodeData";
import Divider from "@mui/material/Divider";
import { ObjectRef } from "../../models";

const RefList = (props: { title: string; refs: ObjectRef[] }) => {
  return (
    <Box>
      <Typography
        align={"center"}
        variant={"h5"}
        sx={{
          mt: "20px",
          mb: "20px",
        }}
      >
        {props.title}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          background: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["Kind", "Namespace", "Name"].map((el, idx) => {
                return (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: "18px",
                      lineHeight: "25px",
                      color: "#39403E",
                    }}
                  >
                    <Typography>{el}</Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.refs.map((ref, i) => {
              return (
                <TableRow key={i}>
                  <TableCell sx={{ width: "50px" }} align="center">
                    {buildRefKindElement(ref)}
                  </TableCell>
                  <TableCell sx={{ width: "50px" }} align="center">
                    <Typography>{ref.namespace}</Typography>
                  </TableCell>
                  <TableCell sx={{ width: "100px" }} align="center">
                    <Typography>{ref.name}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box height={"20px"}></Box>
    </Box>
  );
};

export function ChangesTable(props: { diffStatus: DiffStatus }) {
  let changedObjects: React.ReactElement | undefined;

  if (props.diffStatus.changedObjects.length) {
    changedObjects = (
      <Box>
        <Typography
          align={"center"}
          variant={"h5"}
          sx={{
            mt: "20px",
            mb: "20px",
          }}
        >
          Changed Objects
        </Typography>
        {props.diffStatus.changedObjects.map((co, i) => (
          <TableContainer
            key={i}
            component={Paper}
            sx={{
              background: "none",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <Typography variant="h6">
                      {buildRefString(co.ref)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {["Path", "Changes"].map((el, idx) => {
                    return (
                      <TableCell
                        key={idx}
                        align="center"
                        sx={{
                          fontWeight: 600,
                          fontSize: "18px",
                          lineHeight: "25px",
                          color: "#39403E",
                        }}
                      >
                        {el}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {co.changes?.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell align="center" sx={{ width: "50px" }}>
                      <Box minWidth={"100px"} sx={{ overflowWrap: "anywhere" }}>
                        <Typography>{c.jsonPath}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "100px" }}>
                      <CodeViewer
                        code={c.unifiedDiff || ""}
                        language={"diff"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
        <Divider />
      </Box>
    );
  }

  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
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
      {props.diffStatus.newObjects.length ? (
        <RefList title={"New Objects"} refs={props.diffStatus.newObjects} />
      ) : (
        <></>
      )}
      {props.diffStatus.deletedObjects.length ? (
        <RefList
          title={"Deleted Objects"}
          refs={props.diffStatus.deletedObjects}
        />
      ) : (
        <></>
      )}
      {props.diffStatus.orphanObjects.length ? (
        <RefList
          title={"Orphan Objects"}
          refs={props.diffStatus.orphanObjects}
        />
      ) : (
        <></>
      )}
      {changedObjects}
    </Box>
  );
}
