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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getListingThunk, getSearchAlllisting } from "../network/ListingThunk";

const tableHead = [
  { name: "Listing ID" },
  { name: "Title" },
  { name: "Property Name" },
  { name: "Unit Type" },
  { name: "Location" },
  { name: "View Count" },
  { name: "Verified" },
  { name: "Status" },
  // { name: "Actions" },
];

const Listing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableset, settable] = useState("categories");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParam, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [status, setStatus] = useState("active");
  const searchbarResetRef = useRef(null);
  const resetSearch = () => {
    if (searchbarResetRef.current) {
      searchbarResetRef.current();
    }
  };

  useEffect(() => {
    setPage(0);
    resetSearch();
  }, [tableset]);

  const { listings, loading, error } = useSelector(
    (state) => state.AllListingSlice
  );

  console.log(listings, "listinggg");

  const form = {
    // currentLocation: {
    //   lat: 34.0422,
    //   lng: -118.2337,
    // }, // Used for distance calculation, not filtering

    // "location.coordinates.lat": {
    //   $gte: 34,
    //   $lte: 34.0622,
    // }, // Numeric filter
    // "location.coordinates.lng": {
    //   $gte: -118.2337,
    //   $lte: -118.2537,
    // }, // Numeric filter

    // listingId: "LIST100078",
    // itemType: "rent", // Categorical filter
    search: `*${searchParam}*`, // Search filter
    // postedBy: "RUSC0001", // Filter for listings posted by a specific user

    // sortField: "distance.distance", // Sorting field
    // sortOrder: "asc", // Sort order
    page: page, // Pagination
    limit: rowsPerPage,
  };

  useEffect(() => {
    dispatch(getSearchAlllisting(form));
  }, [dispatch, page, rowsPerPage, searchParam]);

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

  return (
    <div style={{ backgroundColor: "#FAF9F6" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "1rem",
          width:"98%"
        }}
      >
        {/* Left side - Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
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
                fontSize: 14,
                fontWeight: "bold",
                padding: "6px 16px",
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
          justifyContent: "space-between",
          alignItems: "center",
          py: "1rem",
        }}
      >
        {/* Left side - Search bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </Box>

        {/* Right side - Filters and Add button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <AddButton
            onClick={() => navigate("/reswap/web/admin/listings/add-listing")}
            bgColor="#5CBA47"
            textColor="#1C1C1C"
            startIcon={<AddIcon />}
          >
            <span>+</span> Add
          </AddButton>
        </Box>
      </Box>
      {!loading ? (
        <Ctable
          tableHead={tableHead}
          rowData={listings?.body}
          pagination={listings?.pagination}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          fordispatch={setSearchQuery}
        />
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
