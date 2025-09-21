import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ctable from "../components/Ctable";
import AddButton from "../components/AddButton";
import AddIcon from "@mui/icons-material/Add";
import {
  Snackbar,
  Modal,
  Box,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getSearchAlllisting } from "../network/ListingThunk";
import { getProfile } from "../network/Authapi";

const FILTER_DEFAULTS = {
  verified: 'all',
  minViewCount: '',
  maxViewCount: '',
  propertyName: '',
  city: '',
  unitType: '',
};

const tableHead = [
  { id: "listingId", label: "Listing ID" },
  { id: "propertyName", label: "Property Name" },
  { id: "title", label: "Title" },
  { id: "unitType", label: "Unit Type", sortable: false },
  { id: "location", label: "Location", sortable: false },
  { id: "viewCount", label: "View Count" },
  { id: "verified", label: "Verified" },
  { id: "status", label: "Status" },
  { id: "actions", label: "Actions", sortable: false },
];

const Listing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tableset, settable] = useState("categories");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParam, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState('all');
  const [filters, setFilters] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [filterDraft, setFilterDraft] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const searchbarResetRef = useRef(null);
  const filterPayload = useMemo(() => {
    const payload = {};

    if (statusFilter && statusFilter !== 'all') {
      payload.status = statusFilter;
    }

    if (filters.verified && filters.verified !== 'all') {
      payload.verified = filters.verified === 'true';
    }

    const parseNumeric = (value) => {
      if (value === undefined || value === null) return null;
      const trimmed = value.toString().trim();
      if (trimmed === '') return null;
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const minViews = parseNumeric(filters.minViewCount);
    const maxViews = parseNumeric(filters.maxViewCount);
    if (minViews !== null || maxViews !== null) {
      const viewCountFilter = {};
      if (minViews !== null) viewCountFilter.$gte = minViews;
      if (maxViews !== null) viewCountFilter.$lte = maxViews;
      if (Object.keys(viewCountFilter).length > 0) {
        payload.viewCount = viewCountFilter;
      }
    }

    const propertyName = typeof filters.propertyName === 'string' ? filters.propertyName.trim() : '';
    if (propertyName) {
      payload.propertyName = `*${propertyName}*`;
    }

    const city = typeof filters.city === 'string' ? filters.city.trim() : '';
    if (city) {
      payload['location.city'] = `*${city}*`;
    }

    const unitType = typeof filters.unitType === 'string' ? filters.unitType.trim() : '';
    if (unitType) {
      payload['unitType.name'] = `*${unitType}*`;
    }

    return payload;
  }, [filters, statusFilter]);

  const hasActiveFilters = useMemo(() => {
    const { verified, minViewCount, maxViewCount, propertyName, city, unitType } = filters;
    const hasValue = (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return true;
    };

    const hasMinViews = hasValue(minViewCount);
    const hasMaxViews = hasValue(maxViewCount);
    const hasPropertyName = hasValue(propertyName);
    const hasCity = hasValue(city);
    const hasUnitType = hasValue(unitType);

    return (
      (statusFilter && statusFilter !== 'all') ||
      (verified && verified !== 'all') ||
      hasMinViews ||
      hasMaxViews ||
      hasPropertyName ||
      hasCity ||
      hasUnitType
    );
  }, [filters, statusFilter]);

  const profile = useSelector((state) => state.getProfileSlice?.data)
  // console.log("profile=========>>>>>>", profile)
  const resetSearch = () => {
    if (searchbarResetRef.current) {
      searchbarResetRef.current();
    }
  };

  useEffect(() => {
    setPage(0);
    resetSearch();
  }, [tableset]);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     await dispatch(getProfile());
  //   };

  //   fetchProfile();
  // }, [dispatch]);
  const { listings, loading, error } = useSelector(
    (state) => state.AllListingSlice
  );

  // console.log(listings, "listinggg");





  // useEffect(() => {
  //   if (!profile?.sub) return; // Wait until profile.sub is available

  //   const form = {
  //     "propertyManagerDetails.sub": { $eq: profile.sub },
  //     ...(searchParam && { search: `*${searchParam}*` }),
  //     page,
  //     limit: rowsPerPage,
  //   };

  //   dispatch(getSearchAlllisting(form));
  // }, [dispatch, profile?.sub, page, rowsPerPage, searchParam]);

  useEffect(() => {
    if (!profile?.sub) return; // Wait until profile is available

    const form = {
      // ...(profile?.custom_fields?.isLeanAdmin && {
      //   "propertyManagerDetails.sub": { $eq: profile.sub }
      // }),
      ...(profile?.custom_fields?.isLeanAdmin && !profile?.params?.Roles && {
        "propertyManagerDetails.sub": { $eq: profile.sub }
      }),
      ...(searchParam && { search: `*${searchParam}*` }),
      page,
      limit: rowsPerPage,
      ...(sortField ? { sortField, sortOrder } : {}),
      ...filterPayload,
    };

    dispatch(getSearchAlllisting(form));
  }, [dispatch, profile?.sub, profile?.custom_fields?.isLeanAdmin, page, rowsPerPage, searchParam, sortField, sortOrder, filterPayload]);


  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
    const reset = { ...FILTER_DEFAULTS };
    setFilters(reset);
    setFilterDraft(reset);
    setStatusFilter('all');
    setIsFilterDialogOpen(false);
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

  const refreshListings = () => {
    const form = {
      ...(profile?.custom_fields?.isLeanAdmin && !profile?.params?.Roles && {
        "propertyManagerDetails.sub": { $eq: profile.sub }
      }),
      ...(searchParam && { search: `*${searchParam}*` }),
      page,
      limit: rowsPerPage,
      ...(sortField ? { sortField, sortOrder } : {}),
      ...filterPayload,
    };
    dispatch(getSearchAlllisting(form));
  };

  return (
    <div className="listing-tour" style={{ backgroundColor: "#FAFAFA" }}>
      {/* <div style={{ backgroundColor: "#FAFAFA" }}> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          py: "1rem",
          width: "100%",
          padding: isMobile ? 1 : 2,
          gap: isMobile ? 2 : 0
        }}
      >
        {/* Left side - Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, newValue) => {
              if (newValue === null) return;
              setStatusFilter(newValue);
              setPage(0);
            }}
            sx={{
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 0,
                fontSize: isMobile ? 12 : 14,
                fontWeight: "bold",
                padding: isMobile ? "4px 12px" : "6px 16px",
                color: "#000",
                "&.Mui-selected": {
                  borderBottom: "3px solid black",
                  backgroundColor: "transparent",
                },
              },
              overflowX: 'auto',
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="active">Active</ToggleButton>
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="inactive">Inactive</ToggleButton>
            <ToggleButton value="draft">Draft</ToggleButton>
            <ToggleButton value="rejected">Rejected</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Right side - Add button */}
        <Box></Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          px: isMobile ? 1 : "1rem",
          gap: isMobile ? 2 : 0
        }}
      >
        {/* Left side - Search bar */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "100%" : "auto",
        }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchParam}
            onChange={handleSearch}
            sx={{
              width: isMobile ? "100%" : 200,
              borderRadius: 50,
              minWidth: isMobile ? "100%" : 200
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right side - Filters and Add button */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexDirection: isMobile ? "row" : "row",
          justifyContent: isMobile ? "space-between" : "flex-end",
          width: isMobile ? "100%" : "auto"
        }}>
          {/* Calendar Filter Icon */}
          {/* <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              width: 200,
              borderRadius: 50,
              "& input": { cursor: "pointer" }, // Make input clickable
            }}
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment position="end">
          //       <IconButton>
          //         <CalendarTodayIcon />
          //       </IconButton>
          //     </InputAdornment>
          //   ),
          // }}
          /> */}
          {/* Additional Filter Icon */}
          <IconButton
            title="Filters"
            color={hasActiveFilters ? 'primary' : 'default'}
            onClick={handleOpenFilterDialog}
          >
            <FilterListIcon />
          </IconButton>

          {/* Add Button */}
          <Box className="add-button-tour">
            <AddButton
              onClick={() => navigate("/web/admin/home/add-listing")}
              bgColor="#5CBA47"
              textColor="#1C1C1C"
              startIcon={<AddIcon />}
              isMobile={isMobile}
            >
              <span>+</span> {isSmallMobile ? "Add" : "Add"}
            </AddButton>
          </Box>
        </Box>
      </Box>

      {!loading ? (
        <Box sx={{ p: isMobile ? 1 : 2 }}> {/* pr = padding right */}
          <Ctable
            tableHead={tableHead}
            rowData={listings?.body}
            pagination={listings?.pagination}
            setRowsPerPage={setRowsPerPage}
            setPage={setPage}
            fordispatch={refreshListings}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      )}


      <Dialog open={isFilterDialogOpen} onClose={handleCloseFilterDialog} fullWidth maxWidth="sm">
        <DialogTitle>Filter Listings</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-verified-label">Verification</InputLabel>
              <Select
                labelId="filter-verified-label"
                label="Verification"
                value={filterDraft.verified}
                onChange={handleFilterDraftChange('verified')}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Verified</MenuItem>
                <MenuItem value="false">Not Verified</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Property Name"
              size="small"
              value={filterDraft.propertyName}
              onChange={handleFilterDraftChange('propertyName')}
              placeholder="e.g. Downtown Apartments"
            />

            <TextField
              label="Unit Type"
              size="small"
              value={filterDraft.unitType}
              onChange={handleFilterDraftChange('unitType')}
              placeholder="e.g. Studio"
            />

            <TextField
              label="City"
              size="small"
              value={filterDraft.city}
              onChange={handleFilterDraftChange('city')}
              placeholder="e.g. New York"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Min View Count"
                type="number"
                size="small"
                value={filterDraft.minViewCount}
                onChange={handleFilterDraftChange('minViewCount')}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max View Count"
                type="number"
                size="small"
                value={filterDraft.maxViewCount}
                onChange={handleFilterDraftChange('maxViewCount')}
                inputProps={{ min: 0 }}
              />
            </Stack>
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

      {error && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "error.main",
            mt: 2,
          }}
        >
          {error}
        </Box>
      )}
    </div>
  );
};

export default Listing;

