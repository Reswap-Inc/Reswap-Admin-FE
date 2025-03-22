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
  ListItemText,TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";

const Ctable = ({ tableHead, rowData, tableName}) => {
  const [anchorEl, setAnchorEl] = useState(null);
const navigate =useNavigate()
  const handleOpen = (event) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handlers for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
            {rowData?.map((row, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: "#ffffff", cursor: "pointer", fontFamily: "Open Sans" }}
                onClick={() => navigate("/listing-details")}
              >
                <TableCell sx={{ fontFamily: "Open Sans" }}>{row?.customerId}</TableCell>
                <TableCell sx={{ fontFamily: "Open Sans" }}>
                  <img
                    src={row?.categoryImagePath || row?.imageUrl || "/tableDefaultImage.jpeg"}
                    alt={row.name}
                    width={30}
                    height={30}
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "Open Sans" }}>
                  {row.name?.length > 25 ? (
                    <Tooltip title={row.name}>
                      <span>{`${row.name.slice(0, 25)}...`}</span>
                    </Tooltip>
                  ) : (
                    row.customerName
                  )}
                </TableCell>
                {tableName === "subCategories" && (
                  <TableCell>{row?.categoryId?.name || "---"}</TableCell>
                )}
                <TableCell sx={{ fontFamily: "Open Sans" }}>{row?.productsListed}</TableCell>
                {[...Array(2)].map((_, i) => (
                  <TableCell key={i}>{!row?.searchEnable ? 12 : "No"}</TableCell>
                ))}
                <TableCell>{"---"}</TableCell>
                <TableCell
                  sx={{ color: !row?.searchEnable ? "green" : "red" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!row?.searchEnable ? "Active" : "No"}
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
        count={rowData?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
