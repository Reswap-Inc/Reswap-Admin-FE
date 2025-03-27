import React, { useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AddPhotoAlternate as AddPhotoAlternateIcon } from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  AddListingValidationSchema,
  fetchNearByPlacesValidationSchema,
} from "../utils/validationSchemas";
import { getConfiguration, getLocationFromZip } from "../network/generalApi";
import { getPlacesNearListing } from "../network/spaceShare";
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

const ListingType = [
  { id: 1, label: "Unit", value: "unit" },
  { id: 2, label: "Room", value: "room" },
];

const initialState = {
  listingType: "unit",
  propertyType: "",
  unitType: "",
  roomType: "RSLT00005",
  title: "",
  propertyName: "",
  description: "",
  location: {
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    roomNumber: "",
    coordinates: {
      lat: null,
      lng: null,
    },
  },
  rentAmount: "",
  depositAmount: "",
  feesAmount: "",
  petsAllowed: [],
  petsPresent: [],
  roommatePreferences: [],
  foodPreferences: [],
  configurationHouse: {
    bedrooms: {
      number: 1,
      required: true,
    },
    bathrooms: {
      number: 1,
      required: true,
    },
    kitchen: {
      number: 1,
      required: true,
    },
    balcony: {
      number: 0,
      required: false,
    },
    parking: {
      number: 0,
      required: false,
    },
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
    startDate: "",
    endDate: "",
    flexible: false,
  },
  roomateDetails: [],
  saleType: "RSQT00002",
  arePetsAllowed: false,
  petsAllowed: [],
  petsPresent: [],
  amenities: [],
  utilities: [],
  comesWithFurniture: false,
  furniture: [],
  price: {
    rent: {
      amount: 0,
      currency: "USD",
    },
    deposit: {
      amount: 0,
      currency: "USD",
    },
    fees: {
      cleaning: {
        amount: 0,
        currency: "USD",
      },
    },
    flexible: false,
  },
  currentResidents: [],
  floorPlanImage: "",
  videos: [],
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddListing() {
  const theme = useTheme();
  const [formData, setFormData] = React.useState(initialState);
  const [furnitureImages, setFurnitureImages] = useState(Array(3).fill(null));
  const [unitImages, setUnitImages] = useState(Array(3).fill(null));
  const [openFurnishingModal, setOpenFurnishingModal] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const countries = Country.getAllCountries();

  const CONFIGKEYS = [
    "roommatePreferencesOptions",
    "foodPreferencesOptions",
    "popularPlaces",
    "amenities",
    "furniture",
    "utilities",
    "pets",
    "propertyType",
    "leaseType",
    "roomType",
  ];

  const [propertyType, setPropertyType] = useState([]);
  const [roommatePreferencesOptions, setRoommatePreferencesOptions] = useState(
    []
  );
  const [foodPreferencesOptions, setFoodPreferencesOptions] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [pets, setPets] = useState([]);
  const [leaseType, setLeaseType] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const [unitType, setUnitType] = useState([]);
  const [isNearByPlacesFetching, setIsNearByPlacesFetching] = useState(false);
  const [nearByPlaces, setNearByPlaces] = useState([]);

  const [customValueType, setCustomValueType] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [openPetModel, setOpenPetModel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //roommatePreferencesOptions
        const roommatePreferencesOptions = await getConfiguration(
          "roommatePreferencesOptions"
        ); // Provide the required key
        if (roommatePreferencesOptions?.body?.preferences) {
          setRoommatePreferencesOptions(
            roommatePreferencesOptions.body.preferences
          );
        }

        //propertyType
        const propertyType = await getConfiguration("propertyType"); // Provide the required key
        if (propertyType?.body?.items) {
          setPropertyType(propertyType.body.items);
        }

        //foodPreferencesOptions
        const foodPreferencesOptions = await getConfiguration(
          "foodPreferencesOptions"
        ); // Provide the required key
        if (foodPreferencesOptions?.body?.preferences) {
          setFoodPreferencesOptions(foodPreferencesOptions.body.preferences);
        }

        //amenities
        const amenities = await getConfiguration("amenities"); // Provide the required key
        if (amenities?.body?.items) {
          setAmenities(amenities.body.items);
        }

        //furniture
        const furniture = await getConfiguration("furniture"); // Provide the required key
        if (furniture?.body?.items) {
          setFurniture(furniture.body.items);
        }

        //utilities
        const utilities = await getConfiguration("utilities"); // Provide the required key
        if (utilities?.body?.items) {
          setUtilities(utilities.body.items);
        }

        //pets
        const pets = await getConfiguration("pets"); // Provide the required key
        if (pets?.body?.items) {
          setPets(pets.body.items);
        }

        //roomType
        const roomType = await getConfiguration("roomType"); // Provide the required key
        if (roomType?.body?.items) {
          setRoomType(roomType.body.items);
        }

        //unitType
        const unitType = await getConfiguration("unitType"); // Provide the required key
        if (roomType?.body?.items) {
          setUnitType(unitType.body.items);
        }
      } catch (error) {
        console.error("Failed to fetch roommate preferences:", error);
      }
    };

    fetchData();
  }, []);

  // console.log("roommatePreferencesOptions--->", roommatePreferencesOptions);
  // console.log("propertyType--->", propertyType);
  // console.log("foodPreferencesOptions--->", foodPreferencesOptions);
  // console.log("popularPlaces--->", popularPlaces);
  // console.log("amenities--->", amenities);
  // console.log("furniture--->", furniture);
  // console.log("utilities--->", utilities);
  console.log("pets--->", pets);
  // console.log("roomType--->", roomType);

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
    console.log("Name:", name, "Value:", value);
    const nameParts = name.split(".");

    setFormData((prev) => {
      const newState = { ...prev };
      let current = newState;

      // Handle nested object updates
      for (let i = 0; i < nameParts.length - 1; i++) {
        if (!current[nameParts[i]]) {
          current[nameParts[i]] = {};
        }
        current = current[nameParts[i]];
      }

      current[nameParts[nameParts.length - 1]] = value;
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangeZip = (event) => {
    const { name, value } = event.target;

    // Allow only numbers using regex
    if (/^\d*$/.test(value) && value.length <= 5) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleListingTypeSelect = (type) => {
    if (type === "unit") {
      setFormData((prev) => ({ ...prev, roomType: "RSLT00005" }));
    } else {
      setFormData((prev) => ({ ...prev, roomType: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      listingType: type,
    }));
  };

  const handlePropertyTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      propertyType: type,
    }));

    setErrors((prev) => ({ ...prev, propertyType: "" }));
  };

  const handleUnitTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      unitType: type,
    }));
    setErrors((prev) => ({ ...prev, unitType: "" }));
  };
  const handleRoomTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      roomType: type,
    }));
    setErrors((prev) => ({ ...prev, roomType: "" }));
  };

  const handleFurnishingChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      furnishing: event.target.value,
    }));
    setErrors((prev) => ({ ...prev, furnishing: "" }));
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

  const handleError = (error) => {
    if (error.name === "ValidationError") {
      handleValidationError(error);
    } else {
      setErrors({ apiError: error.message });
    }
  };

  // Process validation errors and update the state
  const handleValidationError = (error) => {
    const validationErrors = {};

    error.inner.forEach((err) => {
      validationErrors[err.path] = err.message;
    });

    setErrors(validationErrors);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Transform form data to match API format
      const apiFormData = {
        listingType: formData.listingType,
        propertyType: formData.propertyType,
        unitType: formData.unitType,
        roomType: formData.roomType,
        title: formData.title,
        propertyName: formData.propertyName || null,
        description: formData.description,
        belongingsIncluded: formData.belongingsIncluded,
        saleType: "RSQT00002",
        arePetsAllowed: formData.petsAllowed === "Allowed",
        petsAllowed: formData.petsAllowed || [],
        petsPresent: formData.petsPresent || [],
        amenities: formData.amenities || [],
        utilities: formData.utilities || [],
        configurationHouse: {
          bedrooms: {
            number: parseInt(formData.configurationHouse.bedrooms.number) || 0,
            required: true,
          },
          bathrooms: {
            number: parseInt(formData.configurationHouse.bathrooms.number) || 0,
            required: true,
          },
          kitchen: {
            number: parseInt(formData.configurationHouse.kitchen.number) || 1,
            required: true,
          },
          balcony: {
            number: parseInt(formData.configurationHouse.balcony.number) || 0,
            required: false,
          },
        },
        comesWithFurniture: formData.furnishing !== "Unfurnished",
        furniture: Object.entries(formData.items || {}).map(([id, count]) => ({
          id,
          count,
          common: false,
          exclusiveAccess: false,
        })),
        location: {
          address: formData.location.address,
          address2: formData.location.address2,
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          postalCode: formData.location.postalCode,
          roomNumber:
            formData.listingType === "room" ? formData.location.roomNumber : "",
          coordinates: {
            lat: formData.location.coordinates.lat,
            lng: formData.location.coordinates.lng,
          },
        },
        price: {
          rent: {
            amount: parseFloat(formData.rentAmount) || 0,
            currency: "USD",
          },
          deposit: {
            amount: parseFloat(formData.depositAmount) || 0,
            currency: "USD",
          },
          fees: {
            cleaning: {
              amount: parseFloat(formData.feesAmount) || 0,
              currency: "USD",
            },
          },
          flexible: formData.price.flexible,
        },
        availability: {
          startDate: formData.availableFrom
            ? new Date(formData.availableFrom).toISOString()
            : "",
          endDate: formData.availableTill
            ? new Date(formData.availableTill).toISOString()
            : "",
          flexible: formData.availability.flexible,
        },
        currentResidents: formData.roomateDetails || [],
        furnitureImages: formData.furnitureImages || [],
        unitImages: formData.unitImages || [],
      };

      console.log("Data before validation:", apiFormData);

      // Validate the transformed data
      const validatedData = await AddListingValidationSchema.validate(
        apiFormData,
        {
          abortEarly: false,
        }
      );

      console.log("Data ready for API:", validatedData);

      // Make API call with validatedData
      // await addListingFunction(validatedData);
    } catch (error) {
      console.log("Validation errors:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (
        formData.location.postalCode &&
        formData.location.postalCode.length === 5
      ) {
        try {
          const response = await getLocationFromZip(
            formData.location.postalCode
          );
          console.log("location--->", response);
          if (response.body.found) {
            setFormData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                city: response.body.city.name,
                state: response.body.state.state_code,
                country: response.body.country.iso2,
                coordinates: {
                  lat: response.body.city.latitude,
                  lng: response.body.city.longitude,
                },
              },
            }));

            setErrors((prev) => ({
              ...prev,
              ["location.city"]: "",
              ["location.state"]: "",
              ["location.country"]: "",
            }));
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
    };

    fetchLocation();
  }, [formData.location.postalCode]);

  const fetchNearByPlaces = async () => {
    try {
      const addressFormData = {
        zip: formData.location.postalCode,
        country: formData.location.country,
        state: formData.location.state,
        city: formData.location.city,
        address1: formData.location.address,
        address2: formData.location.address2,
      };

      console.log("addressFormData", addressFormData);
      await fetchNearByPlacesValidationSchema.validate(addressFormData, {
        abortEarly: false,
      });
      const response = await getPlacesNearListing(addressFormData);

      console.log("fetchNearByPlaces response", response);
    } catch (error) {
      handleError(error); // ✅ Now this will properly handle 409
    }
  };

  useEffect(() => {
    fetchNearByPlaces();
  }, [formData.location.address]);

  const handleConfigurationChange = (type, value) => {
    console.log("handleConfigurationChange", type, value);

    setFormData((prev) => ({
      ...prev,
      configurationHouse: {
        ...prev.configurationHouse,
        [type]: {
          ...prev.configurationHouse[type],
          number: parseInt(value) || 0,
        },
      },
    }));
  };

  const handleChangeAvailabilityFlexible = (event) => {
    const { name, checked } = event.target;

    console.log(" name, checked ", name, checked);
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        flexible: checked,
      },
    }));
  };

  return (
    <GradientBox>
      <h1 className="text-2xl font-semibold">Add Listing</h1>
      <FormCard>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Details Section */}
          <Box>
            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Listing Type
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {ListingType?.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    formData.listingType === type.value
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleListingTypeSelect(type.value)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.listingType === type.value ? "#23BB67" : "white",
                    color:
                      formData.listingType === type.value ? "white" : "#10552F",
                    border: `1px solid ${formData.listingType === type.value ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.listingType === type.value
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.label}
                </Button>
              ))}
            </Box>

            {errors.listingType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.listingType}
              </Typography>
            )}

            <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
              Select Property Type
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {propertyType?.map((type) => (
                <Button
                  key={type?.id}
                  variant={
                    formData.propertyType === type?.id
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handlePropertyTypeSelect(type?.id)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.propertyType === type?.id ? "#23BB67" : "white",
                    color:
                      formData.propertyType === type?.id ? "white" : "#10552F",
                    border: `1px solid ${formData.propertyType === type?.id ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.propertyType === type?.id
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.name}
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
              {unitType?.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    formData.unitType === type.id ? "contained" : "outlined"
                  }
                  onClick={() => handleUnitTypeSelect(type.id)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor:
                      formData.unitType === type.id ? "#23BB67" : "white",
                    color: formData.unitType === type.id ? "white" : "#10552F",
                    border: `1px solid ${formData.unitType === type.id ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor:
                        formData.unitType === type.id
                          ? "#10552F"
                          : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type.name}
                </Button>
              ))}
            </Box>

            {errors.unitType && (
              <Typography sx={{ color: "error.main", mt: 1 }}>
                {errors.unitType}
              </Typography>
            )}

            {formData.listingType !== "unit" && (
              <>
                <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>
                  Select Room Type
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
                  {roomType?.map((type) => (
                    <Button
                      key={type.id}
                      variant={
                        formData.roomType === type.id ? "contained" : "outlined"
                      }
                      onClick={() => handleRoomTypeSelect(type.id)}
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "14px",
                        backgroundColor:
                          formData.roomType === type.id ? "#23BB67" : "white",
                        color:
                          formData.roomType === type.id ? "white" : "#10552F",
                        border: `1px solid ${formData.roomType === type.id ? "#23BB67" : "#10552F"}`,
                        "&:hover": {
                          backgroundColor:
                            formData.roomType === type.id
                              ? "#10552F"
                              : "rgba(35, 187, 103, 0.1)",
                        },
                      }}
                    >
                      {type.name}
                    </Button>
                  ))}
                </Box>

                {errors.roomType && (
                  <Typography sx={{ color: "error.main", mt: 1 }}>
                    {errors.roomType}
                  </Typography>
                )}
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />

            {/* Location Details */}
            <Typography variant="h6" sx={{ color: "#10552F", mb: 1 }}>
              Location Details
            </Typography>

            <Grid container alignItems="center" spacing={2} marginTop={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zip"
                  name="location.postalCode"
                  value={formData.location.postalCode}
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

              <Grid item xs={12} md={6}>
                <Tooltip
                  title={
                    formData.location.postalCode ? "" : "Please select zip"
                  }
                  disableInteractive
                >
                  <span>
                    <TextField
                      disabled
                      fullWidth
                      label="Country"
                      name="location.country"
                      value={formData?.location?.country}
                      onChange={handleChange}
                      error={!!errors?.["location.country"]}
                      helperText={errors?.["location.country"]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "56px",
                        },
                      }}
                      InputLabelProps={{
                        shrink: !!formData.location.country,
                      }}
                    />
                  </span>
                </Tooltip>
              </Grid>

              <Grid item xs={12} md={6}>
                <Tooltip
                  title={
                    formData.location.postalCode ? "" : "Please select zip"
                  }
                  disableInteractive
                >
                  <span>
                    <TextField
                      disabled
                      fullWidth
                      label="State"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      error={!!errors?.["location.state"]}
                      helperText={errors?.["location.state"]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "56px",
                        },
                      }}
                      InputLabelProps={{
                        shrink: !!formData.location.state,
                      }}
                    />
                  </span>
                </Tooltip>
              </Grid>

              <Grid item xs={12} md={6}>
                <Tooltip
                  title={
                    formData.location.postalCode ? "" : "Please select zip"
                  }
                  disableInteractive
                >
                  <span>
                    <TextField
                      disabled
                      fullWidth
                      label="City"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      error={!!errors?.["location.city"]}
                      helperText={errors?.["location.city"]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "56px",
                        },
                      }}
                      InputLabelProps={{
                        shrink: !!formData.location.city,
                      }}
                    />
                  </span>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 1"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  error={!!errors?.["location.address"]}
                  helperText={errors?.["location.address"]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 2"
                  name="location.address2"
                  value={formData.location.address2}
                  onChange={handleChange}
                  error={!!errors?.["location.address2"]}
                  helperText={errors?.["location.address2"]}
                />
              </Grid>
              {formData.listingType === "room" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Room Number"
                    name="location.roomNumber"
                    value={formData.location.roomNumber}
                    onChange={handleChange}
                    error={!!errors?.["location.roomNumber"]}
                    helperText={errors?.["location.roomNumber"]}
                  />
                </Grid>
              )}
            </Grid>

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
              {/* <Grid item xs={12} md={6}>
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

                  <InputLabel id="demo-multiple-name-label">
                    Roommate Preferences
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={formData.roomatePreferences}
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                    name=""
                  >
                    {names.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, personName, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}

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
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="availability.flexible"
                      checked={formData.availability.flexible}
                      onChange={handleChangeAvailabilityFlexible}
                    />
                  }
                  label="Date Flexible"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Number of Bedrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.bedrooms.number.toString()}
                  exclusive
                  onChange={(_, value) =>
                    handleConfigurationChange("bedrooms", value)
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
                  value={formData.configurationHouse.bathrooms.number.toString()}
                  exclusive
                  onChange={(_, value) =>
                    handleConfigurationChange("bathrooms", value)
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
                  value={formData.configurationHouse.balcony.number.toString()}
                  exclusive
                  onChange={(_, value) =>
                    handleConfigurationChange("balcony", value)
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
                  Car Parking
                </Typography>
                <ToggleButtonGroup
                  value={formData.configurationHouse.parking.number.toString()}
                  exclusive
                  onChange={(_, value) =>
                    handleConfigurationChange("parking", value)
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
                  Pets
                </Typography>
                <ToggleButtonGroup
                  value={formData.arePetsAllowed ? "Allowed" : "Not Allowed"}
                  exclusive
                  onChange={(_, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      arePetsAllowed: value === "Allowed",
                    }))
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
              {formData?.arePetsAllowed && (
                <Grid item xs={12}>
                  <Box borderRadius="8px" mt={2} p={2} bgcolor="#f0f7f2">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Pets Include :-
                    </Typography>
                    {formData.petsAllowed &&
                    Array.isArray(formData.petsAllowed) &&
                    formData.petsAllowed.length > 0 ? (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {formData.petsAllowed.map((pet) => (
                          <Typography
                            key={pet.id}
                            sx={{
                              display: "inline-block",
                              backgroundColor: "#23BB67",
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              margin: "4px",
                              fontSize: "0.875rem",
                            }}
                          >
                            {pet.name}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mt: 1,
                          mb: 2,
                        }}
                      >
                        No pets selected
                      </Typography>
                    )}
                    <Button onClick={() => setOpenPetModel(true)}>
                      Add More
                    </Button>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}
                >
                  Furnishing Status
                </Typography>
                <ToggleButtonGroup
                  value={formData.furnishing}
                  exclusive
                  onChange={(_, value) =>
                    setFormData(prev => ({
                      ...prev,
                      furnishing: value,
                      comesWithFurniture: value !== "Unfurnished"
                    }))
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

              {formData.furnishing && formData.furnishing !== "Unfurnished" && (
                <Grid item xs={12}>
                  <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Furniture Includes
                    </Typography>
                    {Object.entries(formData.items || {}).length > 0 ? (
                      <Box sx={{ mt: 1 }}>
                        {Object.entries(formData.items).map(([item, count]) => (
                          count > 0 && (
                            <Typography key={item} variant="body2">
                              • {item}: {count}
                            </Typography>
                          )
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No furniture items selected
                      </Typography>
                    )}
                    <Button
                      onClick={() => setOpenFurnishingModal(true)}
                      sx={{ mt: 2 }}
                    >
                      Add/Edit Furniture
                    </Button>
                  </Box>
                </Grid>
              )}
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
                  name="price.flexible"
                  checked={formData.price.flexible}
                  onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        flexible: event.target.checked,
                      },
                    }));
                  }}
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

        {openPetModel && (
          <Modal open={openPetModel} onClose={() => setOpenPetModel(false)}>
            <Box
              sx={{
                position: "absolute",
                maxWidth: 600,
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
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
                  Add Pets
                </Typography>
                <Button
                  onClick={() => setOpenPetModel(false)}
                  sx={{
                    minWidth: "32px",
                    fontSize: "18px",
                    color: "red",
                  }}
                >
                  ✖
                </Button>
              </Box>

              {/* Available Pets Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "#10552F" }}
                >
                  Available Pets
                </Typography>
                <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}>
                  {pets?.map((pet) => (
                    <Grid
                      container
                      key={pet.id}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid #e0e0e0",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Typography sx={{ color: "#333", fontWeight: 500 }}>
                        {pet.name}
                      </Typography>
                      <Button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            petsAllowed: [...prev.petsAllowed, pet],
                          }));
                        }}
                        disabled={formData.petsAllowed.some(
                          (p) => p.id === pet.id
                        )}
                        sx={{
                          color: "#23BB67",
                          minWidth: "40px",
                          "&:hover": {
                            backgroundColor: "rgba(35, 187, 103, 0.1)",
                          },
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  ))}
                </Box>
              </Box>

              {/* Selected Pets Section */}
              {formData.petsAllowed.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: "#10552F" }}
                  >
                    Selected Pets
                  </Typography>
                  <Box
                    sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}
                  >
                    {formData.petsAllowed.map((pet) => (
                      <Grid
                        container
                        key={pet.id}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          py: 1.5,
                          borderBottom: "1px solid #e0e0e0",
                          "&:last-child": { borderBottom: "none" },
                        }}
                      >
                        <Typography sx={{ color: "#333", fontWeight: 500 }}>
                          {pet.name}
                        </Typography>
                        <Button
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              petsAllowed: prev.petsAllowed.filter(
                                (p) => p.id !== pet.id
                              ),
                            }));
                          }}
                          sx={{
                            color: "red",
                            minWidth: "40px",
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <RemoveIcon />
                        </Button>
                      </Grid>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Modal>
        )}
      </FormCard>
    </GradientBox>
  );
}
