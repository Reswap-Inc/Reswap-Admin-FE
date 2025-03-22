import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");
  const navigate = useNavigate();

  const token = sessionStorage.getItem("iptoken");
  const userData = JSON.parse(sessionStorage.getItem("userData"));

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

  const handleLogout = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
    // Clear the token from local storage
    sessionStorage.removeItem("iptoken");
    // Navigate to the login page
    navigate("/login");
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
          <Link to="/dashboard" className="flex items-center gap-2">
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
            onClick={handleProfileClick}
          >
            <AccountCircleIcon
              sx={{
                fontSize: 40,
                color: "gray",
                cursor: "pointer",
              }}
            />
            <Typography sx={{ color: "gray", marginLeft: 1 }}>
              {userData?.username}
            </Typography>

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
