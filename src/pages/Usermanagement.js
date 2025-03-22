import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  LockReset as LockResetIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import AddButton from "../components/AddButton";


const tableHead = ["Sub", "Family Name ", "Given Name", "Prefered User Name", "User Type", "Phone Number", "Action"];

const categories = [
  {
    userNameId: "Mithun\nID: B06589",
    role: "Admin",
    mobileNumber: "+1 (455) 444-7206",
    emailId: "mithun@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "Active",
  },
  {
    userNameId: "James J. Scott\nID: 8D6590",
    role: "Admin",
    mobileNumber: "+1 (532) 564-1980",
    emailId: "jamesscott@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "",
  },
  {
    userNameId: "Mithun\nID: B06589",
    role: "Admin",
    mobileNumber: "+1 (455) 444-7206",
    emailId: "mithun@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "Active",
  },
  {
    userNameId: "James J. Scott\nID: 8D6590",
    role: "Admin",
    mobileNumber: "+1 (532) 564-1980",
    emailId: "jamesscott@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "",
  },
  {
    userNameId: "Mithun\nID: B06589",
    role: "Admin",
    mobileNumber: "+1 (455) 444-7206",
    emailId: "mithun@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "Active",
  },
  {
    userNameId: "James J. Scott\nID: 8D6590",
    role: "Admin",
    mobileNumber: "+1 (532) 564-1980",
    emailId: "jamesscott@usc.edu",
    joiningDate: "Dec 23, 2023",
    status: "",
  },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Store the clicked icon's position
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
    <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
        
        <Box></Box>

        <Box display="flex" alignItems="center" gap={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{ width: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

          <AddButton onClick={() => navigate("/adduser")} startIcon={<AddIcon />} bgColor="#5CBA47" textColor="#1c1c1c">
            + Add
          </AddButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#EFFEF7" }}>
              {tableHead.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((row, index) => (
              <TableRow key={index} onClick={() => navigate("/user-profile")} style={{ cursor: "pointer" }}>
                <TableCell>{row.userNameId}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row.emailId}</TableCell>
                <TableCell>{row.joiningDate}</TableCell>
                <TableCell>{row.status || "-"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Actions">
                    <IconButton onClick={handleOpen}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        // count={rowData?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>

      {/* Popover for MoreVert Actions */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          <ListItem button onClick={() => navigate("/adduser")}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem button onClick={() => alert("comming soon")}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="Deactivate" />
          </ListItem>
          <ListItem button onClick={() => alert("comming soon!")}>
            <ListItemIcon>
              <LockResetIcon />
            </ListItemIcon>
            <ListItemText primary="Reset Password" />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
};

export default UserManagement;
