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
  Tabs,
  Tab,
  Divider,
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
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import AddButton from "../components/AddButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { banUser, getAllUserThunk } from "../network/GetAllUser";
import { SEND_SMS, SEND_EMAIL, SEND_NOTIFICATION } from "../redux/endpoint";
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

const SMS_DEFAULTS = {
  from: 'System',
  templateName: '',
  variables: '',
  priority: 'LOW',
  millisOffset: '0',
};

const EMAIL_DEFAULTS = {
  subject: '',
  contentType: 'plain/text',
  content: '',
  priority: 'LOW',
  additionalRecipients: '',
  cc: '',
  bcc: '',
  attachments: [],
};

const NOTIFICATION_DEFAULTS = {
  subject: '',
  contentType: 'plain/text',
  content: '',
  priority: 'LOW',
  icon: '',
  type: '',
  sender: 'system',
  redirectWeb: '',
  redirectAndroid: '',
  redirectIos: '',
  paramContext: '',
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
  const { data: profile, loading: profileLoading } = useSelector(
    (state) => state.getProfileSlice ?? { data: null, loading: false }
  );
  const isSuperAdmin = Boolean(profile?.params?.Roles);

  useEffect(() => {
    if (profileLoading) return;
    if (!profile || Array.isArray(profile) || Object.keys(profile).length === 0) return;
    if (!isSuperAdmin) {
      navigate("/web/admin/home", { replace: true });
    }
  }, [profileLoading, profile, isSuperAdmin, navigate]);
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
  const [activeNotifyTab, setActiveNotifyTab] = useState('sms');
  const [smsForm, setSmsForm] = useState(() => ({ ...SMS_DEFAULTS }));
  const [emailForm, setEmailForm] = useState(() => ({ ...EMAIL_DEFAULTS }));
  const [notificationForm, setNotificationForm] = useState(() => ({ ...NOTIFICATION_DEFAULTS }));
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyResult, setNotifyResult] = useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Store the clicked icon's position
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [message, setMessage] = useState("");

  const parseCommaSeparated = (value) => {
    if (!value) return [];
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  };

  const buildNotifyResult = (channel, ok, data) => {
    const payload = data?.body ?? data ?? null;
    const statusMeta = data?.status ?? payload?.status;
    const isError = !ok || statusMeta?.error === true || payload?.success === false;
    if (isError || !payload) {
      const errorMessage = statusMeta?.message || payload?.message || payload?.error || 'Failed to send message.';
      const details = payload ? [JSON.stringify(payload)] : [];
      return { status: 'error', summary: errorMessage, details };
    }

    if (channel === 'sms') {
      const successCount = payload?.successCount ?? 0;
      const failureCount = payload?.failureCount ?? 0;
      const details = Array.isArray(payload?.results)
        ? payload.results.map((item) => `${item.phoneNumber || item.userId || 'recipient'}: ${item.success ? 'Success' : 'Failed'}`)
        : [];
      const summaryMessage = statusMeta?.message || 'SMS sent successfully';
      return {
        status: 'success',
        summary: `${summaryMessage}. Success: ${successCount}, Failures: ${failureCount}`,
        details,
      };
    }

    if (channel === 'email') {
      const accepted = Array.isArray(payload?.accepted) ? payload.accepted : [];
      const rejected = Array.isArray(payload?.rejected) ? payload.rejected : [];
      const details = [
        ...accepted.map((addr) => `Accepted: ${addr}`),
        ...rejected.map((addr) => `Rejected: ${addr}`),
      ];
      const summaryMessage = statusMeta?.message || payload?.message || 'Email sent successfully';
      return {
        status: 'success',
        summary: `${summaryMessage}. Accepted: ${accepted.length}, Rejected: ${rejected.length}`,
        details,
      };
    }

    const counts = payload?.counts || {};
    const success = counts.success ?? (Array.isArray(payload?.successes) ? payload.successes.length : 0);
    const failure = counts.failure ?? (Array.isArray(payload?.failures) ? payload.failures.length : 0);
    const details = [
      ...(Array.isArray(payload?.successes)
        ? payload.successes.map((item) => `Success: ${item.token || item.userId || item.platform || 'recipient'}`)
        : []),
      ...(Array.isArray(payload?.failures)
        ? payload.failures.map((item) => `Failure: ${item.token || item.userId || 'recipient'} - ${item.error?.message || 'Unknown error'}`)
        : []),
    ];
    const summaryMessage = statusMeta?.message || 'Notifications queued';
    return {
      status: 'success',
      summary: `${summaryMessage}. Success: ${success}, Failures: ${failure}`,
      details,
    };
  };


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

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64);
        } else {
          reject(new Error('Unable to read file.'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || Number.isNaN(bytes)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const handleEmailAttachmentsChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      const attachments = await Promise.all(
        files.map(async (file) => {
          const content = await readFileAsBase64(file);
          return {
            filename: file.name,
            content,
            encoding: 'base64',
            contentType: file.type || 'application/octet-stream',
            size: file.size,
          };
        })
      );

      setEmailForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...attachments],
      }));
      if (event.target) {
        event.target.value = '';
      }
    } catch (error) {
      setNotifyResult({
        status: 'error',
        summary: error?.message || 'Failed to process attachments.',
        details: [],
      });
    }
  };

  const handleRemoveEmailAttachment = (index) => {
    setEmailForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, attachmentIndex) => attachmentIndex !== index),
    }));
  };

  const handleOpenNotifyDialog = () => {
    if (selectedUserSubs.length === 0) return;
    setActiveNotifyTab('sms');
    setSmsForm({ ...SMS_DEFAULTS });
    setEmailForm({ ...EMAIL_DEFAULTS });
    setNotificationForm({ ...NOTIFICATION_DEFAULTS });
    setNotifyResult(null);
    setNotifyLoading(false);
    setIsNotifyDialogOpen(true);
  };

  const handleCloseNotifyDialog = () => {
    setIsNotifyDialogOpen(false);
    setNotifyResult(null);
    setNotifyLoading(false);
  };

  const handleNotifySubmit = async () => {
    if (notifyLoading) return;
    const recipients = Array.from(selectedSubsSet);
    if (recipients.length === 0) {
      setNotifyResult({
        status: 'error',
        summary: 'Select at least one user to notify.',
        details: [],
      });
      return;
    }

    if (activeNotifyTab === 'sms' && !smsForm.templateName.trim()) {
      setNotifyResult({ status: 'error', summary: 'Please provide a template name for SMS.', details: [] });
      return;
    }

    if (activeNotifyTab === 'email') {
      if (!emailForm.subject.trim()) {
        setNotifyResult({ status: 'error', summary: 'Email subject is required.', details: [] });
        return;
      }
      if (!emailForm.content.trim()) {
        setNotifyResult({ status: 'error', summary: 'Email content is required.', details: [] });
        return;
      }
    }

    if (activeNotifyTab === 'notification') {
      if (!notificationForm.subject.trim()) {
        setNotifyResult({ status: 'error', summary: 'Notification subject is required.', details: [] });
        return;
      }
      if (!notificationForm.content.trim()) {
        setNotifyResult({ status: 'error', summary: 'Notification content is required.', details: [] });
        return;
      }
    }

    setNotifyLoading(true);
    setNotifyResult(null);

    try {
      let endpoint = '';
      let payload = {};

      if (activeNotifyTab === 'sms') {
        const variables = parseCommaSeparated(smsForm.variables);
        payload = {
          from: smsForm.from?.trim() || 'System',
          toType: 'user',
          to: recipients.length === 1 ? recipients[0] : recipients,
          templateName: smsForm.templateName.trim(),
          variables,
          priority: smsForm.priority,
          millisOffset: Number(smsForm.millisOffset) || 0,
        };
        endpoint = SEND_SMS;
      } else if (activeNotifyTab === 'email') {
        const userRecipients = recipients.map((sub) => ({ to: sub, toType: 'user' }));
        const additionalTo = parseCommaSeparated(emailForm.additionalRecipients).map((email) => ({
          to: email,
          toType: 'email',
        }));
        const ccRecipients = parseCommaSeparated(emailForm.cc).map((email) => ({
          to: email,
          toType: 'email',
        }));
        const bccRecipients = parseCommaSeparated(emailForm.bcc).map((email) => ({
          to: email,
          toType: 'email',
        }));
        const attachmentsPayload = emailForm.attachments.map(({ filename, content, encoding, contentType }) => ({
          filename,
          content,
          encoding,
          contentType,
        }));
        payload = {
          to: [...userRecipients, ...additionalTo],
          subject: emailForm.subject.trim(),
          contentType: emailForm.contentType,
          content: emailForm.content,
          priority: emailForm.priority,
          attachments: attachmentsPayload,
        };
        if (ccRecipients.length) {
          payload.cc = ccRecipients;
        }
        if (bccRecipients.length) {
          payload.bcc = bccRecipients;
        }
        endpoint = SEND_EMAIL;
      } else {
        const target = recipients.length === 1 ? recipients[0] : recipients;
        payload = {
          to: target,
          priority: notificationForm.priority,
          subject: notificationForm.subject.trim(),
          content: notificationForm.content,
          contentType: notificationForm.contentType,
          sender: notificationForm.sender?.trim() || undefined,
          icon: notificationForm.icon?.trim() || undefined,
          type: notificationForm.type?.trim() || undefined,
        };
        const redirects = {};
        if (notificationForm.redirectWeb?.trim()) redirects.onClickWeb = notificationForm.redirectWeb.trim();
        if (notificationForm.redirectAndroid?.trim()) redirects.onClickAndroid = notificationForm.redirectAndroid.trim();
        if (notificationForm.redirectIos?.trim()) redirects.onClickIos = notificationForm.redirectIos.trim();
        if (Object.keys(redirects).length) {
          payload.redirects = redirects;
        }
        if (notificationForm.paramContext?.trim()) {
          payload.params = { context: notificationForm.paramContext.trim() };
        }
        endpoint = SEND_NOTIFICATION;
      }

      const cleanPayload = JSON.parse(JSON.stringify(payload));
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(cleanPayload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }

      const result = buildNotifyResult(activeNotifyTab, response.ok, data);
      setNotifyResult(result);
    } catch (error) {
      setNotifyResult({
        status: 'error',
        summary: error.message || 'Unexpected error while sending notification.',
        details: [],
      });
    } finally {
      setNotifyLoading(false);
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
  const selectedSubsSet = useMemo(() => new Set(selectedUserSubs.map((sub) => normalizeSub(sub)).filter(Boolean)), [selectedUserSubs]);
  const selectedCount = selectedSubsSet.size;
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
    if (!isSuperAdmin) {
      return;
    }
    dispatch(getAllUserThunk(form));
    
  }, [dispatch, page, rowsPerPage, searchParam, sortField, sortOrder, filterPayload, isSuperAdmin]);

  const profileLoaded = !profileLoading && profile && !Array.isArray(profile) && Object.keys(profile).length > 0;
  if (profileLoaded && !isSuperAdmin) {
    return null;
  }

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
          <Stack spacing={2}>
            <Typography variant="body2">Sending to {selectedCount} selected user{selectedCount === 1 ? '' : 's'}.</Typography>
            <Tabs
              value={activeNotifyTab}
              onChange={(_, tabValue) => setActiveNotifyTab(tabValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab value="sms" label="SMS" />
              <Tab value="email" label="Email" />
              <Tab value="notification" label="Notification" />
            </Tabs>
            <Divider />

            {activeNotifyTab === 'sms' && (
              <Stack spacing={2}>
                <TextField
                  label="Sender"
                  value={smsForm.from}
                  onChange={(event) => setSmsForm((prev) => ({ ...prev, from: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Template Name"
                  value={smsForm.templateName}
                  onChange={(event) => setSmsForm((prev) => ({ ...prev, templateName: event.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Variables (comma separated)"
                  value={smsForm.variables}
                  onChange={(event) => setSmsForm((prev) => ({ ...prev, variables: event.target.value }))}
                  fullWidth
                  helperText="Optional. Example: 123456,987654"
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    label="Priority"
                    value={smsForm.priority}
                    onChange={(event) => setSmsForm((prev) => ({ ...prev, priority: event.target.value }))}
                    sx={{ minWidth: 160 }}
                  >
                    {['LOW', 'MEDIUM', 'HIGH'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Schedule Offset (ms)"
                    type="number"
                    value={smsForm.millisOffset}
                    onChange={(event) => setSmsForm((prev) => ({ ...prev, millisOffset: event.target.value }))}
                    helperText="Delay before sending (optional)"
                    fullWidth
                  />
                </Stack>
              </Stack>
            )}

            {activeNotifyTab === 'email' && (
              <Stack spacing={2}>
                <TextField
                  label="Subject"
                  value={emailForm.subject}
                  onChange={(event) => setEmailForm((prev) => ({ ...prev, subject: event.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Content Type"
                  value={emailForm.contentType}
                  onChange={(event) => setEmailForm((prev) => ({ ...prev, contentType: event.target.value }))}
                  sx={{ minWidth: 200 }}
                >
                  {['plain/text', 'text/html'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Content"
                  value={emailForm.content}
                  onChange={(event) => setEmailForm((prev) => ({ ...prev, content: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={4}
                  required
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    label="Priority"
                    value={emailForm.priority}
                    onChange={(event) => setEmailForm((prev) => ({ ...prev, priority: event.target.value }))}
                    sx={{ minWidth: 160 }}
                  >
                    {['LOW', 'MEDIUM', 'HIGH'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Additional Recipients (emails)"
                    value={emailForm.additionalRecipients}
                    onChange={(event) => setEmailForm((prev) => ({ ...prev, additionalRecipients: event.target.value }))}
                    helperText="Comma separated list. Optional."
                    fullWidth
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="CC (emails)"
                    value={emailForm.cc}
                    onChange={(event) => setEmailForm((prev) => ({ ...prev, cc: event.target.value }))}
                    helperText="Comma separated list. Optional."
                    fullWidth
                  />
                  <TextField
                    label="BCC (emails)"
                    value={emailForm.bcc}
                    onChange={(event) => setEmailForm((prev) => ({ ...prev, bcc: event.target.value }))}
                    helperText="Comma separated list. Optional."
                    fullWidth
                  />
                </Stack>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Attachments
                    <input hidden type="file" multiple onChange={handleEmailAttachmentsChange} />
                  </Button>
                  {emailForm.attachments.length > 0 && (
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Attachments:
                      </Typography>
                      {emailForm.attachments.map((attachment, index) => (
                        <Stack
                          key={`${attachment.filename}-${index}`}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ maxWidth: '100%' }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {attachment.filename}
                            {attachment.size ? ` (${formatFileSize(attachment.size)})` : ''}
                          </Typography>
                          <IconButton
                            size="small"
                            aria-label={`remove attachment ${attachment.filename}`}
                            onClick={() => handleRemoveEmailAttachment(index)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Stack>
            )}
            {activeNotifyTab === 'notification' && (
              <Stack spacing={2}>
                <TextField
                  label="Subject"
                  value={notificationForm.subject}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, subject: event.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  select
                  label="Content Type"
                  value={notificationForm.contentType}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, contentType: event.target.value }))}
                  sx={{ minWidth: 200 }}
                >
                  {['plain/text', 'text/html'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Content"
                  value={notificationForm.content}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, content: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={4}
                  required
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    label="Priority"
                    value={notificationForm.priority}
                    onChange={(event) => setNotificationForm((prev) => ({ ...prev, priority: event.target.value }))}
                    sx={{ minWidth: 160 }}
                  >
                    {['LOW', 'MEDIUM', 'HIGH'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Sender"
                    value={notificationForm.sender}
                    onChange={(event) => setNotificationForm((prev) => ({ ...prev, sender: event.target.value }))}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Icon URL"
                  value={notificationForm.icon}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, icon: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Type"
                  value={notificationForm.type}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, type: event.target.value }))}
                  helperText="Optional. e.g. confirm"
                  fullWidth
                />
                <TextField
                  label="Web Redirect URL"
                  value={notificationForm.redirectWeb}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, redirectWeb: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Android Redirect"
                  value={notificationForm.redirectAndroid}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, redirectAndroid: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="iOS Redirect"
                  value={notificationForm.redirectIos}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, redirectIos: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Context Param"
                  value={notificationForm.paramContext}
                  onChange={(event) => setNotificationForm((prev) => ({ ...prev, paramContext: event.target.value }))}
                  helperText="Optional context value sent as params.context"
                  fullWidth
                />
              </Stack>
            )}

            {notifyResult && (
              <Alert severity={notifyResult.status === 'success' ? 'success' : 'error'}>
                <Stack spacing={1}>
                  <Typography variant="body2">{notifyResult.summary}</Typography>
                  {notifyResult.details?.length ? (
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      {notifyResult.details.map((detail, index) => (
                        <Typography component="li" variant="caption" key={index}>
                          {detail}
                        </Typography>
                      ))}
                    </Box>
                  ) : null}
                </Stack>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleCloseNotifyDialog} disabled={notifyLoading}>
              Close
            </Button>
          </Stack>
          <Button
            variant="contained"
            onClick={handleNotifySubmit}
            disabled={notifyLoading || selectedSubsSet.size === 0}
          >
            {notifyLoading ? 'Sending...' : 'Send'}
          </Button>
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
