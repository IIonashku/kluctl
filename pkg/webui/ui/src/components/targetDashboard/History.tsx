import { ReactComponent as DataSvg } from "./../../iconss/history/data.svg";
import { ReactComponent as CloudSvg } from "./../../iconss/history/cloud.svg";
import { ReactComponent as DeleteSvg } from "./../../iconss/history/delete.svg";
import { ReactComponent as DiffSvg } from "./../../iconss/history/diff.svg";
import { ReactComponent as TrashSvg } from "./../../iconss/history/trash.svg";
import { ReactComponent as DeploySvg } from "./../../iconss/history/deploy.svg";
///
import {
  CommandResultSummary,
  ProjectSummary,
  TargetSummary,
} from "../../models";
import { FC, useEffect, useMemo, useState } from "react";
import * as yaml from "js-yaml";
import { CodeViewer } from "./CodeViewer";
import { Box, IconButton, Tooltip, Typography, SvgIcon } from "@mui/material";
// import { CommandResultStatusLine } from "../result-view/CommandResultStatusLine";
import { useNavigate } from "react-router";
import { formatDurationShort } from "../../utils/duration";
import { LineResult } from "./LineResult";

export const History: FC<{
  ts: TargetSummary;
  rs: CommandResultSummary;
  // onSelectCommandResult: (rs?: CommandResultSummary) => void
}> = ({ ts, rs }) => {
  const calcAgo = () => {
    const t1 = new Date(rs.commandInfo.startTime);
    const t2 = new Date();
    const d = t2.getTime() - t1.getTime();
    return formatDurationShort(d);
  };

  const navigate = useNavigate();
  const [ago, setAgo] = useState(calcAgo());

  let Icon = DiffSvg;
  switch (rs.commandInfo?.command) {
    case "delete":
      Icon = DeleteSvg;
      break;
    case "deploy":
      Icon = DeploySvg;
      break;
    case "diff":
      Icon = DiffSvg;
      break;
    case "poke-images":
      Icon = CloudSvg;
      break;
    case "prune":
      Icon = TrashSvg;
      break;
  }

  const cmdInfoYaml = useMemo(() => {
    return yaml.dump(rs.commandInfo);
  }, [rs]);
  let iconTooltip = <CodeViewer code={cmdInfoYaml} language={"yaml"} />;

  useEffect(() => {
    const interval = setInterval(() => setAgo(calcAgo()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "12px 10px 0 10px",
        width: "247px",
        height: "126px",
        borderRadius: "12px",
        background: "#DFEBE9",
        border: "1px solid #59A588",
        boxShadow: "4px 4px 10px #1E617A",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Tooltip title={iconTooltip}>
          <Icon fontSize={"large"} />
        </Tooltip>
        <Box
          sx={{
            ml: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "20px",
              lineHeight: "27px",
              color: "#222222",
              minWidth: "auto",
              mb: "4px",
            }}
            variant="body1"
          >
            {rs.commandInfo?.command}
          </Typography>
          <Tooltip title={rs.commandInfo.startTime}>
            <Typography fontSize={"10px"} color={"gray"} align={"center"}>
              {ago}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <LineResult rs={rs} />
        </Box>
        <Box sx={{}}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/results/${rs.id}`);
            }}
          >
            <Tooltip title={"Open Result Tree"}>
              <DataSvg />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
