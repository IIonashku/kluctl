import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// const drawerWidth = 240;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Exit = styled("div")`
  cursor: pointer;
  position: absolute;
  width: 20px;
  height: 20px;
  right: 0;
  font-size: 35px;
  color: #fff;
  transform: rotate(45deg);
`;
export const RightDriver: React.FC<{
  children: React.ReactElement;
  open: any;
  onClose: any;
}> = ({ children, open, onClose }) => {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  return (
    <Drawer
      sx={{
        zIndex: 1300,
        width: "auto",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          background: "#222222",
          width: "auto",
        },
      }}
      // variant="persistent"
      anchor="right"
      open={open}
      onClose={() => onClose()}
    >
      <Exit onClick={() => onClose()}>+</Exit>
      {children}
    </Drawer>
  );
};
