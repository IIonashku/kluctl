import { FC } from "react"
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { drawerWidth } from ".";
import { Typography } from "@mui/material";


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  
const AppBar = styled("div", {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    position:"absolute",
    top: 0,
    padding: "39px 0 0 40px",
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: "96px",
    height: "106px",
    width: `calc(100% - 96px)`,
    flexDirection: "column",
    justifyContent: "space-between",
    background: "none",
    boxShadow: "none",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  type Props = {
    open: boolean
  }
export const Header:FC<Props> = ({open}) => {
   return (
    <AppBar  open={open}>
     <Typography sx={{
        fontWeight: 700,
        fontSize: "32px",
        lineHeight: "44px",
        color: "#222222",
        minWidth: "auto",
     }} variant="h1">Dashboard</Typography>
  </AppBar>
   )
}