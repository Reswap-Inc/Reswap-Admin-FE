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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";

const Ctable = ({ tableHead, rowData, tableName, pagination, setPage, setRowsPerPage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
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
                onClick={() => navigate("/listing-details")}
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
                  sx={{ color: rowData?.status == "active" ? "green" : "red" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {rowData?.status}
                  <IconButton onClick={handleOpen}>
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
          <ListItem button onClick={() => navigate("/addform")}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem button onClick={() => alert("comming soon")}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Archive" />
          </ListItem>
          <ListItem button onClick={() => alert("comming soon!")}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText primary="Ban User" />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
};

export default Ctable;
