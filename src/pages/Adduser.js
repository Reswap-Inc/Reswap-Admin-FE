import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  FormGroup,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { dividerClasses } from "@mui/material/Divider";

const AddUser = () => {
  const [open, setOpen] = useState(false);
  const handleClose=()=>setOpen(false)
  const [formData, setFormData] = useState({
    email: "",
    employeeName: "",
    designation: "",
    mobileNumber: "",
    joiningDate: null,
    permissions: {},
  });

  const permissionsList = [
    "Permission 1",
    "Permission 2",
    "Permission 3",
    "Permission 4",
    "Permission 5",
    "Permission 6",
    "Permission 7",
    "Permission 8",
    "Permission 9",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [perm]: !prev.permissions[perm],
      },
    }));
  };

  return (
    <div>
      <Card sx={{ maxWidth: "100%", margin: "auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email ID"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee Name"
              value={formData.employeeName}
              onChange={(e) => handleChange("employeeName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Designation"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneInput
              country={"us"}
              value={formData.mobileNumber}
              onChange={(value) => handleChange("mobileNumber", value)}
              inputStyle={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email ID"
              value={formData.email}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Joining Date"
                value={formData.joiningDate}
                onChange={(newValue) => handleChange("joiningDate", newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="subtitle1">Select Permissions</Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label="Select all"
              onChange={() => {
                const allSelected = Object.keys(formData.permissions).length !== permissionsList.length;
                setFormData((prev) => ({
                  ...prev,
                  permissions: Object.fromEntries(
                    permissionsList.map((perm) => [perm, allSelected])
                  ),
                }));
              }}
            />
           <Box sx={{}}> {permissionsList.map((perm) => (
              <FormControlLabel
                key={perm}
                control={<Checkbox checked={!!formData.permissions[perm]} onChange={() => handlePermissionChange(perm)} />}
                label={perm}
              />
            ))}</Box>
          </FormGroup>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={()=>setOpen(true)}>
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
      <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: "16px",
        textAlign: "center",
        padding: "20px",
      },
    }}
  >
    {/* Close Button */}
    <IconButton
      sx={{ position: "absolute", top: 10, right: 10 }}
      onClick={handleClose}
    >
      <CloseIcon />
    </IconButton>

    {/* Popup Content */}
    <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "black" }} />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
        Your changes have been saved successfully
      </Typography>
    </DialogContent>

    {/* Okay Button */}
    <DialogActions sx={{ justifyContent: "center" }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
          padding: "8px 24px",
          borderRadius: "24px",
          "&:hover": { backgroundColor: "#333" },
        }}
        onClick={handleClose}
      >
        Okay
      </Button>
    </DialogActions>
  </Dialog></div>
    
  );
};

export default AddUser;
