import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, IconButton, Button, TextField, Stack, Chip, Box, CircularProgress, Typography, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllNotifications, deleteNotification, seeNotification } from '../network/generalApi';

const NotificationRow = ({ notif, onDelete, onConfirm, onReply, onNotificationClick }) => {
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete(notif.notificationId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleNotificationClick = (e) => {
    // Prevent click if clicking on action buttons
    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
      return;
    }
    onNotificationClick(notif);
  };

  // Map API fields to UI fields
  const message = `${notif.subject || ''} ${notif.content || ''}`.trim();
  const sender = notif.sender || notif.from || '';
  const avatar = notif.icon || 'https://randomuser.me/api/portraits/men/32.jpg';
  const contentType = notif.contentType;
  const yesText = notif.typespec?.yesText || 'Accept';
  const noText = notif.typespec?.noText || 'Decline';

  return (
    <>
      <Box
        onClick={handleNotificationClick}
        sx={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 1.5 : 2,
          mb: 2,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          width: '100%',
          minHeight: isMobile ? 'auto' : 72,
          gap: isMobile ? 1 : 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <Avatar 
          src={avatar} 
          alt={sender} 
          sx={{ 
            width: isMobile ? 40 : 44, 
            height: isMobile ? 40 : 44, 
            mr: 2 
          }} 
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            <Box sx={{ 
              fontWeight: 700, 
              color: '#222', 
              fontSize: isMobile ? 14 : 16, 
              wordBreak: 'break-word',
              lineHeight: 1.4
            }}>
              {notif.subject || ''}
            </Box>
            {!notif.seen && (
              <Chip 
                label="New" 
                size="small" 
                sx={{ 
                  bgcolor: '#27ae60', 
                  color: '#fff', 
                  fontWeight: 500, 
                  fontSize: isMobile ? 10 : 11, 
                  borderRadius: 2, 
                  height: isMobile ? 18 : 20,
                  minWidth: isMobile ? 30 : 35
                }} 
              />
            )}
          </Box>
          <Box sx={{ 
            fontWeight: 400, 
            color: '#666', 
            fontSize: isMobile ? 12 : 14, 
            wordBreak: 'break-word',
            lineHeight: 1.4
          }}>
            {notif.content || ''}
          </Box>
        </Box>
        
        {/* Actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: 1,
          minWidth: isMobile ? '100%' : 200,
          ml: 'auto'
        }}>
          {/* Show Accept/Decline buttons only when typespec is present */}
          {notif.typespec && (
            <Stack direction="row" spacing={1}>
              <IconButton
                color="success"
                size="small"
                sx={{ 
                  bgcolor: '#e8f5e8',
                  '&:hover': { bgcolor: '#d4edda' },
                  width: 40,
                  height: 40
                }}
                onClick={() => onConfirm(notif.notificationId, 'accept')}
                title={yesText}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                sx={{ 
                  bgcolor: '#fdeaea',
                  '&:hover': { bgcolor: '#f8d7da' },
                  width: 40,
                  height: 40
                }}
                onClick={() => onConfirm(notif.notificationId, 'decline')}
                title={noText}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          )}
          {/* Show Reply button only when contentType is "Reply" AND no typespec (to avoid overlap) */}
          {contentType === 'Reply' && !notif.typespec && (
            replying ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  sx={{ 
                    bgcolor: '#f5f7fa', 
                    borderRadius: 2, 
                    minWidth: 120 
                  }}
                  inputProps={{ 
                    style: { 
                      fontSize: 15 
                    } 
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ 
                    fontWeight: 600, 
                    borderRadius: 2, 
                    px: 2, 
                    py: 0.5, 
                    textTransform: 'none', 
                    minWidth: 60 
                  }}
                  onClick={() => { onReply(notif.notificationId, reply); setReply(''); setReplying(false); }}
                  disabled={!reply.trim()}
                >
                  Send
                </Button>
              </Stack>
            ) : (
              <IconButton
                color="primary"
                size="small"
                sx={{
                  bgcolor: '#eaf4fd',
                  '&:hover': { bgcolor: '#d4eafd' },
                  width: 40,
                  height: 40
                }}
                onClick={() => setReplying(true)}
                title="Reply"
              >
                <ReplyIcon />
              </IconButton>
            )
          )}
          {/* Delete button - always visible */}
          <IconButton
            color="error"
            size="small"
            sx={{ 
              bgcolor: '#fdeaea',
              '&:hover': { bgcolor: '#f8d7da' },
              width: 40,
              height: 40
            }}
            onClick={handleDeleteClick}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          Delete Notification
        </DialogTitle>
        <DialogContent>
          <Typography>
            Do you sure want to delete this notification?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            No
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            autoFocus
            sx={{ minWidth: 80 }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notification);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const handleDelete = async (notificationId) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      // The Redux slice will automatically update the state
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // You can add a toast notification here if needed
    }
  };

  const handleConfirm = (id, response) => {
    // TODO: Call confirm API and update state
    alert(`Notification ${id} response: ${response}`);
    // Optionally remove or update notification
  };

  const handleReply = (id, reply) => {
    // TODO: Call reply API and update state
    alert(`Notification ${id} reply: ${reply}`);
    // Optionally remove or update notification
  };

  const handleNotificationClick = async (notif) => {
    try {
      // Call seeNotification API
      const response = await dispatch(seeNotification(notif.notificationId)).unwrap();
      console.log('Notification marked as seen:', notif.notificationId);
      
      // Get the redirects from the response
      const redirects = response.body?.[0]?.redirects;
      
      if (redirects?.onClickWeb) {
        // Open the onClickWeb link in a new tab
        window.open(redirects.onClickWeb, '_blank');
      }
    } catch (error) {
      console.error('Failed to mark notification as seen:', error);
      // You can add a toast notification here if needed
    }
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      background: '#f4f6fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      py: isMobile ? 1 : isTablet ? 2 : 4,
      px: isMobile ? 1 : isTablet ? 2 : 4,
    }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          mx: 0,
          background: 'transparent',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {loading ? (
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            mt: isMobile ? 4 : 6 
          }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ 
            px: isMobile ? 1 : 2, 
            color: 'red',
            fontSize: isMobile ? 14 : 16
          }}>
            <b>{error}</b>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ 
            px: isMobile ? 1 : 2,
            fontSize: isMobile ? 14 : 16
          }}>
            <b>No notifications.</b>
          </Box>
        ) : (
          notifications.map((notif) => (
            <NotificationRow
              key={notif.notificationId}
              notif={notif}
              onDelete={handleDelete}
              onConfirm={handleConfirm}
              onReply={handleReply}
              onNotificationClick={handleNotificationClick}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default NotificationPage; 