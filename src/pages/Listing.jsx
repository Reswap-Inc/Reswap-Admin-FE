import React, { useEffect, useRef, useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getListingThunk, getSearchAlllisting } from "../network/ListingThunk";
import { getProfile } from "../network/Authapi";

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
  const [status, setStatus] = useState("active");
  const searchbarResetRef = useRef(null);
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
    };

    dispatch(getSearchAlllisting(form));
  }, [dispatch, profile?.sub, profile?.custom_fields?.isLeanAdmin, page, rowsPerPage, searchParam, sortField, sortOrder]);


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

  const handleSort = (field) => {
    if (!field) return;
    setPage(0);
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };

  // Add this function to refresh listings
  const refreshListings = () => {
    const form = {
      ...(profile?.custom_fields?.isLeanAdmin && !profile?.params?.Roles && {
        "propertyManagerDetails.sub": { $eq: profile.sub }
      }),
      ...(searchParam && { search: `*${searchParam}*` }),
      page,
      limit: rowsPerPage,
      ...(sortField ? { sortField, sortOrder } : {}),
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
            value={status}
            exclusive
            onChange={(_, newValue) => newValue && setStatus(newValue)}
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
            }}
          >
            <ToggleButton value="active">Active</ToggleButton>
            {/* <ToggleButton value="archive">Archive</ToggleButton> */}
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
          <IconButton title="comming soon">
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
