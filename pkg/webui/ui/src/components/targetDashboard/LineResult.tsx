import { Box, SvgIcon, Tooltip, Typography } from "@mui/material";
import { ReactComponent as AddItemSvg } from "./../../icons/history/additem.svg";
import { ReactComponent as DiffSvg } from "./../../icons/history/diff.svg";
import { ReactComponent as FolderSvg } from "./../../icons/history/folder.svg";
import { ReactComponent as WarningSvg } from "./../../icons/history/warning.svg";
import { ReactComponent as ForbiddenSvg } from "./../../icons/history/forbidden.svg";
import { ReactComponent as TrashSvg } from "./../../icons/history/trash.svg";
import { FC } from "react";
import { CommandResultSummary } from "../../models";

export const LineResult: FC<{ rs: CommandResultSummary }> = ({ rs }) => {
  const arrIconTooltip = [
    { count: rs.errors, title: "total errors", Icon: ForbiddenSvg },
    { count: rs.warnings, title: "total warnings", Icon: WarningSvg },
    { count: rs.newObjects, title: "new objects", Icon: AddItemSvg },
    { count: rs.deletedObjects, title: "deleted objects", Icon: TrashSvg },
    { count: rs.orphanObjects, title: "orphan objects", Icon: FolderSvg },
    { count: rs.changedObjects, title: "changed objects", Icon: DiffSvg },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        ml: "7px",
      }}
    >
      {arrIconTooltip
        .filter((e) => e.count !== 0)
        .map(({ count, title, Icon }) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mr: "10px",
              }}
            >
              <Tooltip title={`${count} ${title}`}>
                <SvgIcon
                  sx={{
                    width: "24px",
                    height: "24px",
                  }}
                  component={Icon}
                  inheritViewBox
                />
              </Tooltip>
              <Typography
                sx={{
                  mt: "5px",
                  fontWeight: 500,
                  fontSize: "8px",
                  lineHeight: "11px",
                  color: "#39403E",
                }}
              >
                {count}
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
};
