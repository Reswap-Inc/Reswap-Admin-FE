import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  FormHelperText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { USER_REGISTER, GET_GENDER_OPTIONS, GET_LOCATION_FROM_ZIP, VALIDATE_ADDRESS } from "../redux/endpoint";
const { Country, State } = require("country-state-city");

// Custom styled components
const GradientBox = styled(Box)({
  background: "#ffffff",
  minHeight: "100vh",
  padding: "2rem",
  color: "#333",
});

const FormCard = styled(Paper)({
  background: "#ffffff",
  borderRadius: "16px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  margin: "1rem auto",
  maxWidth: "900px",
});

const AddressBox = styled(Box)(({ isInput }) => ({
  padding: "1rem",
  borderRadius: "8px",
  backgroundColor: isInput ? "#f5f5f5" : "#e3f2fd",
  border: `2px solid ${isInput ? "#ddd" : "#2196f3"}`,
  marginBottom: "1rem",
}));

export default function AddUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingZip, setIsLoadingZip] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [genderOptions, setGenderOptions] = useState([]);
  
  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);

  // Address validation modal state
  const [addressValidationModal, setAddressValidationModal] = useState({
    open: false,
    input: null,
    validated: null,
    suggestion: null,
  });

  const [formData, setFormData] = useState({
    familyName: "",
    givenName: "",
    email: "",
    phoneNumber: {
      country_code: "",
      number: "",
    },
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    gender: "",
    preferredUsername: "",
    dateOfBirth: "",
  });

  // Fetch gender options
  useEffect(() => {
    const fetchGenderOptions = async () => {
      try {
        const response = await axios.get(GET_GENDER_OPTIONS, {
          withCredentials: true,
        });
        if (response.data?.body?.items) {
          setGenderOptions(response.data.body.items);
        }
      } catch (error) {
        console.error("Failed to fetch gender options:", error);
      }
    };
    fetchGenderOptions();
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
      // Don't reset state and city if they're already populated from ZIP
      if (!formData.zip) {
        setFormData((prev) => ({ ...prev, state: "", city: "" }));
      }
    }
  }, [formData.country]);

  // Handle ZIP code change and auto-populate location
  const handleZipChange = async (event) => {
    const zipCode = event.target.value;
    setFormData((prev) => ({ ...prev, zip: zipCode }));
    setErrors((prev) => ({ ...prev, zip: null }));

    // Only fetch if ZIP is valid length (5+ digits)
    if (zipCode && zipCode.length >= 5) {
      setIsLoadingZip(true);
      try {
        const response = await axios.get(
          `${GET_LOCATION_FROM_ZIP}=${zipCode}`,
          { withCredentials: true }
        );

        if (response.data?.status?.code === 200 && response.data?.body?.found) {
          const locationData = response.data.body;
          
          // Update form with location data
          setFormData((prev) => ({
            ...prev,
            country: locationData.country?.iso2 || prev.country,
            state: locationData.state?.name || prev.state,
            city: locationData.city?.name || prev.city,
          }));

          // Update states dropdown
          if (locationData.country?.iso2) {
            const countryStates = State.getStatesOfCountry(locationData.country.iso2);
            setStates(countryStates);
          }

          toast.success("Location auto-filled from ZIP code!");
        } else if (response.data?.body?.found === false) {
          toast.warning("ZIP code not found. Please enter location manually.");
        }
      } catch (error) {
        console.error("Failed to fetch location from ZIP:", error);
        // Don't show error toast as user might still be typing
      } finally {
        setIsLoadingZip(false);
      }
    }
  };

  // Validate address when street field loses focus
  const handleStreetBlur = async () => {
    // Only validate if we have minimum required fields
    if (!formData.street || !formData.city || !formData.state || !formData.zip) {
      return;
    }

    setIsValidatingAddress(true);
    try {
      // Get state code for validation
      const stateObj = states.find(s => s.name === formData.state);
      const stateCode = stateObj?.isoCode || formData.state;

      const addressData = {
        address1: formData.street,
        address2: "",
        city: formData.city,
        state: stateCode,
        zip: formData.zip,
      };

      const response = await axios.post(VALIDATE_ADDRESS, addressData, {
        withCredentials: true,
      });

      if (response.data?.status?.code === 200) {
        const body = response.data.body;
        
        // If address is valid but modified or has suggestions
        if (body.modified || body.suggestion) {
          setAddressValidationModal({
            open: true,
            input: body.input,
            validated: body.validated,
            suggestion: body.suggestion,
          });
        } else if (body.valid) {
          toast.success("Address validated successfully!");
        }
      }
    } catch (error) {
      console.error("Failed to validate address:", error);
      // Don't show error for validation failures - address might still work
    } finally {
      setIsValidatingAddress(false);
    }
  };

  const handleUseSuggestedAddress = () => {
    const { validated } = addressValidationModal;
    if (validated) {
      setFormData((prev) => ({
        ...prev,
        street: validated.address1,
        city: validated.city,
        zip: validated.zip,
      }));
      toast.success("Address updated with validated format!");
    }
    setAddressValidationModal({ open: false, input: null, validated: null, suggestion: null });
  };

  const handleKeepOriginalAddress = () => {
    setAddressValidationModal({ open: false, input: null, validated: null, suggestion: null });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.familyName?.trim()) newErrors.familyName = "Last name is required";
    if (!formData.givenName?.trim()) newErrors.givenName = "First name is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.country_code) newErrors["phoneNumber.country_code"] = "Country code is required";
    if (!formData.phoneNumber.number?.trim()) newErrors["phoneNumber.number"] = "Phone number is required";
    if (!formData.street?.trim()) newErrors.street = "Street address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.country?.trim()) newErrors.country = "Country is required";
    if (!formData.zip?.trim()) newErrors.zip = "ZIP code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(USER_REGISTER, formData, {
        withCredentials: true,
      });

      if (response.data?.status?.code === 200) {
        toast.success("User created successfully!");
        navigate("/web/admin/users");
      } else {
        throw new Error(response.data?.status?.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data?.status?.message || error.message || "Failed to create user";
      toast.error(errorMessage);
      
      // Handle field-specific errors if provided
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBox>
      <FormCard>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Add New User
        </Typography>

        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="First Name"
              value={formData.givenName}
              onChange={handleChange("givenName")}
              error={!!errors.givenName}
              helperText={errors.givenName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Last Name"
              value={formData.familyName}
              onChange={handleChange("familyName")}
              error={!!errors.familyName}
              helperText={errors.familyName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preferred Username"
              value={formData.preferredUsername}
              onChange={handleChange("preferredUsername")}
              error={!!errors.preferredUsername}
              helperText={errors.preferredUsername}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleChange("gender")}
                label="Gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Country Code"
              placeholder="+1"
              value={formData.phoneNumber.country_code}
              onChange={handleChange("phoneNumber.country_code")}
              error={!!errors["phoneNumber.country_code"]}
              helperText={errors["phoneNumber.country_code"]}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              required
              label="Phone Number"
              value={formData.phoneNumber.number}
              onChange={handleChange("phoneNumber.number")}
              error={!!errors["phoneNumber.number"]}
              helperText={errors["phoneNumber.number"]}
            />
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Address
            </Typography>
          </Grid>

          {/* ZIP Code - First Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="ZIP / Postal Code"
              value={formData.zip}
              onChange={handleZipChange}
              error={!!errors.zip}
              helperText={errors.zip || "Enter ZIP to auto-fill location"}
              InputProps={{
                endAdornment: isLoadingZip && <CircularProgress size={20} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Street Address"
              value={formData.street}
              onChange={handleChange("street")}
              onBlur={handleStreetBlur}
              error={!!errors.street}
              helperText={errors.street || "Address will be validated automatically"}
              InputProps={{
                endAdornment: isValidatingAddress && <CircularProgress size={20} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.country}
                onChange={handleChange("country")}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.state} disabled={!formData.country}>
              <InputLabel>State</InputLabel>
              <Select
                value={formData.state}
                onChange={handleChange("state")}
                label="State"
              >
                {states.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="City"
              value={formData.city}
              onChange={handleChange("city")}
              error={!!errors.city}
              helperText={errors.city}
              disabled={!formData.country}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/web/admin/users")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Create User"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormCard>

      {/* Address Validation Modal */}
      <Dialog
        open={addressValidationModal.open}
        onClose={handleKeepOriginalAddress}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Address Validation</Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            We found a standardized format for your address. Would you like to use it?
          </Alert>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Your Input:
          </Typography>
          <AddressBox isInput>
            <Typography variant="body2">
              {addressValidationModal.input?.address1}
              {addressValidationModal.input?.address2 && <>, {addressValidationModal.input.address2}</>}
            </Typography>
            <Typography variant="body2">
              {addressValidationModal.input?.city}, {addressValidationModal.input?.state} {addressValidationModal.input?.zip}
            </Typography>
          </AddressBox>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
            Validated Format:
            <Chip label="Recommended" color="primary" size="small" />
          </Typography>
          <AddressBox isInput={false}>
            <Typography variant="body2">
              {addressValidationModal.validated?.address1}
              {addressValidationModal.validated?.address2 && <>, {addressValidationModal.validated.address2}</>}
            </Typography>
            <Typography variant="body2">
              {addressValidationModal.validated?.city}, {addressValidationModal.validated?.state} {addressValidationModal.validated?.zip}
              {addressValidationModal.validated?.zip4 && `-${addressValidationModal.validated.zip4}`}
            </Typography>
          </AddressBox>

          {addressValidationModal.suggestion && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Alternative Suggestion:
              </Typography>
              <AddressBox isInput={false}>
                <Typography variant="body2">{addressValidationModal.suggestion}</Typography>
              </AddressBox>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleKeepOriginalAddress} color="inherit">
            Keep My Address
          </Button>
          <Button onClick={handleUseSuggestedAddress} variant="contained" color="primary">
            Use Validated Format
          </Button>
        </DialogActions>
      </Dialog>
    </GradientBox>
  );
}
