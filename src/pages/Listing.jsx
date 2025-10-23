import React, { useEffect, useMemo, useState } from "react";
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
  Typography,
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
import { getConfiguration } from "../network/generalApi";

const FILTER_DEFAULTS = {
  ownedBy: '',
  updatedWithin: 'any',
  listingType: 'all',
  unitType: 'all',
  propertyType: 'all',
  furniturePresent: 'any',
  petsPresent: 'any',
  minRent: '',
  maxRent: '',
  availabilityStart: '',
  availabilityEnd: '',
  unitImages: 'any',
  hasCurrentResidents: 'any',
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

  const [searchParam, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState('all');
  const [filters, setFilters] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [filterDraft, setFilterDraft] = useState(() => ({ ...FILTER_DEFAULTS }));
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const listingTypeOptions = useMemo(
    () => ([
      { id: 'unit', name: 'Unit' },
      { id: 'room', name: 'Room' },
    ]),
    []
  );
  const [unitTypeOptions, setUnitTypeOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  useEffect(() => {
    let cancelled = false;
    const hydrateConfigs = async () => {
      try {
        const [unitRes, propertyRes] = await Promise.all([
          getConfiguration("unitType"),
          getConfiguration("propertyType"),
        ]);
        if (cancelled) return;
        setUnitTypeOptions(unitRes?.body?.items ?? []);
        setPropertyTypeOptions(propertyRes?.body?.items ?? []);
      } catch (err) {
        console.error("Failed to load configuration options:", err);
      }
    };
    hydrateConfigs();
    return () => {
      cancelled = true;
    };
  }, []);


  const profileState = useSelector((state) => state.getProfileSlice);
  const profile = profileState?.data;
  const profileSub = profile?.sub;
  const isSuperAdmin = Boolean(profile?.params?.Roles);
  const isAdminUser = profile?.userType === 'admin';
  const isScopedAdmin = isAdminUser && !isSuperAdmin && Boolean(profileSub);

  const { listings, loading, error } = useSelector(
    (state) => state.AllListingSlice
  );
  const propertyManagerOptions = useMemo(() => {
    if (!isSuperAdmin) return [];
    const map = new Map();
    const source = listings?.body ?? [];
    source.forEach((listing) => {
      const managerSub = listing?.propertyManagerDetails?.sub || listing?.ownerUserId;
      if (!managerSub) return;
      const managerUser = listing?.propertyManagerDetails?.user || listing?.ownerUser;
      const displayName =
        managerUser?.given_name ||
        managerUser?.preferred_username ||
        managerUser?.name ||
        managerSub;
      if (!map.has(managerSub)) {
        map.set(managerSub, displayName);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [isSuperAdmin, listings]);
  const filterPayload = useMemo(() => {
    const payload = {};

    if (statusFilter && statusFilter !== 'all') {
      payload.status = statusFilter;
    }

    if (isSuperAdmin && filters.ownedBy) {
      payload['propertyManagerDetails.sub'] = { $eq: filters.ownedBy };
    }

    if (filters.updatedWithin && filters.updatedWithin !== 'any') {
      const days = Number(filters.updatedWithin);
      if (!Number.isNaN(days) && days > 0) {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        payload.updatedAt = { $gte: cutoff };
      }
    }

    if (filters.listingType && filters.listingType !== 'all') {
      payload.listingType = filters.listingType;
    }

    if (filters.unitType && filters.unitType !== 'all' && filters.unitType) {
      payload.unitType = filters.unitType;
    }

    if (filters.propertyType && filters.propertyType !== 'all' && filters.propertyType) {
      payload.propertyType = filters.propertyType;
    }

    const applyLengthFilter = (key, mode) => {
      if (mode === 'with') {
        payload[key] = { $gt: 0 };
      } else if (mode === 'without') {
        payload[key] = { $eq: 0 };
      }
    };

    applyLengthFilter('furniture.length', filters.furniturePresent);
    applyLengthFilter('petsPresent.length', filters.petsPresent);
    applyLengthFilter('unitImages.length', filters.unitImages);
    applyLengthFilter('currentResidents.length', filters.hasCurrentResidents);

    const rentFilter = {};
    const minRent = Number(filters.minRent);
    if (!Number.isNaN(minRent) && filters.minRent !== '') {
      rentFilter.$gte = minRent;
    }
    const maxRent = Number(filters.maxRent);
    if (!Number.isNaN(maxRent) && filters.maxRent !== '') {
      rentFilter.$lte = maxRent;
    }
    if (Object.keys(rentFilter).length > 0) {
      payload['price.rent.amount'] = rentFilter;
    }

    if (filters.availabilityStart) {
      const isoStart = new Date(filters.availabilityStart).toISOString();
      payload['availability.startDate'] = {
        ...(payload['availability.startDate'] || {}),
        $gte: isoStart,
      };
    }

    if (filters.availabilityEnd) {
      const isoEnd = new Date(filters.availabilityEnd).toISOString();
      payload['availability.endDate'] = {
        ...(payload['availability.endDate'] || {}),
        $lte: isoEnd,
      };
    }

    return payload;
  }, [filters, isSuperAdmin, statusFilter]);
  const hasActiveFilters = useMemo(() => {
    if (statusFilter && statusFilter !== 'all') return true;
    if (isSuperAdmin && filters.ownedBy) return true;
    if (filters.updatedWithin && filters.updatedWithin !== 'any') return true;
    if (filters.listingType && filters.listingType !== 'all') return true;
    if (filters.unitType && filters.unitType !== 'all' && filters.unitType) return true;
    if (filters.propertyType && filters.propertyType !== 'all' && filters.propertyType) return true;
    if (['with', 'without'].includes(filters.furniturePresent)) return true;
    if (['with', 'without'].includes(filters.petsPresent)) return true;
    if (['with', 'without'].includes(filters.unitImages)) return true;
    if (['with', 'without'].includes(filters.hasCurrentResidents)) return true;
    if (filters.minRent !== '' || filters.maxRent !== '') return true;
    if (filters.availabilityStart || filters.availabilityEnd) return true;
    return false;
  }, [filters, isSuperAdmin, statusFilter]);





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
    if (!profile || Array.isArray(profile)) return; // wait for profile load
    if (isScopedAdmin && !profileSub) return;

    const form = {
      ...(isScopedAdmin ? {
        "propertyManagerDetails.sub": { $eq: profileSub }
      } : {}),
      ...(searchParam && { search: `*${searchParam}*` }),
      page,
      limit: rowsPerPage,
      ...(sortField ? { sortField, sortOrder } : {}),
      ...filterPayload,
    };

    dispatch(getSearchAlllisting(form));
  }, [dispatch, profile, profileSub, isScopedAdmin, page, rowsPerPage, searchParam, sortField, sortOrder, filterPayload]);


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
    if (!profile || Array.isArray(profile)) return;
    if (isScopedAdmin && !profileSub) return;
    const form = {
      ...(isScopedAdmin ? {
        "propertyManagerDetails.sub": { $eq: profileSub }
      } : {}),
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
          <Stack spacing={3}>
            {isSuperAdmin && (
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ownership
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel id="filter-owned-by-label">Owned By</InputLabel>
                  <Select
                    labelId="filter-owned-by-label"
                    label="Owned By"
                    value={filterDraft.ownedBy}
                    onChange={handleFilterDraftChange('ownedBy')}
                  >
                    <MenuItem value="">All</MenuItem>
                    {propertyManagerOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label} ({option.value})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Recency
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-updated-label">Recently Updated</InputLabel>
                <Select
                  labelId="filter-updated-label"
                  label="Recently Updated"
                  value={filterDraft.updatedWithin}
                  onChange={handleFilterDraftChange('updatedWithin')}
                >
                  <MenuItem value="any">Any time</MenuItem>
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Listing Details
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-listing-type-label">Listing Type</InputLabel>
                <Select
                  labelId="filter-listing-type-label"
                  label="Listing Type"
                  value={filterDraft.listingType}
                  onChange={handleFilterDraftChange('listingType')}
                >
                  <MenuItem value="all">All</MenuItem>
                  {listingTypeOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-unit-type-label">Unit Type</InputLabel>
                <Select
                  labelId="filter-unit-type-label"
                  label="Unit Type"
                  value={filterDraft.unitType}
                  onChange={handleFilterDraftChange('unitType')}
                >
                  <MenuItem value="all">All</MenuItem>
                  {unitTypeOptions.map((option) => {
                    const optionLabel = option.name || option.label || option.id;
                    return (
                      <MenuItem key={option.id} value={option.id}>
                        {optionLabel}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-property-type-label">Property Type</InputLabel>
                <Select
                  labelId="filter-property-type-label"
                  label="Property Type"
                  value={filterDraft.propertyType}
                  onChange={handleFilterDraftChange('propertyType')}
                >
                  <MenuItem value="all">All</MenuItem>
                  {propertyTypeOptions.map((option) => {
                    const optionLabel = option.name || option.label || option.id;
                    return (
                      <MenuItem key={option.id} value={option.id}>
                        {optionLabel}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Pricing
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Min Rent"
                  type="number"
                  size="small"
                  value={filterDraft.minRent}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === '' || Number(value) >= 0) {
                      setFilterDraft((prev) => ({ ...prev, minRent: value }));
                    }
                  }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Max Rent"
                  type="number"
                  size="small"
                  value={filterDraft.maxRent}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === '' || Number(value) >= 0) {
                      setFilterDraft((prev) => ({ ...prev, maxRent: value }));
                    }
                  }}
                  inputProps={{ min: 0 }}
                />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Availability
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Available From"
                  type="date"
                  size="small"
                  value={filterDraft.availabilityStart}
                  onChange={handleFilterDraftChange('availabilityStart')}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Available Until"
                  type="date"
                  size="small"
                  value={filterDraft.availabilityEnd}
                  onChange={handleFilterDraftChange('availabilityEnd')}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Content & Occupancy
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-furniture-present-label">Furniture Present</InputLabel>
                <Select
                  labelId="filter-furniture-present-label"
                  label="Furniture Present"
                  value={filterDraft.furniturePresent}
                  onChange={handleFilterDraftChange('furniturePresent')}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="with">With furniture details</MenuItem>
                  <MenuItem value="without">Without furniture details</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-pets-present-label">Pets Present</InputLabel>
                <Select
                  labelId="filter-pets-present-label"
                  label="Pets Present"
                  value={filterDraft.petsPresent}
                  onChange={handleFilterDraftChange('petsPresent')}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="with">Pets recorded</MenuItem>
                  <MenuItem value="without">No pets recorded</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-unit-images-label">Unit Images</InputLabel>
                <Select
                  labelId="filter-unit-images-label"
                  label="Unit Images"
                  value={filterDraft.unitImages}
                  onChange={handleFilterDraftChange('unitImages')}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="with">With unit images</MenuItem>
                  <MenuItem value="without">Without unit images</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-current-residents-label">Current Residents</InputLabel>
                <Select
                  labelId="filter-current-residents-label"
                  label="Current Residents"
                  value={filterDraft.hasCurrentResidents}
                  onChange={handleFilterDraftChange('hasCurrentResidents')}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="with">Residents recorded</MenuItem>
                  <MenuItem value="without">No residents recorded</MenuItem>
                </Select>
              </FormControl>
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

