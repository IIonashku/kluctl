import { FC, ReactElement, ElementType } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactComponent as Logo } from "./../../iconss/logo.svg";
import { ReactComponent as LogoText } from "./../../iconss/LogoText.svg";
import { ReactComponent as Targets } from "./../../iconss/menu/targets.svg";
import { ReactComponent as Settings } from "./../../iconss/menu/settings.svg";
import { ReactComponent as Account } from "./../../iconss/menu/account.svg";
import { Box } from "@mui/material";
const drawerWidth = 224;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `96px`,
});
const LogoSvg = styled(Logo)(() => ({
  width: "50px",
}));

const LogoTextSvg = styled(LogoText)`
  transition: 0.5s all ease-out;
  width: 144px;
`;
const ListTitle = styled(ListItemText)(() => ({
  "& .MuiListItemText-primary": {
    fontWeight: 500,
    fontSize: "24px",
  },
}));
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && openedMixin(theme)),
  ...(!open && closedMixin(theme)),
  "& .MuiDrawer-paper": {
    padding: "31px 23px",
    background: "#222222",
    borderRadius: "0px 20px 20px 0px",
    ...(open && openedMixin(theme)),
    ...(!open && closedMixin(theme)),
  },
}));
const WrappLogo = styled(Box)(() => ({
  width: "178px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
type Props = {
  open: boolean;
  handleDrawerOpenClosed: () => void;
};
export const LeftDrive: FC<Props> = ({ open, handleDrawerOpenClosed }) => {
  const navigate = useNavigate();
  return (
    <Drawer
      PaperProps={{
        elevation: 8,
      }}
      variant="permanent"
      open={open}
    >
      <WrappLogo onClick={handleDrawerOpenClosed}>
        <LogoSvg />
        <LogoTextSvg
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </WrappLogo>
      <Divider
        sx={{
          mt: "23px",
          background: "#DFEBE9",
        }}
      />
      <Box
        sx={{
          width: "100%",
        }}
      >
        <List>
          {[
            { title: "Targets", icon: Targets, link: "/targets" },
            { title: "Settings", icon: Settings, link: "/" },
            { title: "Account", icon: Account, link: "/" },
          ].map(({ title, icon: Icon, link }) => (
            <ListItem key={title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 0,
                }}
                onClick={() => {
                  navigate(link);
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListTitle
                  primary={title}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: "#fff",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
