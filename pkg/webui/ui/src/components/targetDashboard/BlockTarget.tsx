import Box from "@mui/material/Box";
import { SvgIcon, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ReactComponent as TargetSvg } from "./../../iconss/target/target.svg";
import { ReactComponent as Cpu } from "./../../iconss/target/cpu.svg";
import { ReactComponent as Finger } from "./../../iconss/target/fingerScan.svg";
import { ReactComponent as Heart } from "./../../iconss/target/heart.svg";
import { ReactComponent as More } from "./../../iconss/target/more.svg";
import { ReactComponent as Question } from "./../../iconss/target/question.svg";
import { ProjectSummary, TargetSummary } from "../../models";
import Tooltip from "@mui/material/Tooltip";
import { Height } from "@mui/icons-material";

export const BlockTargets: FC<{
  length: number;
  two: boolean;
  iconName: string;
  idx: number;
  targets: TargetSummary;
  onSelectTarget: (ts?: TargetSummary) => void;
}> = ({ iconName, targets, length, two, idx, onSelectTarget }) => {
  const [countLines, setCountLines] = useState<number>(0);
  const [bottomLine, setBottomLine] = useState<number>(0);

  useEffect(() => {
    if (!two) {
      setCountLines(length / 2);
    } else {
      setCountLines((length - 1) / 2);
    }
  }, [two, length]);
  useEffect(() => {
    setBottomLine(length - countLines);
  }, [countLines, length]);
  const heightFunc = () => {
    if (bottomLine === idx) {
      if (two) {
        return 130;
      }
      return 55;
    } else if (countLines - 1 === idx) {
      if (two) {
        return 130;
      }
      return 55;
    } else {
      return 160;
    }
  };
  console.log(targets);
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "12px 10px",
        width: "247px",
        height: "126px",
        borderRadius: "12px",
        background: "#DFEBE9",
        border: "1px solid #59A588",
        boxShadow: "4px 4px 10px #1E617A",
        "&::before": {
          content: '""',
          display: two && idx === countLines ? "none" : "block",
          position: "absolute",
          right: "calc(100% + 9px)",
          width: "85px",
          height: heightFunc() + "px",
          borderTop: bottomLine > idx ? "2px solid #000" : "none",
          borderBottom: bottomLine > idx ? "none" : "2px solid #000",
          borderLeft: "2px solid #000",
          borderRadius: bottomLine > idx ? "20px 0 0  0" : "0 0 0 20px",
          top: bottomLine > idx ? "calc(126px / 2)" : "auto",
          bottom: bottomLine > idx ? "auto" : "calc(126px / 2)",
        },
        "&::after": {
          content: '""',
          display: two && idx === countLines ? "none" : "block",
          position: "absolute",
          top: bottomLine > idx ? "calc(126px / 2 - 6px)" : "auto",
          bottom: bottomLine > idx ? "auto" : "calc(126px / 2 - 6px)",
          left: "calc(-12px + -9px)",
          width: "12px",
          height: "12px",
          border: "2px solid #000",
          borderRadius: "100px",
          background: "#fff",
        },
      }}
      onClick={() => onSelectTarget(targets)}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <SvgIcon
          sx={{
            width: "45px",
            height: "45px",
            mr: "15px",
          }}
          component={TargetSvg}
          inheritViewBox
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "20px",
              lineHeight: "27px",
              color: "#222222",
              minWidth: "auto",
            }}
            variant="body1"
          >
            {targets.target.targetName || "no-name"}
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "19px",
              color: "#222222",
              minWidth: "auto",
            }}
            variant="body1"
          >
            {targets.target.discriminator || "no-name"}
          </Typography>
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
          <Tooltip title={"Cluster ID: " + targets.target.clusterId}>
            <SvgIcon
              sx={{
                width: "24px",
                height: "24px",
                mr: "4px",
              }}
              component={Cpu}
              inheritViewBox
            />
          </Tooltip>
          <Tooltip title={"Discriminator: " + targets.target.discriminator}>
            <SvgIcon
              sx={{
                width: "24px",
                height: "24px",
                mr: "4px",
              }}
              component={Finger}
              inheritViewBox
            />
          </Tooltip>
        </Box>
        <Box sx={{}}>
          <Tooltip title={"Cluster ID: " + targets.target.clusterId}>
            <SvgIcon
              sx={{
                width: "24px",
                height: "24px",
                mr: "4px",
              }}
              component={Heart}
              inheritViewBox
            />
          </Tooltip>
          <Tooltip title={"Discriminator: " + targets.target.discriminator}>
            <SvgIcon
              sx={{
                width: "24px",
                height: "24px",
                mr: "4px",
              }}
              component={More}
              inheritViewBox
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
