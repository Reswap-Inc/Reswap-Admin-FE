import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Typography, IconButton, Badge } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { userLogout } from "../network/Authapi";
import {

  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';



import { onMessage } from 'firebase/messaging';
import { messaging } from './../utils/firebaseConfig';// Your initialized messaging object

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
const [messages, setMessages] = useState([]);
const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("iptoken");
  const userData = JSON.parse(sessionStorage.getItem("userData"));


  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
  
      setNotificationCount(prev => prev + 1);
      setMessages(prev => [...prev, payload.notification]);
  
      // alert(payload.notification.title + ' - ' + payload.notification.body);
    });
  
    return () => unsubscribe(); // Clean up
  }, []);
  
  
  // Add this useEffect to update route name
  useEffect(() => {
    const path = window.location.pathname;
    const routeName = path.substring(1).charAt(0).toUpperCase() + path.slice(2);
    setCurrentRoute(routeName || "Dashboard");
  }, []);

  const handleProfileClick = (event) => {
    event.preventDefault(); // Prevent the default behavior like scrolling
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await userLogout();
      // Clear session storage
      
      // Redirect to login page
      
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally add user notification here
    }
  };

  // Use useEffect to disable horizontal scroll when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Disable horizontal scroll
      document.body.style.overflowX = "hidden";
    } else {
      // Enable horizontal scroll again
      document.body.style.overflowX = "auto";
    }

    // Clean up to reset the scroll behavior when component unmounts or menu is closed
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-white border-b">
      <div className="mr-2 flex h-16 items-center px-4 bg-white w-full justify-between">
        <div className="flex items-center gap-4">
          <Link to="/reswap/web/admin/home" className="flex items-center gap-2">
            <img
              src="/rlogo.png"
              alt="BigTrader Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* <div className="flex items-center gap-2 px-14">
            <MenuIcon
              className="text-primarycolor"
              sx={{
                fontSize: 24,

                cursor: "pointer",
              }}
            />
            <Typography
              sx={{ fontWeight: "bold" }}
              className="text-primarycolor"
            >
              {currentRoute}
            </Typography>
          </div> */}
        </div>

        {!token && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* Add Notification Icon */}
            {/* <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              sx={{ marginRight: 2 }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon sx={{ color: "gray" }} />
              </Badge>
            </IconButton> */}


<Box
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setDropdownOpen(false)}
  sx={{ position: "relative", display: "inline-block" }}
>
  <IconButton
    size="large"
    aria-label="show notifications"
    color="inherit"
    sx={{ marginRight: 2 }}
  >
    <Badge badgeContent={notificationCount} color="error">
      <NotificationsIcon sx={{ color: "gray" }} />
    </Badge>
  </IconButton>

  {dropdownOpen && messages.length > 0 && (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        right: 0,
        zIndex: 10,
        width: 300,
        maxHeight: 300,
        overflowY: "auto",
        boxShadow: 3,
        mt: 1
      }}
    >
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={msg.title}
              secondary={msg.body}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )}
</Box>


            <div onClick={handleProfileClick} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: "gray", marginLeft: 1 }}>
                {userData?.username||"Admin"}
              </Typography>
              <AccountCircleIcon
                sx={{
                  fontSize: 40,
                  color: "gray",
                  cursor: "pointer",
                }}
              />
             
            </div>

            {isMenuOpen && (
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    marginTop: "8px",
                    width: "150px", // The menu will now adjust its width according to the parent container
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
