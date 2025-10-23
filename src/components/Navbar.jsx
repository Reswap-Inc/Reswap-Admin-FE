import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import JoyrideWrapper from "./JoyrideWrapper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { getProfile, userLogout, changePassword } from "../network/Authapi";
import { REDIRECT_LOGIN, LOGOUT } from "../redux/endpoint";
import { getUnreadNotificationsCount, getAllNotifications, seeNotification } from "../network/generalApi";

import { onMessage } from "firebase/messaging";
import { messaging } from "../utils/firebaseConfig";
import { LogOut } from "lucide-react";


const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Change Password State
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const profile = useSelector((state) => state.getProfileSlice?.data);
  const isSuperAdmin = Boolean(profile?.params?.Roles);
  const profileError = useSelector((state) => state.getProfileSlice?.error);
  const unreadCount = useSelector((state) => state.notification?.unreadCount || 0);
  const unreadNotifications = useSelector((state) => 
    state.notification?.notifications?.filter(notif => !notif.seen) || []
  );
  const token = sessionStorage.getItem("iptoken");
  const [showTour, setShowTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  console.log('--NAVBAR--Profile:', profile)
  // console.log('--NAVBAR--Profile Error:', profileError)
  // console.log('--NAVBAR--Token:', token)

  // Fetch profile and unread notifications count on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(getProfile()),
          dispatch(getUnreadNotificationsCount()),
          dispatch(getAllNotifications())
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Check if it's a redirect error (30x status)
        if (error?.response?.status >= 300 && error?.response?.status < 404) {
          setShowSessionExpiredDialog(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle unauthorized user access and session expired
  useEffect(() => {
    console.log("profile check", profile);
    console.log("profile error check", profileError);
    
    // Check for session expired (30x redirects)
    if (profileError && profileError?.status >= 300 && profileError?.status <= 404) {
      setShowSessionExpiredDialog(true);
      return;
    }

    if (!profile || profile === undefined) {
      console.log("profile not found");
      // Don't redirect immediately, let the loading state handle it
      return;
    } else {
      console.log('profile?.userType === ', profile);
      if (profile?.userType === 'user') {
        // Show popup instead of immediate redirect
        setShowUnauthorizedDialog(true);
      } else {
        sessionStorage.setItem("isAdmin", String(isSuperAdmin));
      }
    }
  }, [profile, profileError]);

  // Handle unauthorized dialog close
  const handleUnauthorizedDialogClose = () => {
    setShowUnauthorizedDialog(false);
    // Call session expired handler to redirect to login
    handleSessionExpiredDialogClose();
  };

  // Handle session expired dialog close
  const handleSessionExpiredDialogClose = () => {
    setShowSessionExpiredDialog(false);
    // Redirect to login page
    handleLogout();
  };

  // Listen for Firebase foreground messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("FCM Message received:", payload);
      setNotificationCount((prev) => prev + 1);
      setMessages((prev) => [...prev, payload.notification]);
    });

    return () => unsubscribe();
  }, []);

   const handleHelpClick = () => {
    console.log("Help clicked - starting tour");
    // Remove the tour seen flag to allow tour to run again
    localStorage.removeItem('hasSeenTour');
    
    // Reset tour state and force restart
    setShowTour(false);
    
    // Use setTimeout to ensure state is reset before starting new tour
    setTimeout(() => {
      setTourKey(prev => prev + 1); // Change key to force new tour instance
      setShowTour(true);
    }, 100);
  };

  const handleTourEnd = () => {
    console.log("Tour ended");
    setShowTour(false);
    // Set flag to indicate user has seen the tour
    localStorage.setItem('hasSeenTour', 'true');
  };

  // Toggle user menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear client-side sessionStorage or localStorage
      sessionStorage.clear();

      // Redirect to logout URL (cookie cleared on server, then redirected to return_to)
      console.log('--LOGOUT--', LOGOUT)
      window.location.href = LOGOUT;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Change Password Functions
  const handleChangePasswordClick = () => {
    setShowChangePasswordDialog(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    setPasswordError("");
    handleClose(); // Close the profile menu
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPasswordError(""); // Clear error when user types
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePasswordSubmit = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError("");
      
      // Get user email from profile or sessionStorage
      const userEmail = profile?.email || sessionStorage.getItem("userEmail");
      
      if (!userEmail) {
        setPasswordError("User email not found. Please try logging in again.");
        return;
      }
      
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        email: userEmail
      });

      // Success - close dialog and show success message
      setShowChangePasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Show success message and logout after user clicks OK
      if (window.confirm("Password changed successfully! You will be logged out. Click OK to continue.")) {
        handleLogout();
      }
      
    } catch (error) {
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangePasswordDialogClose = () => {
    setShowChangePasswordDialog(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    setPasswordError("");
  };

  // Prevent horizontal scroll on menu open
  useEffect(() => {
    document.body.style.overflowX = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, [isMenuOpen]);

  // Show loading or prevent rendering when unauthorized
  if (isLoading) {
    return (
      <header className="bg-white border-b navbar-tour">
        <div className="flex h-16 items-center px-2 md:px-4 bg-white w-full justify-center">
          <Typography sx={{ color: "gray" }}>Loading...</Typography>
        </div>
      </header>
    );
  }

  // Don't render the full navbar if unauthorized or session expired
  if (showUnauthorizedDialog || showSessionExpiredDialog) {
    return (
      <header className="bg-white border-b navbar-tour">
        <div className="flex h-16 items-center px-2 md:px-4 bg-white w-full justify-between">
          {/* Logo */}
          <Link to="/web/admin/home" className="flex items-center gap-2">
            <img 
              src="/web/admin/ReSwap.svg" 
              alt="Reswap Logo" 
              className={`${isMobile ? 'h-8' : 'h-12'} w-auto`} 
            />
          </Link>
        </div>

        {/* Unauthorized Dialog */}
        <Dialog
          open={showUnauthorizedDialog}
          onClose={handleUnauthorizedDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown
          slotProps={{
            backdrop: {
              onClick: (e) => e.stopPropagation()
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ 
            textAlign: 'center', 
            color: '#d32f2f',
            fontWeight: 'bold'
          }}>
            Not Authorized
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ 
              textAlign: 'center', 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#333'
            }}>
              Not authorized to use admin APP. Kindly download reswap mobile app.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button 
              onClick={handleUnauthorizedDialogClose} 
              variant="contained" 
              color="primary" 
              autoFocus
              sx={{ 
                minWidth: '100px',
                fontWeight: 'bold'
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Session Expired Dialog */}
        <Dialog
          open={showSessionExpiredDialog}
          onClose={handleSessionExpiredDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown
          slotProps={{
            backdrop: {
              onClick: (e) => e.stopPropagation()
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ 
            textAlign: 'center', 
            color: '#d32f2f',
            fontWeight: 'bold'
          }}>
            Session Expired
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ 
              textAlign: 'center', 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#333'
            }}>
              Your session has expired. Please log in again.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button 
              onClick={handleSessionExpiredDialogClose} 
              variant="contained" 
              color="primary" 
              autoFocus
              sx={{ 
                minWidth: '100px',
                fontWeight: 'bold'
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </header>
    );
  }

  return (
    <>
    <header className="bg-white border-b navbar-tour">
      <div className="flex h-16 items-center px-2 md:px-4 bg-white w-full justify-between">
        {/* Logo */}
        <Link to="/web/admin/home" className="flex items-center gap-2">
          <img 
            src="/web/admin/ReSwap.svg" 
            alt="Reswap Logo" 
            className={`${isMobile ? 'h-8' : 'h-12'} w-auto`} 
          />
        </Link>

        {/* User Info and Notifications */}
        { (
          <div className="flex items-center gap-2 md:gap-4">

            <IconButton
                          size="large"
                          color="inherit"
                          onClick={handleHelpClick}
                          title="Start Tour"
                        >
                          <HelpOutlineIcon sx={{ color: "gray" }} />
                        </IconButton>

            {/* Notifications */}
            <Box
              sx={{ position: "relative", display: "inline-block" }}
            >
              <IconButton 
                size={isMobile ? "small" : "large"} 
                color="inherit" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ color: "gray", fontSize: isMobile ? 20 : 24 }} />
                </Badge>
              </IconButton>

              {dropdownOpen && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 10,
                    width: isMobile ? 280 : 350,
                    maxHeight: 400,
                    overflowY: "auto",
                    boxShadow: 3,
                    mt: 1,
                    borderRadius: 2,
                  }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                      Notifications ({unreadCount})
                    </Typography>
                  </Box>
                  
                  {unreadNotifications.length > 0 ? (
                    <>
                      <List sx={{ py: 0 }}>
                        {unreadNotifications.slice(0, 5).map((notif, index) => (
                          <ListItem 
                            key={notif.notificationId} 
                            sx={{ 
                              borderBottom: index < unreadNotifications.slice(0, 5).length - 1 ? '1px solid #f0f0f0' : 'none',
                              cursor: 'pointer',
                              '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                            onClick={async () => {
                              try {
                                // Call seeNotification API
                                const response = await dispatch(seeNotification(notif.notificationId)).unwrap();
                                console.log('Notification marked as seen:', notif.notificationId);
                                
                                // Get the redirects from the response
                                const redirects = response.body?.[0]?.redirects;
                                
                                setDropdownOpen(false);
                                
                                if (redirects?.onClickWeb) {
                                  // Open the onClickWeb link in a new tab
                                  window.open(redirects.onClickWeb, '_blank');
                                } else {
                                  // If no redirect link, navigate to notifications page
                                  navigate('/web/admin/notifications');
                                }
                              } catch (error) {
                                console.error('Failed to mark notification as seen:', error);
                                setDropdownOpen(false);
                                navigate('/web/admin/notifications');
                              }
                            }}
                          >
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600, 
                                      fontSize: isMobile ? '0.875rem' : '1rem',
                                      color: '#333'
                                    }}
                                  >
                                    {notif.subject || 'Notification'}
                                  </Typography>
                                  <Chip 
                                    label="New" 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: '#27ae60', 
                                      color: '#fff', 
                                      fontWeight: 500, 
                                      fontSize: '0.7rem', 
                                      height: 18,
                                      minWidth: 30
                                    }} 
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    color: '#666',
                                    mt: 0.5
                                  }}
                                >
                                  {notif.content || 'No content'}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/web/admin/notifications');
                          }}
                          sx={{
                            bgcolor: '#1976d2',
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#1565c0' }
                          }}
                        >
                          View All Notifications
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        No unread notifications
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>

            {/* Profile */}
            <div 
              onClick={handleProfileClick} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer",
                gap: isMobile ? '4px' : '8px'
              }}
            >
              {!isMobile && (
                <Typography sx={{ color: "gray", fontSize: '0.875rem' }}>
                  {`${profile?.given_name} ${profile?.family_name}` || "Admin"}
                </Typography>
              )}
              <AccountCircleIcon sx={{ fontSize: isMobile ? 32 : 40, color: "gray" }} />
            </div>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleClose}
              PaperProps={{ 
                style: { 
                  marginTop: "8px", 
                  width: isMobile ? "120px" : "150px" 
                } 
              }}
            >
              <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Unauthorized Dialog */}
      <Dialog
        open={showUnauthorizedDialog}
        onClose={handleUnauthorizedDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        slotProps={{
          backdrop: {
            onClick: (e) => e.stopPropagation()
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          textAlign: 'center', 
          color: '#d32f2f',
          fontWeight: 'bold'
        }}>
          Not Authorized
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#333'
          }}>
            Not authorized to use admin APP. Kindly download reswap mobile app.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={handleUnauthorizedDialogClose} 
            variant="contained" 
            color="primary" 
            autoFocus
            sx={{ 
              minWidth: '100px',
              fontWeight: 'bold'
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Expired Dialog */}
      <Dialog
        open={showSessionExpiredDialog}
        onClose={handleSessionExpiredDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        slotProps={{
          backdrop: {
            onClick: (e) => e.stopPropagation()
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          textAlign: 'center', 
          color: '#d32f2f',
          fontWeight: 'bold'
        }}>
          Session Expired
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#333'
          }}>
          Your session has expired. Please log in again.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={handleSessionExpiredDialogClose} 
            variant="contained" 
            color="primary" 
            autoFocus
            sx={{ 
              minWidth: '100px',
              fontWeight: 'bold'
            }}
          >
            OK
          </Button>
        </DialogActions>
              </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={showChangePasswordDialog}
          onClose={() => {}} // Prevent closing on backdrop click
          aria-labelledby="change-password-dialog-title"
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '8px'
            }
          }}
        >
          <DialogTitle 
            id="change-password-dialog-title" 
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              fontSize: '1.25rem',
              color: '#333',
              pb: 1,
              position: 'relative'
            }}
          >
            Change Password
            <IconButton
              aria-label="close"
              onClick={handleChangePasswordDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#666',
                '&:hover': {
                  color: '#333',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            {/* Current Password */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              Current Password
            </Typography>
            <TextField
              fullWidth
              type={showPasswords.currentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              placeholder="Enter current password"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      edge="end"
                      size="small"
                    >
                      {showPasswords.currentPassword ? (
                        <VisibilityOffIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                      ) : (
                        <VisibilityIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                }
              }}
            />

            {/* New Password */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              New Password
            </Typography>
            <TextField
              fullWidth
              type={showPasswords.newPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange("newPassword")}
              placeholder="Enter new password"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                }
              }}
            />

            {/* Confirm Password */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              placeholder="Confirm new password"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      edge="end"
                      size="small"
                    >
                      {showPasswords.confirmPassword ? (
                        <VisibilityOffIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                      ) : (
                        <VisibilityIcon sx={{ color: '#27ae60', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                  },
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
            <Button
              onClick={handleChangePasswordSubmit}
              variant="contained"
              disabled={isChangingPassword}
              sx={{
                bgcolor: '#27ae60',
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '25px',
                px: 4,
                py: 1,
                minWidth: '200px',
                '&:hover': { 
                  bgcolor: '#229954' 
                },
                '&:disabled': {
                  bgcolor: '#bdc3c7',
                  color: '#7f8c8d'
                }
              }}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </Dialog>
        </header>

           {showTour && (
                <JoyrideWrapper 
                  key={tourKey} 
                  forceStart={true} 
                  onTourEnd={handleTourEnd}
                />
              )}
              </>
  );
};

export default Navbar;
