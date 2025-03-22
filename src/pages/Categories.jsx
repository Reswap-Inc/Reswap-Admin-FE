

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
  TextField, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflowY: "auto",
  maxHeight: "95vh",
};

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
const categories = [
  {
    customerId: "CUST001",
    customerName: "John Doe",
    productsListed: 15,
    productDelivered: 12,
    complaintRaised: 1,
    totalEarnings: "$1,200",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST002",
    customerName: "Jane Smith",
    productsListed: 20,
    productDelivered: 18,
    complaintRaised: 0,
    totalEarnings: "$1,800",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST003",
    customerName: "Alice Johnson",
    productsListed: 12,
    productDelivered: 10,
    complaintRaised: 2,
    totalEarnings: "$950",
    status: "Inactive",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST004",
    customerName: "Bob Williams",
    productsListed: 25,
    productDelivered: 22,
    complaintRaised: 1,
    totalEarnings: "$2,500",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST005",
    customerName: "Charlie Brown",
    productsListed: 30,
    productDelivered: 28,
    complaintRaised: 0,
    totalEarnings: "$3,200",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST006",
    customerName: "David Miller",
    productsListed: 18,
    productDelivered: 15,
    complaintRaised: 3,
    totalEarnings: "$1,600",
    status: "Inactive",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST007",
    customerName: "Emma Davis",
    productsListed: 22,
    productDelivered: 19,
    complaintRaised: 1,
    totalEarnings: "$2,100",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST008",
    customerName: "Frank Wilson",
    productsListed: 16,
    productDelivered: 14,
    complaintRaised: 0,
    totalEarnings: "$1,450",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST009",
    customerName: "Grace Lee",
    productsListed: 21,
    productDelivered: 20,
    complaintRaised: 1,
    totalEarnings: "$2,000",
    status: "Active",
    actions: "View | Edit | Delete",
  },
  {
    customerId: "CUST010",
    customerName: "Henry Moore",
    productsListed: 14,
    productDelivered: 12,
    complaintRaised: 2,
    totalEarnings: "$1,100",
    status: "Inactive",
    actions: "View | Edit | Delete",
  },
];
const Categories = () => {
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


    const [selectedDate, setSelectedDate] = useState("");
  
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };
  return (
    <div>
        <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "1rem",
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
      <ToggleButton value="archive">Archive</ToggleButton>
    </ToggleButtonGroup>
        </Box>

        {/* Right side - Add button */}
        <Box>
          
        </Box>
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
          sx={{ width: 200 ,borderRadius:50}}
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
        <TextField
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
      />
        {/* Additional Filter Icon */}
        <IconButton>
          <FilterListIcon />
        </IconButton>

        {/* Add Button */}
        <AddButton
          onClick={() => navigate("/addform")}
          bgColor="#5CBA47"
          textColor="#1C1C1C"
          startIcon={<AddIcon />}
        >
          <span>+</span> Add
        </AddButton>
      </Box>
    </Box>
      <Ctable tableHead={tableHead}
              rowData={categories} />
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default Categories;
