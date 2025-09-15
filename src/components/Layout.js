import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 280; // Fixed width for desktop

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-50">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: 'white',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'white',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'white'
            },
          }}
        >
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div 
          className="hidden md:block bg-white border-r border-gray-200"
          style={{ width: drawerWidth, minWidth: drawerWidth }}
        >
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div 
        className="flex-1 overflow-auto"
        style={{ 
          backgroundColor: "#FAFAFA",
          marginLeft: isMobile ? 0 : 0, // No margin needed with flexbox
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`
        }}
      >
        <div className="p-2 md:p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
