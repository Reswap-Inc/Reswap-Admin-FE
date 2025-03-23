import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllUserThunk } from "../network/GetAllUser";


const tableHead = ["Sub", "Family Name ", "Given Name", "Prefered User Name", "User Type", "Phone Number", "Action"];



const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Store the clicked icon's position
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
    // Handlers for pagination
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    const{ listings, loading, error
    } = useSelector((state) => state.AllUserSlice);
  
    console.log(listings, "Users");
  const pagination=listings?.pagination;
    const form = {
      page: page + 1, // Add +1 if your API expects 1-based page numbers
      limit: rowsPerPage,
    };
  
    useEffect(() => {
      dispatch(getAllUserThunk(form));
    }, [dispatch, page, rowsPerPage]);

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

          <AddButton onClick={() => navigate("/reswap/web/admin/adduser")} startIcon={<AddIcon />} bgColor="#5CBA47" textColor="#1c1c1c">
            + Add
          </AddButton>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Alert severity="error">
            {error || 'An error occurred while fetching users'}
          </Alert>
        </Box>
      ) : (
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
              {listings?.body?.map((row, index) => (
                <TableRow key={index} onClick={() => navigate("/reswap/web/admin/user-profile")} style={{ cursor: "pointer" }}>
                  <TableCell>{row?.sub}</TableCell>
                  <TableCell>{row?.family_name}</TableCell>
                  <TableCell>{row?.given_name}</TableCell>
                  <TableCell>{row?.preferred_username}</TableCell>
                  <TableCell>{!row?.isSuperAdmin?"User":"Admin" }</TableCell>
                  <TableCell>{row?.phone_number || "-"}</TableCell>
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
          count={pagination?.totalItems || 0}
          rowsPerPage={rowsPerPage}
          page={pagination?.currentPage || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </TableContainer>
      )}

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
          <ListItem button onClick={() => navigate("/reswap/web/admin/adduser")}>
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
