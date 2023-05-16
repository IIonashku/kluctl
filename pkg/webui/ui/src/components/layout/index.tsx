import { FC, ReactElement, useState } from "react";
import Box from "@mui/material/Box";
import { LeftDrive } from "./LeftDriver";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./header";
import { Typography } from "@mui/material";

export const drawerWidth = 224;

export const Layout: FC<{ children: ReactElement }> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDrawerOpenClosed = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        // pt: "106px"
      }}
    >
      <CssBaseline />
      <Header open={open} />
      <LeftDrive open={open} handleDrawerOpenClosed={handleDrawerOpenClosed} />
      <Box sx={{ width: "auto" }}>
        {" "}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "44px",
            color: "#222222",
            m: "39px 30px",
          }}
          variant="h1"
        >
          Dashboard
        </Typography>
        {children}
      </Box>
    </Box>
  );
};
