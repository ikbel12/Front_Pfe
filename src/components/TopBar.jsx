import {
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { userRequest } from "../requestMethod";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const theme = useTheme();
  const [notification, setNotification] = React.useState([]);
  const [notifCount, setNotifCount] = React.useState([]);
  // @ts-ignore
  const user = useSelector((state) => state.user.userInfo);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openNotif = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchNotification = async () => {
    try {
      // Fetch notification data
      const response = await userRequest.get("/alerte/user");
      
      setNotification(response.data.alertes);
      setNotifCount(response.data.unreadAlertes);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchNotification();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      // Mark notification as read
      await userRequest.put(`/alerte/${id}/read`);
      fetchNotification();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AppBar
      position="fixed"
      // @ts-ignore
      open={open}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box flexGrow={1} />

        <Stack direction={"row"}>
          {theme.palette.mode === "light" ? (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <LightModeOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                localStorage.setItem(
                  "currentMode",
                  theme.palette.mode === "dark" ? "light" : "dark"
                );
                setMode((prevMode) =>
                  prevMode === "light" ? "dark" : "light"
                );
              }}
              color="inherit"
            >
              <DarkModeOutlinedIcon />
            </IconButton>
          )}
    <Badge badgeContent={notifCount.length} color="error">
          <IconButton
            id="demo-positioned-button"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit">
            <NotificationsOutlinedIcon />
          </IconButton>
          </Badge>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={openNotif}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {notification.map((notif) => (
              <MenuItem key={notif.id} onClick={handleClose}>
                {notif.message} {notif.statut === "unread" && <Button variant="contained" color="primary" size="small" onClick={() => handleMarkAsRead(notif._id)}>Mark as read</Button>}
              </MenuItem>
            ))}
            {notification.length === 0 && <MenuItem onClick={handleClose}>No notification</MenuItem>}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

