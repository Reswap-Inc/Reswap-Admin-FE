import React from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  Modal,
  Dialog,
  Grid2,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AddPhotoAlternate as AddPhotoAlternateIcon } from "@mui/icons-material";
import { useState } from "react";
import { AddListingValidationSchema } from "../utils/validationSchemas";
import { addListingFunction } from "../network/ListingThunk";
const { Country, State, City } = require("country-state-city");

// Custom styled components
const GradientBox = styled(Box)({
  background: "#ffffff",
  minHeight: "100vh",
  padding: "2rem",
  color: "#333",
});

const FormCard = styled(Box)({
  background: "#ffffff",
  borderRadius: "16px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  margin: "1rem auto",
  width: "100%",
});

const furnishingItems = [
  "Bed",
  "Wardrobe",
  "Study Table",
  "Chair",
  "Fan",
  "AC",
  "TV",
  "Refrigerator",
  "Washing Machine",
  "Sofa",
];

const PropertyType = [
  "Apartment",
  "Independent House/ Villa",
  "Shared Room",
  "Private Room with Shared Bathroom",
  "Private Room with Private Bathroom",
];

const UnitType = ["1BHK", "2BHK", "3BHK", "4BHK"];

const initialState = {
  title: "",
  description: "",
  address1: "",
  address2: "",
  city: "",
  zip: "",
  countryCode: "us",
  rentAmount: "",
  depositAmount: "",
  propertyType: "",
  unitType: "",
  feesAmount: "",
  petsAllowed: [],
  petsPresent: [],
  roomatePreferences: [],
  foodPreferences: [],
  configurationHouse: {
    bedrooms: 1,
    bathrooms: 1,
    kitchen: 1,
    balcony: 1,
  },
  ammenitiesIncluded: {
    onsiteLaundry: false,
    attachedBalcony: false,
    water: false,
    sweage: false,
    trash: false,
    electricity: false,
    wifi: false,
    landscaping: false,
    pool: false,
    gym: false,
    commonStudyArea: false,
  },
  belongingsIncluded: false,
  comesWithFurniture: false,
  furnitureDetails: {
    // Will be populated dynamically
  },
  furnitureImages: [],
  unitImages: [],
  isOwnedByPropertyManager: false,
  availability: {
    startDate: "", // YYYYMMDD
    endDate: "", // YYYYMMDD
    flexible: false,
  },
  roomateDetails: [
    {
      countryCode: "+1",
      phoneNumber: "",
    },
  ],
};

export default function AddListing() {
  const [formData, setFormData] = React.useState(initialState);
  const [furnitureImages, setFurnitureImages] = useState(Array(3).fill(null));
  const [unitImages, setUnitImages] = useState(Array(3).fill(null));
  const [openFurnishingModal, setOpenFurnishingModal] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const countries = Country.getAllCountries();
  const handleImageUploadfur = (event, index, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "furniture") {
          const newImages = [...furnitureImages];
          newImages[index] = reader.result; // Store base64 string
          setFurnitureImages(newImages);
          // Also update formData
          setFormData((prev) => ({
            ...prev,
            furnitureImages: newImages.filter((img) => img !== null),
          }));
        } else {
          const newImages = [...unitImages];
          newImages[index] = reader.result; // Store base64 string
          setUnitImages(newImages);
          // Also update formData
          setFormData((prev) => ({
            ...prev,
            unitImages: newImages.filter((img) => img !== null),
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index, type) => {
    if (type === "furniture") {
      const newImages = [...furnitureImages];
      newImages[index] = null;
      setFurnitureImages(newImages);
      // Update formData
      setFormData((prev) => ({
        ...prev,
        furnitureImages: newImages.filter((img) => img !== null),
      }));
    } else {
      const newImages = [...unitImages];
      newImages[index] = null;
      setUnitImages(newImages);
      // Update formData
      setFormData((prev) => ({
        ...prev,
        unitImages: newImages.filter((img) => img !== null),
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nameParts = name.split(".");

    if (nameParts.length === 1) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    }
  };

  const states = formData.country
    ? State.getStatesOfCountry(formData.countryIsoCode)
    : [];

  const cities = formData.state
    ? City.getCitiesOfState(formData.countryIsoCode, formData.stateIsoCode) || [
        { name: formData.state },
      ]
    : [];

  // If no cities are available, use the state name
  if (!cities.length && formData.state) {
    cities.push({ name: formData.state });
  }

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    const selectedCountry = countries.find(
      (country) => country.isoCode === selectedCountryCode
    );

    if (selectedCountry) {
      setFormData((prevFormData) => ({
        ...prevFormData,

        country: selectedCountry.name,
        countryIsoCode: selectedCountry.isoCode,
        state: "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        country: "",
        state: "",
      }));
    }
  };

  const handleStateChange = (event) => {
    const selectedStateCode = event.target.value;
    const selectedState = states.find(
      (state) => state.isoCode === selectedStateCode
    );

    if (selectedState) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        state: selectedState.name,
        stateIsoCode: selectedState.isoCode,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,

        state: "",
      }));
    }
  };

  const handlePropertyTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      propertyType: type,
    }));
  };
  const handleUnitTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      unitType: type,
    }));
  };

  const handleFurnishingChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      furnishing: event.target.value,
    }));
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      items: {},
    }));
  };

  const handleQuantityChange = (item, change) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: Math.max(0, (prev.items[item] || 0) + change),
      },
    }));
  };

  const handleAmmenityChange = (ammenity) => {
    setFormData((prev) => ({
      ...prev,
      ammenitiesIncluded: {
        ...prev.ammenitiesIncluded,
        [ammenity]: !prev.ammenitiesIncluded[ammenity],
      },
    }));
  };

  const handleDateChange = (field, value) => {
    const formattedDate = value ? value.replace(/-/g, "") : "";

    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: formattedDate,
      },
    }));
  };

  const handleError = (error) => {
    if (error.name === "ValidationError") {
      handleValidationError(error);
    } else {
      console.log("Unexpected Error:", error);
      setErrors({ apiError: error.message });
    }
  };

  // Process validation errors and update the state
  const handleValidationError = (error) => {
    const validationErrors = {};

    // Iterate over each validation error
    error.inner.forEach((err) => {
      validationErrors[err.path] = err.message;
    });

    console.log("Validation Error", validationErrors);

    setErrors(validationErrors);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrors({}); // Clear previous errors

      console.log("Before ValidationsForm data is valid:", formData);
      // Validate the form data
      const validatedData = await AddListingValidationSchema.validate(
        formData,
        {
          abortEarly: false,
        }
      );

      // await addListingFunction({ formData });

      console.log("After ValidationsForm data is valid:", validatedData);
      // Proceed with form submission
    } catch (error) {
      console.log("Validation errors:", error.inner);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBox>
      <h1 className="text-2xl font-semibold">Add Listing</h1>
      <FormCard>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Details Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Select Property Type
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {PropertyType?.map((type) => (
                <Button
                  key={type}
                  variant={
                    formData.propertyType === type ? "contained" : "outlined"
                  }
                  onClick={() => handlePropertyTypeSelect(type)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.propertyType === type ? "#23BB67" : "white",
                    color: formData.propertyType === type ? "white" : "#10552F",
                    border: `1px solid ${formData.propertyType === type ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.propertyType === type
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type}
                </Button>
              ))}
            </Box>

            {errors.propertyType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.propertyType}
              </Typography>
            )}

            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Select Unit Type
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {UnitType?.map((type) => (
                <Button
                  key={type}
                  variant={
                    formData.unitType === type ? "contained" : "outlined"
                  }
                  onClick={() => handleUnitTypeSelect(type)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.unitType === type ? "#23BB67" : "white",
                    color: formData.unitType === type ? "white" : "#10552F",
                    border: `1px solid ${formData.unitType === type ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.unitType === type
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type}
                </Button>
              ))}
            </Box>

            {errors.unitType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.unitType}
              </Typography>
            )}
            {/* Location Details */}
            <Typography variant="h6" sx={{ color: "#10552F", mb: 1 }}>
              Location Details
            </Typography>

            {errors.unitType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.unitType}
              </Typography>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Address Line 1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              error={!!errors.address1}
              helperText={errors.address1}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address Line 2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
            />

            <Grid container alignItems="center" spacing={2} marginTop={1}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    inputProps={{
                      id: "country-select",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                      height: "56px",
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country?.isoCode} value={country?.isoCode}>
                        {country?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.stateIsoCode || ""}
                    disabled={!formData.countryIsoCode}
                    onChange={handleStateChange}
                    inputProps={{
                      id: "country-select",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                      height: "56px",
                    }}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>
                        {state?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    inputProps={{
                      id: "country-select",
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                      height: "56px",
                    }}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city?.name} value={city?.name}>
                        {city?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  error={!!errors.zip}
                  helperText={errors.zip}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "56px",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
            />

            {/* Nearby Places */}
            {/* <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
              <Typography variant="subtitle1" fontWeight="bold">
                Places near you
              </Typography>
              <Typography variant="body2">Mitchel Park - 1 km</Typography>
              <Typography variant="body2">Mark University - 2 km</Typography>
              <Typography variant="body2">Adams Hospital - 1 km</Typography>
            </Box> */}
            {/* <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
              <Typography variant="subtitle1" fontWeight="bold">
                Upload Your Lease Agreement
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                type="file"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
              />
            </Box> */}
          </Box>

          {/* Property Details Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Property Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Roommate Preferences</InputLabel>
                  <Select
                    name="roommatePreference"
                    value={formData.roommatePreference}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                    }}
                  >
                    <MenuItem value="Male">Male Only</MenuItem>
                    <MenuItem value="Female">Female Only</MenuItem>
                    <MenuItem value="Students">Students Only</MenuItem>
                    <MenuItem value="Professionals">
                      Professionals Only
                    </MenuItem>
                    <MenuItem value="Any">Any</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Preferences</InputLabel>
                  <Select
                    name="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#23BB67",
                      },
                    }}
                  >
                    <MenuItem value="Vegetarian">Vegetarian Only</MenuItem>
                    <MenuItem value="NonVegetarian">
                      Non-Vegetarian Allowed
                    </MenuItem>
                    <MenuItem value="Any">No Preference</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available From"
                  name="availableFrom"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.availableFrom}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#23BB67",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available Till"
                  name="availableTill"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.availableTill}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#23BB67",
                    },
                  }}
                />
              </Grid>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box p={3} display="flex" flexDirection="column" gap={2}>
                  <TextField
                    type="number"
                    label="Enter Custom Value"
                    onChange={handleChange}
                    inputProps={{ min: 6 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setOpenDialog(false)}
                  >
                    Confirm
                  </Button>
                </Box>
              </Dialog>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Number of Bedrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.bedrooms}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, bedrooms: value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Number of Bathrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.bathrooms}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, bathrooms: value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  {["0", "1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Number of Balconies
                </Typography>
                <ToggleButtonGroup
                  value={formData.balconies}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, balconies: value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  {["0", "1", "2", "3", "4", "5+"]?.map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Car Parking
                </Typography>
                <ToggleButtonGroup
                  value={formData.parking}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, parking: value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  {["0", "1", "2", "3", "4", "5+"]?.map((item) => (
                    <ToggleButton key={item} value={item}>
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Pets
                </Typography>
                <ToggleButtonGroup
                  value={formData.petsAllowed}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, petsAllowed: value })
                  }
                  fullWidth
                  sx={{
                    display: "flex", // Ensures it takes full width
                    justifyContent: "center",
                    "& .MuiToggleButton-root": {
                      flex: 1, // Ensures buttons take equal width
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  <ToggleButton value="Not Allowed">Not Allowed</ToggleButton>
                  <ToggleButton value="Allowed">Allowed</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
                <Box borderRadius="8px" mt={2} p={2} bgcolor="#f0f7f2">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Pets Include
                  </Typography>
                  <Button>Add More</Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Select Property Type
                </Typography>
                <ToggleButtonGroup
                  value={formData.furnishing}
                  exclusive
                  onChange={(_, value) =>
                    setFormData({ ...formData, furnishing: value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#23BB67",
                        color: "white",
                        "&:hover": { backgroundColor: "#10552F" },
                      },
                    },
                  }}
                >
                  <ToggleButton value="Unfurnished">Unfurnished</ToggleButton>
                  <ToggleButton value="Semi-Furnished">
                    Semi-Furnished
                  </ToggleButton>
                  <ToggleButton value="Furnished">Furnished</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
                <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Furniture Includes
                  </Typography>
                  <Button
                    onClick={() => setOpenFurnishingModal((prev) => !prev)}
                  >
                    Add More
                  </Button>
                  {furnishingItems}
                </Box>
              </Grid>
            </Grid>
            <Box>
              <Typography variant="h6" sx={{ color: "#10552F", mb: 2 }}>
                Furniture Images (Max 3)
              </Typography>
              <Grid container spacing={2}>
                {furnitureImages.map((image, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        border: "2px dashed #23BB67",
                        borderRadius: 2,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8faf8",
                        overflow: "hidden",
                        "&:hover": {
                          borderColor: "#10552F",
                        },
                      }}
                    >
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt={`furniture-${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                              },
                            }}
                            onClick={() =>
                              handleImageRemove(index, "furniture")
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            document
                              .getElementById(`furniture-upload-${index}`)
                              .click()
                          }
                        >
                          <AddPhotoAlternateIcon
                            sx={{ fontSize: 40, color: "#23BB67", mb: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload
                          </Typography>
                        </Box>
                      )}
                      <input
                        type="file"
                        id={`furniture-upload-${index}`}
                        accept="image/*"
                        hidden
                        onChange={(event) =>
                          handleImageUploadfur(event, index, "furniture")
                        }
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Pricing Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Pricing Details
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Expected Rent ($)"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              type="number"
              error={!!errors.rentAmount}
              helperText={errors.rentAmount}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rentNegotiable"
                  checked={formData.rentNegotiable}
                  onChange={handleChange}
                />
              }
              label="Price Negotiable"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Security Deposit ($)"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              type="number"
              error={!!errors.depositAmount}
              helperText={errors.depositAmount}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="depositNegotiable"
                  checked={formData.depositNegotiable}
                  onChange={handleChange}
                />
              }
              label="Price Negotiable"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Sublease Transfer Charges ($)"
              name="subleaseCharges"
              value={formData.subleaseCharges}
              onChange={handleChange}
              type="number"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="tel"
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*", // Allows only numbers
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="transferNegotiable"
                  checked={formData.transferNegotiable}
                  onChange={handleChange}
                />
              }
              label="Price Negotiable"
            />
          </Box>

          {/* Images Section */}

          {/* Image Preview Grid */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 2 }}>
              Property Images (Max 3)
            </Typography>
            <Grid container spacing={2}>
              {unitImages.map((image, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 200,
                      border: "2px dashed #23BB67",
                      borderRadius: 2,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8faf8",
                      overflow: "hidden",
                      "&:hover": {
                        borderColor: "#10552F",
                      },
                    }}
                  >
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt={`property-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                          }}
                          onClick={() => handleImageRemove(index, "property")}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          document
                            .getElementById(`property-upload-${index}`)
                            .click()
                        }
                      >
                        <AddPhotoAlternateIcon
                          sx={{ fontSize: 40, color: "#23BB67", mb: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          Click to upload
                        </Typography>
                      </Box>
                    )}
                    <input
                      type="file"
                      id={`property-upload-${index}`}
                      accept="image/*"
                      hidden
                      onChange={(event) =>
                        handleImageUploadfur(event, index, "property")
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={handleSubmit}
              sx={{
                mt: 4,
                backgroundColor: "#23BB67",
                color: "white",
                "&:hover": { backgroundColor: "#10552F" },
                px: 4,
                py: 1,
              }}
            >
              Submit Listing
            </Button>
          </Box>
        </Box>

        {/* Keep the furnishing modal */}
        {openFurnishingModal && (
          <Modal
            open={openFurnishingModal}
            onClose={() => setOpenFurnishingModal(false)}
          >
            <Box
              sx={{
                position: "absolute",
                maxWidth: 600,
                width: "90%",
                maxHeight: "80vh", // Limits height to 80% of viewport height
                overflowY: "auto", // Enables vertical scrolling when content overflows
                margin: "auto",
                mt: 5,
                p: 4,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#10552F", fontWeight: 600 }}
                >
                  Furnishing Details
                </Typography>
                <Button
                  onClick={() => setOpenFurnishingModal(false)}
                  sx={{
                    minWidth: "32px",
                    fontSize: "18px",
                    color: "red",
                  }}
                >
                  ✖
                </Button>
              </Box>
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                <InputLabel>Furnishing Status</InputLabel>
                <Select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleFurnishingChange}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#23BB67",
                      "&:hover": { borderColor: "#10552F" },
                    },
                  }}
                >
                  <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                  <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                  <MenuItem value="Furnished">Furnished</MenuItem>
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#10552F", fontWeight: 500 }}
                >
                  Available Items
                </Typography>
                <Button
                  onClick={handleClearAll}
                  sx={{
                    color: "#23BB67",
                    "&:hover": {
                      color: "#10552F",
                      backgroundColor: "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  Clear all
                </Button>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                {furnishingItems?.map((item) => (
                  <Grid
                    container
                    key={item}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Typography sx={{ color: "#333", fontWeight: 500 }}>
                      {item}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        px: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, -1)}
                        sx={{
                          color: "#23BB67",
                          "&:hover": {
                            backgroundColor: "rgba(35, 187, 103, 0.1)",
                          },
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        sx={{
                          mx: 2,
                          minWidth: "30px",
                          textAlign: "center",
                        }}
                      >
                        {formData.items?.[item] || 0}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, 1)}
                        sx={{
                          color: "#23BB67",
                          "&:hover": {
                            backgroundColor: "rgba(35, 187, 103, 0.1)",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Box>
            </Box>
          </Modal>
        )}
      </FormCard>
    </GradientBox>
  );
}
