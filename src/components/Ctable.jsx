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
  Typography,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { approveListing } from "../network/ListingThunk";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ctable = ({ tableHead, rowData, tableName, pagination, setPage, setRowsPerPage ,fordispatch}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openmode, setopenmode] = useState(false);
  const [listingid, setlistingId] = useState("");
  const dispatch=useDispatch()
  const navigate = useNavigate()
  const handleOpen = (event) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
 
console.log(pagination,"paginationddddddddddddd")
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
 
  const onSubmit = async() => {
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
      toast.success(res?.payload?.status?.message ||res?.payload?.response?.status?.message|| "Listing rejected successfully");
    } catch (error) {
      toast.error(error.message || "Failed to reject listing");
    }
  };

  const onSubmitApprove = async() => {
    try {
      const form = {
        listingId: listingid,
        action: "approve"
      }
      const res = await dispatch(approveListing(form))
      console.log(res,"ddddddddddddddddddddddddddddddddd")
      fordispatch(" ")
      handleClose();
      toast.success(res?.payload?.status?.message||res?.payload?.response?.status?.message || "Listing approved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to approve listing");
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "---";
    return text.length > maxLength ? (
      <Tooltip title={text}>
        <Typography noWrap>
          {text.substring(0, maxLength)}...
        </Typography>
      </Tooltip>
    ) : text;
  };

  console.log(rowData, "rowdataq")
  return (
    <Box>
      <TableContainer component={Paper} sx={{ background: "#fff" }}>
        <Table sx={{ width: "100%", fontFamily: "Open Sans" }} aria-label="dynamic table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#737373" }}>
              {tableHead.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{ bgcolor: "#EFFEF7", color: "#1A1F2D", fontFamily: "Open Sans" }}
                >
                  {header.name}
                </TableCell>
              ))}
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
                onClick={() => navigate(`/reswap/web/admin/listing-details/${rowData?.listingId}`)}
              >
                <TableCell sx={{ fontFamily: "Open Sans" }}>
                  {rowData?.listingId}
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans", maxWidth: 200 }}>
                  {truncateText(rowData?.title, 25)}
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans", maxWidth: 200 }}>
                  {truncateText(rowData?.propertyName, 25)}
                </TableCell>
                <TableCell>
                  {rowData?.unitType || "---"}
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans", maxWidth: 250 }}>
                  {truncateText(`${rowData?.location?.address}, ${rowData?.location?.city}, ${rowData?.location?.state}, ${rowData?.location?.country}`, 40)}
                </TableCell>
                <TableCell>{rowData?.
                  viewCount
                }</TableCell>
                <TableCell
                  sx={{ color: rowData?.verified ? "green" : "red" }}

                >
                  {rowData?.verified ? "Active" : "Inactive"}

                </TableCell>
                <TableCell
                  sx={{ 
                    color: rowData?.status === "active" 
                      ? "#2E7D32" // green
                      : rowData?.status === "approval" 
                      ? "#ED6C02" // orange
                      : "#D32F2F", // red for rejected
                    fontWeight: 500
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {rowData?.status}
                  <IconButton onClick={(event) => {
                    handleOpen(event);
                    setlistingId(rowData?.listingId)
                  }}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} 
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination?.totalItems || 0} // Use total items from pagination
          rowsPerPage={pagination?.currentItems || 10}
          page={(pagination?.currentPage || 1) - 1} // Subtract 1 as MUI pagination is 0-based
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
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
          <ListItem button onClick={() => navigate("/reswap/web/admin/addform")}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem button sx={{cursor:"pointer"}} onClick={onSubmitApprove}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Approve" />
          </ListItem>
          <ListItem button sx={{cursor:"pointer"}}onClick={() => setopenmode(true)}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText primary="Reject" />
          </ListItem>
        </List>
      </Popover>
      <Modal open={openmode} onClose={()=>setopenmode(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
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
          <Button variant="outlined" color="secondary" onClick={()=>setopenmode(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
    </Box>
  );
};

export default Ctable;
