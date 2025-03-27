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
  Button,
  Typography,
  Modal,
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
import { banUser, getAllUserThunk } from "../network/GetAllUser";
import { toast } from "react-toastify";
import { event } from "react-ga";


const tableHead = ["Sub", "Family Name ", "Given Name", "Prefered User Name", "User Type", "Phone Number", "Action"];



const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchParam, setSearchQuery] = useState("");
  const [listingid, setlistingId] = useState("");
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Store the clicked icon's position
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    if (event.target.value.length <= 150) {
      setMessage(event.target.value);
    }
  };
  const [openmode, setopenmode] = useState(false);
  const onSubmit = async () => {
    try {

      const form = {
        sub: listingid, // Currently not checked if user is valid
        action: "unban", // "ban", "unban", 
        reason: message // OPTIONAL

      }
      const res = await dispatch(banUser(form))
console.log("bannnnnnnnnnnnn",res)
      setMessage("");
      setopenmode(false);
      handleClose();
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "unban successfully");
    } catch (error) {
      toast.error(error.message || "Failed to unban");
    }
  };
  const onSubmitban = async () => {
    try {

      const form = {
        sub: listingid, // Currently not checked if user is valid
        action: "ban", // "ban", "unban", 
        reason: message // OPTIONAL

      }
      const res = await dispatch(banUser(form))

      setMessage("");
      setopenmode(false);
      handleClose();
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "ban successfully");
    } catch (error) {
      toast.error(error.message || "Failed to ban");
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);

    // const searchForm = {
    //   ...form,
    //   search: searchValue ? `*${searchValue}*` : "",
    //   page: 0 // Reset to first page when searching
    // };

    // dispatch(getSearchAlllisting(searchForm));
  };
  // Handlers for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const { listings, loading, error
  } = useSelector((state) => state.AllUserSlice);

  console.log(listings, "Users");
  const pagination = listings?.pagination;
  const form = {
    search: `*${searchParam}*`,
    page: page + 1, // Add +1 if your API expects 1-based page numbers
    limit: rowsPerPage,
  };

  useEffect(() => {
    dispatch(getAllUserThunk(form));
  }, [dispatch, page, rowsPerPage, searchParam]);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>

        <Box></Box>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchParam}
            onChange={handleSearch}
            sx={{ width: 200, borderRadius: 50 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* <AddButton onClick={() => navigate("/reswap/web/admin/adduser")} startIcon={<AddIcon />} bgColor="#5CBA47" textColor="#1c1c1c">
            + Add
          </AddButton> */}
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
                  <TableCell>{!row?.isSuperAdmin ? "User" : "Admin"}</TableCell>
                  <TableCell>{row?.phone_number || "-"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Actions">
                      <IconButton onClick={(e) => {
                        handleOpen(e);
                        setlistingId(row?.sub)
                      }}>
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
          <ListItem button onClick={() => {
            setopenmode(true)
          }}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="Ban" />
          </ListItem>
          <ListItem button onClick={() => setopenmode(true)}>
            <ListItemIcon>
              <LockResetIcon />
            </ListItemIcon>
            <ListItemText primary="Unban" />
          </ListItem>
        </List>
      </Popover>
      <Modal open={openmode} onClose={() => setopenmode(false)}>
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
              Unban
            </Button>
            <Button variant="outlined" color="secondary" onClick={onSubmitban}>
              Ban
            </Button>
            <Button variant="outlined" color="danger" onClick={() => setopenmode(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManagement;
