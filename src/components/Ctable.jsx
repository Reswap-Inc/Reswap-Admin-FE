import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TablePagination,
  TableSortLabel,
  Typography,
  Modal,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import CancelIcon from "@mui/icons-material/Cancel";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useNavigate } from "react-router-dom";
import { approveListing, deleteListingThunk } from "../network/ListingThunk";
import { updateListingFunction } from "../network/ListingThunk";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const Ctable = ({ tableHead, rowData, tableName, pagination, setPage, setRowsPerPage, fordispatch, sortField = "", sortOrder = "asc", onSort }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [row, setRowData] = useState(null);

  const navigate = useNavigate();
  const [openmode, setopenmode] = useState(false);
  const [listingid, setlistingId] = useState("");
  const dispatch = useDispatch()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteApiMessage, setDeleteApiMessage] = useState("");

  const handleOpen = (event) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
  };
  // const profile = useSelector((state) => state.getProfileSlice?.data?.data)
  const profile = useSelector((state) => state.getProfileSlice?.data)
  const handleClose = () => {
    setAnchorEl(null);
  };

  // console.log(profile,"paginationddddddddddddd")
  // Handlers for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // Add 1 as the API expects 1-based pagination
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing rows per page
  };

  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    if (event.target.value.length <= 150) {
      setMessage(event.target.value);
    }
  };

  const onSubmit = async () => {
    try {
      const form = {
        listingId: listingid,
        reason: message,
        action: "reject"
      }
      const res = await dispatch(approveListing(form))
      fordispatch(" ")
      setMessage("");
      setopenmode(false);
      handleClose();
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "Listing rejected successfully");
    } catch (error) {
      toast.error(error.message || "Failed to reject listing");
    }
  };

  const onSubmitApprove = async () => {
    try {
      const form = {
        listingId: listingid,
        action: "approve"
      }
      const res = await dispatch(approveListing(form))
      console.log(res, "ddddddddddddddddddddddddddddddddd")
      fordispatch(" ")
      handleClose();
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "Listing approved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to approve listing");
    }
  };
  const onSubmitHibernate = async () => {
    try {
      const newStatus = row?.status === 'active' ? 'inactive' : 'active';
      const form = {
        listingId: row?.listingId,
        status: newStatus
      };
      const res = await updateListingFunction(form);
      fordispatch("");
      handleClose();
      toast.success(res?.data?.status?.message || res?.data?.message || "Listing status updated successfully");
      fordispatch("");
    } catch (error) {
      toast.error(error.message || "Failed to update listing status");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteApiMessage("");
    try {
      const result = await dispatch(deleteListingThunk(listingid)).unwrap();
      const apiMsg = result?.status?.message || result?.message || "Listing deleted successfully";
      setDeleteApiMessage(apiMsg);
      if (!result?.status?.error && !result?.error) {
        setTimeout(() => {
          setDeleteDialogOpen(false);
          setDeleteApiMessage("");
          fordispatch(""); // Refresh table
        }, 1500);
      }
    } catch (error) {
      const apiMsg = error?.status?.message || error?.message || "Failed to delete listing";
      setDeleteApiMessage(apiMsg);
    } finally {
      setDeleting(false);
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "---";
    const mobileMaxLength = isMobile ? 15 : maxLength;
    return text.length > mobileMaxLength ? (
      <Tooltip title={text}>
        <Typography noWrap>
          {text.substring(0, mobileMaxLength)}...
        </Typography>
      </Tooltip>
    ) : text;
  };

  console.log(rowData, "rowdataq")
  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          background: "#fff",
          overflowX: "auto", // Enable horizontal scrolling on mobile
          "& .MuiTable-root": {
            minWidth: isMobile ? 800 : "100%", // Ensure minimum width for mobile scrolling
          }
        }}
      >
        <Table sx={{ width: "100%", fontFamily: "Open Sans" }} aria-label="dynamic table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#737373" }}>
              {tableHead.map((header, index) => {
                const columnId =
                  typeof header === "object"
                    ? header.id || header.key || header.name || header.label
                    : header;
                const label =
                  typeof header === "object"
                    ? header.label || header.name || header.id || ""
                    : header;
                const isSortable =
                  Boolean(onSort) &&
                  Boolean(columnId) &&
                  (typeof header === "object" ? header.sortable !== false : false);
                const isActive = isSortable && sortField === columnId;
                return (
                  <TableCell
                    key={columnId || label || index}
                    sx={{
                      bgcolor: "#EFFEF7",
                      color: "#1A1F2D",
                      fontFamily: "Open Sans",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      padding: isMobile ? "8px 4px" : "16px",
                      whiteSpace: "nowrap"
                    }}
                    sortDirection={isActive ? sortOrder : false}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={isActive}
                        direction={isActive ? sortOrder : "asc"}
                        onClick={() => onSort(columnId)}
                      >
                        {label}
                      </TableSortLabel>
                    ) : (
                      label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>

            {rowData?.map((rowData, index) => (
              <TableRow
                key={rowData?.listingId || index}
                sx={{
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontFamily: "Open Sans",
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                onClick={() => navigate(`/web/admin/home/listing-details/${rowData?.listingId}`)}
              >
                <TableCell sx={{
                  fontFamily: "Open Sans",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px",
                  whiteSpace: "nowrap"
                }}>
                  {rowData?.listingId}
                  {/* {console.log(rowData,"listingId++++++++++========")} */}
                </TableCell>
                <TableCell sx={{
                  fontFamily: "Open Sans",
                  maxWidth: isMobile ? 120 : 200,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px"
                }}>
                  {/* {truncateText(rowData?.title, 25)} */}
                  {truncateText(rowData?.propertyName, 25)}
                </TableCell>
                <TableCell sx={{
                  fontFamily: "Open Sans",
                  maxWidth: isMobile ? 120 : 200,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px"
                }}>
                  {/* {truncateText(rowData?.propertyName, 25)} */}
                  {truncateText(rowData?.title, 25)}
                </TableCell>
                <TableCell sx={{
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px",
                  whiteSpace: "nowrap"
                }}>
                  {rowData?.unitType?.name || "---"}
                </TableCell>
                <TableCell sx={{
                  fontFamily: "Open Sans",
                  maxWidth: isMobile ? 150 : 250,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px"
                }}>
                  {truncateText(`${rowData?.location?.address}, ${rowData?.location?.city}, ${rowData?.location?.state}, ${rowData?.location?.country}`, 40)}
                </TableCell>
                <TableCell sx={{
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px",
                  whiteSpace: "nowrap"
                }}>
                  {rowData?.viewCount}
                </TableCell>
                <TableCell sx={{
                  color: rowData?.verified ? "green" : "orange",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  padding: isMobile ? "8px 4px" : "16px",
                  whiteSpace: "nowrap"
                }}>
                  {rowData?.verified ? "Yes" : "Pending"}
                </TableCell>
                {/* <TableCell
        sx={{ 
          color: rowData?.status === "active" 
            ? "#2E7D32"
            : rowData?.status === "approval" 
            ? "#ED6C02"
            : "#D32F2F",
          fontWeight: 500,
          fontSize: isMobile ? "0.75rem" : "0.875rem",
          padding: isMobile ? "8px 4px" : "16px",
          whiteSpace: "nowrap"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {rowData?.status}
      </TableCell> */}
                <TableCell
                  sx={{
                    color: (() => {
                      switch (rowData?.status) {
                        case "active":
                          return "#2E7D32"; // Green
                        case "pending":
                          return "#ED6C02"; // Orange
                        case "rejected":
                          return "#D32F2F"; // Red
                        case "inactive":
                        case "draft":
                          return "#6c757d"; // Gray
                        default:
                          return "#000000"; // Fallback
                      }
                    })(),
                    fontWeight: 500,
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    padding: isMobile ? "8px 4px" : "16px",
                    whiteSpace: "nowrap"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {rowData?.status
                    ? rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)
                    : ""}
                </TableCell>

                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setRowData(rowData); // <-- Ensure this sets the row for the popover
                      handleOpen(e);
                      setlistingId(rowData?.listingId);
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <MoreVertIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
          component="div"
          count={pagination?.totalItems || 0} // Use total items from pagination
          rowsPerPage={pagination?.currentItems || 10}
          page={(pagination?.currentPage || 1) - 1} // Subtract 1 as MUI pagination is 0-based
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            isMobile ? `${from}-${to}` : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: isMobile ? "0.75rem" : "0.875rem"
            },
            "& .MuiTablePagination-select": {
              fontSize: isMobile ? "0.75rem" : "0.875rem"
            }
          }}
        />
      </TableContainer>

      {/* Popover for MoreVertIcon Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => navigate("/web/admin/home/add-listing", { state: { editMode: true, listingId: row?.listingId } })}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem button sx={{ cursor: "pointer" }} onClick={onSubmitHibernate}>
            <ListItemIcon>
              {row?.status === 'active' ? <PauseCircleIcon color="warning" /> : <PlayCircleIcon color="success" />}
            </ListItemIcon>
            <ListItemText primary={row?.status === 'active' ? 'Hibernate' : 'Unhibernate'} />
          </ListItem>
          {/* <ListItem button sx={{ cursor: "pointer" }} onClick={onSubmitApprove}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Approve" />
          </ListItem>
          <ListItem button sx={{ cursor: "pointer" }} onClick={() => setopenmode(true)}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText primary="Reject" />
          </ListItem> */}
          {profile?.custom_fields?.isLeanAdmin && profile?.params?.Roles && (
            <>
              <ListItem button sx={{ cursor: "pointer" }} onClick={onSubmitApprove}>
                <ListItemIcon>
                  <ArchiveIcon />
                </ListItemIcon>
                <ListItemText primary="Approve" />
              </ListItem>

              <ListItem button sx={{ cursor: "pointer" }} onClick={() => setopenmode(true)}>
                <ListItemIcon>
                  <BlockIcon />
                </ListItemIcon>
                <ListItemText primary="Reject" />
              </ListItem>
              <ListItem button sx={{ cursor: "pointer" }} onClick={() => setDeleteDialogOpen(true)}>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
              </ListItem>
            </>
          )}
        </List>
      </Popover>
      <Modal open={openmode} onClose={() => setopenmode(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: isMobile ? 2 : 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Enter your reason        </Typography>
          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            value={message}
            onChange={handleInputChange}
            inputProps={{ maxLength: 150 }}
            multiline
            rows={3}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setopenmode(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this listing?</Typography>
          {deleteApiMessage && (
            <Typography sx={{ mt: 2, color: deleteApiMessage.toLowerCase().includes('fail') ? 'error.main' : 'success.main' }}>
              {deleteApiMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ctable;
