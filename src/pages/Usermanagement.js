import React, { useEffect, useMemo, useState } from "react";
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
  TableSortLabel,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Modal,
  Checkbox,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  LockReset as LockResetIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  NotificationsActive as NotificationsActiveIcon,
} from "@mui/icons-material";
import AddButton from "../components/AddButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { banUser, getAllUserThunk } from "../network/GetAllUser";
import { toast } from "react-toastify";
import { event } from "react-ga";
import JoyrideWrapper from '../components/JoyrideWrapper';


const FILTER_DEFAULTS = {
  status: 'all',
  userType: 'all',
  familyName: '',
  givenName: '',
  preferredUsername: '',
  phoneNumber: '',
};

const normalizeSub = (sub) => {
  if (sub === undefined || sub === null) return null;
  return String(sub);
};

const tableHead = [
  { id: "sub", label: "Sub" },
  { id: "family_name", label: "Family Name" },
  { id: "given_name", label: "Given Name" },
  { id: "preferred_username", label: "Prefered User Name" },
  { id: "userType", label: "User Type", sortable: false },
  { id: "phone_number", label: "Phone Number" },
  { id: "action", label: "Action", sortable: false },
];



const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchParam, setSearchQuery] = useState("");
  const [listingid, setlistingId] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [filterDraft, setFilterDraft] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedUserSubs, setSelectedUserSubs] = useState(() => []);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Store the clicked icon's position
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [message, setMessage] = useState("");

  const filterPayload = useMemo(() => {
    const payload = {};

    if (filters.status && filters.status !== 'all') {
      payload.activityStatus = filters.status;
    }

    if (filters.userType && filters.userType !== 'all') {
      payload.isSuperAdmin = filters.userType === 'admin';
    }

    const withWildcard = (value) => {
      if (!value || typeof value !== 'string') return null;
      const trimmed = value.trim();
      return trimmed ? ('*' + trimmed + '*') : null;
    };

    const familyFilter = withWildcard(filters.familyName);
    if (familyFilter) {
      payload.family_name = familyFilter;
    }

    const givenFilter = withWildcard(filters.givenName);
    if (givenFilter) {
      payload.given_name = givenFilter;
    }

    const preferredFilter = withWildcard(filters.preferredUsername);
    if (preferredFilter) {
      payload.preferred_username = preferredFilter;
    }

    const phoneFilter = withWildcard(filters.phoneNumber);
    if (phoneFilter) {
      payload.phone_number = phoneFilter;
    }

    return payload;
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    const { status, userType, familyName, givenName, preferredUsername, phoneNumber } = filters;

    const hasText = (value) => {
      if (!value || typeof value !== 'string') {
        return false;
      }
      return value.trim().length > 0;
    };

    return (
      (status && status !== 'all') ||
      (userType && userType !== 'all') ||
      hasText(familyName) ||
      hasText(givenName) ||
      hasText(preferredUsername) ||
      hasText(phoneNumber)
    );
  }, [filters]);

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

  const handleOpenFilterDialog = () => {
    setFilterDraft({ ...filters });
    setIsFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setIsFilterDialogOpen(false);
  };

  const handleFilterDraftChange = (field) => (event) => {
    const value = event?.target?.value ?? '';
    setFilterDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilterDraft({ ...FILTER_DEFAULTS });
  };

  const handleFilterApply = () => {
    setFilters({ ...filterDraft });
    setIsFilterDialogOpen(false);
    setPage(0);
  };

  const handleClearAllFilters = () => {
    setFilters({ ...FILTER_DEFAULTS });
    setFilterDraft({ ...FILTER_DEFAULTS });
    setIsFilterDialogOpen(false);
    setPage(0);
  };

  const handleToggleUserSelection = (sub) => {
    const normalized = normalizeSub(sub);
    if (!normalized) return;
    setSelectedUserSubs((prev) => {
      if (prev.includes(normalized)) {
        return prev.filter((value) => value !== normalized);
      }
      return [...prev, normalized];
    });
  };

  const handleSelectAllCurrent = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    setSelectedUserSubs((prev) => {
      const nextSet = new Set(prev);
      const subs = rows
        .map((row) => normalizeSub(row?.sub))
        .filter(Boolean);
      const allSelected = subs.length > 0 && subs.every((sub) => nextSet.has(sub));

      if (allSelected) {
        subs.forEach((sub) => nextSet.delete(sub));
      } else {
        subs.forEach((sub) => nextSet.add(sub));
      }

      return Array.from(nextSet);
    });
  };

  const handleClearSelection = () => {
    setSelectedUserSubs([]);
  };

  const handleOpenNotifyDialog = () => {
    if (selectedUserSubs.length === 0) return;
    setIsNotifyDialogOpen(true);
  };

  const handleCloseNotifyDialog = () => {
    setIsNotifyDialogOpen(false);
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
    console.log("newPage++++++++++====",newPage)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSort = (field) => {
    if (!field) return;
    setPage(0);
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };
  const { listings, loading, error
  } = useSelector((state) => state.AllUserSlice);

  console.log(listings, "Users");
  const pagination = listings?.pagination;
  const currentRows = listings?.body || [];
  const selectedSubsSet = useMemo(() => new Set(selectedUserSubs), [selectedUserSubs]);
  const selectedCount = selectedUserSubs.length;
  const allCurrentSelected = currentRows.length > 0 && currentRows.every((row) => {
    const normalized = normalizeSub(row?.sub);
    return normalized && selectedSubsSet.has(normalized);
  });
  const someCurrentSelected = currentRows.some((row) => {
    const normalized = normalizeSub(row?.sub);
    return normalized && selectedSubsSet.has(normalized);
  }) && !allCurrentSelected;
  const form = {
    search: `*${searchParam}*`,
    page: page, // Add +1 if your API expects 1-based page numbers
    limit: rowsPerPage,
    ...(sortField ? { sortField, sortOrder } : {}),
    ...filterPayload,
  };

  useEffect(() => {
    console.log("form++++++++++====",page)
    dispatch(getAllUserThunk(form));
    
  }, [dispatch, page, rowsPerPage, searchParam, sortField, sortOrder, filterPayload]);

  return (
        <Box p={2} style={{ backgroundColor: "#FAFAFA" }} className="user-tour">
      {/* <Box p={2} style={{ backgroundColor: "#FAFAFA" }}> */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        py={2}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="subtitle2">
            Selected Users: {selectedCount}
          </Typography>
          {selectedCount > 0 && (
            <Button size="small" onClick={handleClearSelection}>
              Clear Selection
            </Button>
          )}
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchParam}
            onChange={handleSearch}
            sx={{ width: { xs: '100%', md: 250 }, borderRadius: 50 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <IconButton
              title="Filters"
              color={hasActiveFilters ? 'primary' : 'default'}
              onClick={handleOpenFilterDialog}
            >
              <FilterListIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<NotificationsActiveIcon />}
              disabled={selectedCount === 0}
              onClick={handleOpenNotifyDialog}
            >
              Notify{selectedCount > 0 ? ` (${selectedCount})` : ''}
            </Button>
          </Stack>
        </Stack>
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
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someCurrentSelected}
                    checked={allCurrentSelected && currentRows.length > 0}
                    onChange={() => handleSelectAllCurrent(currentRows)}
                    onClick={(event) => event.stopPropagation()}
                    inputProps={{ 'aria-label': 'select all users' }}
                  />
                </TableCell>
                {tableHead.map((column) => {
                  const isActive = sortField === column.id;
                  const isSortable = column.sortable !== false && column.id && column.id !== "action";
                  return (
                    <TableCell
                      key={column.id || column.label}
                      sortDirection={isActive ? sortOrder : false}
                    >
                      {isSortable ? (
                        <TableSortLabel
                          active={isActive}
                          direction={isActive ? sortOrder : "asc"}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {currentRows.map((row, index) => {
                const rawSub = row?.sub;
                const normalizedSub = normalizeSub(rawSub);
                const isSelected = Boolean(normalizedSub && selectedSubsSet.has(normalizedSub));
                return (
                  <TableRow
                    key={normalizedSub || index}
                    hover
                    selected={isSelected}
                    onClick={() => handleToggleUserSelection(rawSub)}
                    sx={{ cursor: normalizedSub ? 'pointer' : 'default' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleToggleUserSelection(rawSub);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        inputProps={{ 'aria-label': `select user ${normalizedSub || index}` }}
                      />
                    </TableCell>
                    <TableCell>{rawSub}</TableCell>
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
                );
              })}
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

      <Dialog open={isFilterDialogOpen} onClose={handleCloseFilterDialog} fullWidth maxWidth="sm">
        <DialogTitle>Filter Users</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="user-filter-status-label">Status</InputLabel>
              <Select
                labelId="user-filter-status-label"
                label="Status"
                value={filterDraft.status}
                onChange={handleFilterDraftChange('status')}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="user-filter-type-label">User Type</InputLabel>
              <Select
                labelId="user-filter-type-label"
                label="User Type"
                value={filterDraft.userType}
                onChange={handleFilterDraftChange('userType')}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Family Name"
              size="small"
              value={filterDraft.familyName}
              onChange={handleFilterDraftChange('familyName')}
            />

            <TextField
              label="Given Name"
              size="small"
              value={filterDraft.givenName}
              onChange={handleFilterDraftChange('givenName')}
            />

            <TextField
              label="Preferred Username"
              size="small"
              value={filterDraft.preferredUsername}
              onChange={handleFilterDraftChange('preferredUsername')}
            />

            <TextField
              label="Phone Number"
              size="small"
              value={filterDraft.phoneNumber}
              onChange={handleFilterDraftChange('phoneNumber')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleClearAllFilters} color="secondary">
            Clear All
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleFilterReset}>Reset</Button>
            <Button onClick={handleCloseFilterDialog}>Cancel</Button>
            <Button onClick={handleFilterApply} variant="contained">
              Apply
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog open={isNotifyDialogOpen} onClose={handleCloseNotifyDialog} fullWidth maxWidth="sm">
        <DialogTitle>Notify Users</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Notification message configuration coming soon.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Selected users: {selectedCount}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotifyDialog}>Close</Button>
        </DialogActions>
      </Dialog>

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
          {/* <ListItem button onClick={() => navigate("/reswap/web/admin/adduser")}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem> */}
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
