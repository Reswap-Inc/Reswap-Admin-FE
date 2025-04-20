
// Use code with caution.
// JavaScript
// 3. Refactor handleSubmit Data Transformation:
// // --- Inside AddListing component ---

// // Helper function to transform formData for the API

// Use code with caution.
// JavaScript
// 4. Updated AddListing Component:
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Typography, TextField, MenuItem, Select, FormControl, InputLabel,
  ToggleButtonGroup, ToggleButton, FormControlLabel, Checkbox, Grid, IconButton,
  Modal, Tooltip, OutlinedInput, FormHelperText, CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import moment from 'moment';
import { useDispatch } from "react-redux";
// Assuming reusable components are imported from a components file
import {
  SelectionButtonGroup, ConfigurationToggleButtonGroup, ImageUploadGrid,
  MultiSelectCheckbox, ItemQuantitySelector,convertFilesToBase64
} from './LisitngCom/Listingcom'; // Adjust path as needed
// Import utils
// import { convertFilesToBase64 } from '../utils/imageUtils'; // Adjust path
import { validationSchema } from "../utils/validationSchemas";
import { getConfiguration, getLocationFromZip } from "../network/generalApi";
// Removed getPlacesNearListing as it wasn't used in the simplified flow
import { addListingFunction, updateListingFunction } from "../network/ListingThunk";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
// Removed country-state-city import as it wasn't directly used after zip lookup logic
const transformFormDataForApi = (formData, preferences, funImageBase64 = [], unitImageBase64 = []) => {
    return {
      listingType: formData.listingType || "",
      propertyType: formData.propertyType || "",
      unitType: formData.unitType || "",
      roomType: formData.roomType || "",
      title: formData.title || "",
      propertyName: formData.propertyName || null, // API might expect null for empty
      description: formData.description || "",
      belongingsIncluded: formData.belongingsIncluded ?? false,
      saleType: "RSQT00002", // Hardcoded as per original
      arePetsAllowed: formData.arePetsAllowed ?? false,
      petsAllowed: formData.petsAllowed || [],
      petsPresent: formData.petsPresent || [], // Assuming this exists in formData? Might need adding if required.
      amenities: formData.amenities || [],
      utilities: formData.utilities || [], // Ensure structure matches API if needed
      foodPreferences: formData.foodPreferences || [],
      // Map preferences state correctly
      roommatePreferences: [
          { key: "Gender", values: preferences.gender || [] },
          { key: "Ethnicity", values: preferences.ethnicity || [] },
          { key: "Language", values: preferences.language || [] }
      ],
      configurationHouse: {
        bedrooms: {
          number: parseInt(formData.configurationHouse?.bedrooms?.number) || 0,
          required: formData.configurationHouse?.bedrooms?.required ?? true,
        },
        bathrooms: {
          number: parseInt(formData.configurationHouse?.bathrooms?.number) || 0,
          required: formData.configurationHouse?.bathrooms?.required ?? true,
        },
        kitchen: {
          number: parseInt(formData.configurationHouse?.kitchen?.number) || 0, // Check if this should be parking? Original code had parking here. Assuming kitchen based on label.
          required: formData.configurationHouse?.kitchen?.required ?? true,
        },
        balcony: {
          number: parseInt(formData.configurationHouse?.balcony?.number) || 0,
          required: formData.configurationHouse?.balcony?.required ?? false,
        },
        // Missing parking config if needed based on label
      },
      comesWithFurniture: formData.furnishing !== "Unfurnished",
      furniture: formData.furniture || [], // Ensure structure matches API
      location: {
        address: formData.location?.address || "",
        address2: formData.location?.address2 || "",
        city: formData.location?.city || "",
        state: formData.location?.state || "",
        country: formData.location?.country || "",
        postalCode: formData.location?.postalCode || "",
        roomNumber: formData.listingType === "room" ? (formData.location?.roomNumber || "") : null, // Null if not room
        coordinates: {
          lat: formData.location?.coordinates?.lat || null,
          lng: formData.location?.coordinates?.lng || null,
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
        fees: { // Assuming subleaseCharges maps here, or needs separate field
          cleaning: { // This was hardcoded as 'cleaning', adjust if needed
            amount: parseFloat(formData.subleaseCharges) || 0, // Used subleaseCharges here based on original TextField name
            currency: "USD",
          },
        },
        flexible: formData.price?.flexible ?? true, // Default flexible to true?
      },
      availability: {
        // Ensure dates are valid before converting
        startDate: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : null,
        endDate: formData.availableTill ? new Date(formData.availableTill).toISOString() : null,
        flexible: formData.availability?.flexible ?? true, // Default flexible to true?
      },
      // Assuming phone number goes somewhere - maybe top level or user profile? Add if needed.
      // mobile: formData.mobile || "",
      currentResidents: formData.roomateDetails || [], // Assuming this state exists? Needs adding if required.
      furnitureImages: funImageBase64.filter(img => img !== null) || [], // Send converted & filtered base64
      unitImages: unitImageBase64.filter(img => img !== null) || [], // Send converted & filtered base64
       // Missing floorPlanImage, videos if required
    };
  };
// --- Styled Components (Keep as is) ---
const GradientBox = styled(Box)({ /* ... */ });
const FormCard = styled(Box)({ /* ... */ });

// --- Constants ---
const ListingTypeOptions = [
  { id: 1, label: "Unit", value: "unit" },
  { id: 2, label: "Room", value: "room" },
];

// --- Initial State ---
const initialState = {
    listingType: "unit",
    propertyType: "",
    unitType: "",
    roomType: "RSLT00005", // Default if listingType is unit initially? Check logic. Maybe make it dynamic.
    title: "",
    propertyName: "",
    description: "",
    location: {
      address: "", address2: "", city: "", state: "", country: "USA", postalCode: "", roomNumber: "",
      coordinates: { lat: null, lng: null },
    },
    rentAmount: "", depositAmount: "", subleaseCharges: "", mobile: "", // Added mobile here based on TextField
    petsAllowed: [], petsPresent: [], // Keep if needed by API
    roommatePreferences: [], // Will be derived from 'preferences' state before submit
    foodPreferences: [],
    configurationHouse: {
      bedrooms: { number: 1, required: true }, // Sensible default
      bathrooms: { number: 1, required: true },
      kitchen: { number: 1, required: true },
      balcony: { number: 0, required: false },
      parking: { number: 0, required: false }, // Added based on original state structure
    },
    amenities: [], utilities: [], furniture: [], // Keep main arrays
    items: {}, // Internal state for quantity tracking in modal
    comesWithFurniture: false, // Derived from 'furnishing' state
    furnitureImages: [], unitImages: [], // These will hold base64/File/URL
    availability: { startDate: "", endDate: "", flexible: false },
    roomateDetails: [], // Keep if needed by API
    price: { flexible: false }, // Keep flexible flag
    arePetsAllowed: false, // Use this boolean for the toggle
    furnishing: "Unfurnished", // Default furnishing status
    belongingsIncluded: false, // Added based on API transform
    // Removed derived/unused fields like 'isOwnedByPropertyManager', 'saleType' if hardcoded
};

// --- Main Component ---
export default function AddListing11() {
  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state || {}; // Data for editing
  const isEditMode = location.pathname === "/web/admin/home/edit-listing";

  // --- State ---
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingConfig, setIsFetchingConfig] = useState(true); // Track config loading

  // Configuration options state
  const [configOptions, setConfigOptions] = useState({
    propertyType: [], roommatePreferencesOptions: [], foodPreferencesOptions: [],
    amenities: [], furniture: [], utilities: [], pets: [], roomType: [], unitType: [],
  });

  // Specific UI states
  const [openFurnishingModal, setOpenFurnishingModal] = useState(false);
  const [openPetModel, setOpenPetModel] = useState(false);
  // State for multi-select preferences (if using that UI pattern)
   const [preferences, setPreferences] = useState({ gender: [], ethnicity: [], language: [] });

  // --- Effects ---

  // Fetch configuration data on mount
  useEffect(() => {
    const fetchAllConfig = async () => {
      setIsFetchingConfig(true);
      const keysToFetch = [
        "propertyType", "roommatePreferencesOptions", "foodPreferencesOptions",
        "amenities", "furniture", "utilities", "pets", "roomType", "unitType",
      ];
      try {
        const results = await Promise.all(
          keysToFetch.map(key => getConfiguration(key))
        );
        const newConfigOptions = {};
        results.forEach((result, index) => {
          if (result?.body?.items) {
            newConfigOptions[keysToFetch[index]] = result.body.items;
          } else {
             newConfigOptions[keysToFetch[index]] = []; // Default to empty array on failure/no items
          }
        });
        setConfigOptions(newConfigOptions);
      } catch (error) {
        console.error("Failed to fetch configuration:", error);
        toast.error("Could not load configuration options. Please refresh.", { /* toast options */ });
        // Optionally set all configs to empty arrays
         setConfigOptions(keysToFetch.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
      } finally {
        setIsFetchingConfig(false);
      }
    };
    fetchAllConfig();
  }, []); // Empty dependency array: fetch only once

  // Populate form data in edit mode
  useEffect(() => {
    if (isEditMode && row) {
      // Simplified population - map API structure back to form state
      setFormData(prev => ({
          ...prev, // Start with initial state structure
          listingType: row.listingType,
          propertyType: row.propertyType,
          unitType: row.unitType,
          roomType: row.roomType,
          title: row.title,
          propertyName: row.propertyName,
          description: row.description,
          location: { // Ensure all location fields exist
              ...prev.location, // Keep defaults like country if not present in row
              ...row.location,
              coordinates: { ...prev.location.coordinates, ...row.location?.coordinates },
          },
          rentAmount: row.price?.rent?.amount ?? '',
          depositAmount: row.price?.deposit?.amount ?? '',
          subleaseCharges: row.price?.fees?.cleaning?.amount ?? '', // Map back from 'cleaning' based on transform logic
          mobile: row.mobile || '', // Assuming mobile is at top level in 'row'
          petsAllowed: row.petsAllowed || [],
          petsPresent: row.petsPresent || [],
          foodPreferences: row.foodPreferences || [],
          configurationHouse: { // Ensure all config fields exist
            ...prev.configurationHouse, // Keep defaults
            bedrooms: { ...prev.configurationHouse.bedrooms, number: row.configurationHouse?.bedrooms?.number ?? 1 },
            bathrooms: { ...prev.configurationHouse.bathrooms, number: row.configurationHouse?.bathrooms?.number ?? 1 },
            kitchen: { ...prev.configurationHouse.kitchen, number: row.configurationHouse?.kitchen?.number ?? 1 }, // Check mapping
            balcony: { ...prev.configurationHouse.balcony, number: row.configurationHouse?.balcony?.number ?? 0 },
            parking: { ...prev.configurationHouse.parking, number: row.configurationHouse?.parking?.number ?? 0 },
          },
          comesWithFurniture: row.comesWithFurniture ?? false,
          furnishing: row.comesWithFurniture ? (row.furniture?.length > 0 ? "Furnished" : "Semi-Furnished") : "Unfurnished", // Infer furnishing status
          arePetsAllowed: row.arePetsAllowed ?? false,
          belongingsIncluded: row.belongingsIncluded ?? false,
          amenities: row.amenities?.map(a => typeof a === 'object' ? a.id : a) || [], // Handle object vs id
          utilities: row.utilities || [], // Assuming structure matches
          furniture: row.furniture || [],
           // Convert furniture array back to items count for the modal
          items: (row.furniture || []).reduce((acc, item) => {
              acc[item.id] = item.count;
              return acc;
          }, {}),
          // Keep images as URLs/existing base64 from 'row' for display
          furnitureImages: row.furnitureImages || [],
          unitImages: row.unitImages || [],
          availability: { // Ensure all availability fields exist
             ...prev.availability,
             startDate: row.availability?.startDate ? moment(row.availability.startDate).format('YYYY-MM-DD') : '', // Format for date input
             endDate: row.availability?.endDate ? moment(row.availability.endDate).format('YYYY-MM-DD') : '',
             flexible: row.availability?.flexible ?? false,
          },
          price: { ...prev.price, flexible: row.price?.flexible ?? false },
          roomateDetails: row.currentResidents || [],
          // Map roommate preferences back from API structure to 'preferences' state if needed
          preferences: { // Example mapping - adjust keys if needed
              gender: row.roommatePreferences?.find(p => p.key === 'Gender')?.values || [],
              ethnicity: row.roommatePreferences?.find(p => p.key === 'Ethnicity')?.values || [],
              language: row.roommatePreferences?.find(p => p.key === 'Language')?.values || [],
          },
      }));

      // Pre-fill image previews (assuming row.furnitureImages/unitImages are URLs or base64)
      // Note: This part was missing in the original code, handling it here.
      // The ImageUploadGrid expects an array matching maxImages length.
      const fillImages = (imageUrls, max) => {
         const filled = Array(max).fill(null);
         (imageUrls || []).slice(0, max).forEach((img, i) => filled[i] = img);
         return filled;
      }
      // setFurnitureImages(fillImages(row.furnitureImages, 3)); // If using separate state for previews
      // setUnitImages(fillImages(row.unitImages, 3));
    }
  }, [isEditMode, row]); // Rerun only when edit mode status or row data changes

   // Fetch location from ZIP code
   useEffect(() => {
    const fetchLocationData = async () => {
      if (formData.location.postalCode?.length === 5) {
        try {
          // Simple Debounce
          const timerId = setTimeout(async () => {
             const response = await getLocationFromZip(formData.location.postalCode);
             if (response?.body?.found) {
                setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    city: response.body.city.name,
                    state: response.body.state.state_code,
                    country: response.body.country.iso2, // Assuming USA default is ok if not found
                    coordinates: {
                      lat: response.body.city.latitude,
                      lng: response.body.city.longitude,
                    },
                },
                }));
                // Clear related errors
                setErrors(prev => ({ ...prev, 'location.city': '', 'location.state': '', 'location.country': '' }));
             } else {
                 // Handle not found - maybe clear fields or show error?
                 setErrors(prev => ({ ...prev, 'location.postalCode': 'ZIP code not found.' }));
             }
          }, 500); // Debounce for 500ms

          return () => clearTimeout(timerId); // Cleanup timeout

        } catch (error) {
          console.error("Error fetching location:", error);
          // Show specific error if possible
          setErrors(prev => ({ ...prev, 'location.postalCode': 'Error fetching location data.' }));
        }
      }
    };
    fetchLocationData();
  }, [formData.location.postalCode]);


  // --- Handlers ---

  // Generic handler for simple value changes (including nested)
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const keys = name.split('.');
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] }; // Ensure nested objects exist and are cloned
      }
      current[keys[keys.length - 1]] = newValue;
      return newState;
    });

    // Clear error for the specific field
    setErrors(prev => {
        const newErrors = { ...prev };
        let errorCurrent = newErrors;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!errorCurrent[keys[i]]) break; // Stop if path doesn't exist in errors
            errorCurrent = errorCurrent[keys[i]];
        }
        if (errorCurrent && keys.length > 0) {
            delete errorCurrent[keys[keys.length - 1]];
        } else if (keys.length === 1) {
            delete newErrors[keys[0]]; // Handle top-level errors
        }
        return newErrors;
    });
  }, []);

 // Specific handler for SelectionButtonGroup component
 const handleSelectionChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error

    // Special logic for listingType affecting roomType
    if (name === 'listingType') {
        setFormData(prev => ({
            ...prev,
            listingType: value,
            roomType: value === 'unit' ? configOptions.roomType.find(rt => rt.name === 'Entire Unit')?.id || '' : prev.roomType // Adjust default as needed
        }));
        setErrors(prev => ({ ...prev, roomType: '' }));
    }
 }, [configOptions.roomType]); // Add dependencies if needed

 // Specific handler for ConfigurationToggleButtonGroup
 const handleConfigurationChange = useCallback((configKey, value) => {
    setFormData(prev => ({
        ...prev,
        configurationHouse: {
            ...prev.configurationHouse,
            [configKey]: {
                ...prev.configurationHouse[configKey],
                number: parseInt(value.replace('+', '')) || 0, // Handle "5+" etc.
            },
        },
    }));
     // Clear error for the specific config number
     setErrors(prev => ({
       ...prev,
       configurationHouse: {
         ...prev.configurationHouse,
         [configKey]: {
           ...prev.configurationHouse?.[configKey],
           number: '', // Clear the error message for the number field
         },
       },
     }));
 }, []);

  // Image Upload/Remove Handler (using file content directly)
  const handleImageUpdate = useCallback((event, index, type) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64String = reader.result;
          setFormData(prev => {
              const imageKey = type === 'furniture' ? 'furnitureImages' : 'unitImages';
              const newImages = [...prev[imageKey]]; // Get current images array
              // Fill with nulls up to max length if needed (assuming max 3)
               while (newImages.length < 3) { newImages.push(null); }
              newImages[index] = base64String; // Update the specific index
              return { ...prev, [imageKey]: newImages };
          });
          // Clear potential image error
          const errorKey = type === 'furniture' ? 'furnitureImages' : 'unitImages';
          setErrors(prev => ({...prev, [errorKey]: ''}));
      };
      reader.onerror = (error) => {
           console.error("Error reading file:", error);
           toast.error("Failed to read image file.");
      };
      reader.readAsDataURL(file);

  }, []);

  const handleImageRemove = useCallback((index, type) => {
      setFormData(prev => {
          const imageKey = type === 'furniture' ? 'furnitureImages' : 'unitImages';
          const newImages = [...prev[imageKey]];
           while (newImages.length < 3) { newImages.push(null); }
          newImages[index] = null; // Set to null
          // Clean up trailing nulls OPTIONALLY:
          // while (newImages[newImages.length - 1] === null && newImages.length > 0) {
          //    newImages.pop();
          // }
          return { ...prev, [imageKey]: newImages };
      });
  }, []);


  // Furnishing Modal Handlers
  const handleFurnishingChange = useCallback((event) => {
    const newValue = event.target.value;
    setFormData(prev => ({
      ...prev,
      furnishing: newValue,
      comesWithFurniture: newValue !== 'Unfurnished',
      items: newValue === "Unfurnished" ? {} : prev.items, // Reset internal count state
      furniture: newValue === "Unfurnished" ? [] : prev.furniture, // Reset final furniture array
    }));
    setErrors(prev => ({ ...prev, furnishing: "" }));
  }, []);

  const handleQuantityChange = useCallback((itemId, change) => {
    setFormData(prev => {
      const currentCount = (prev.items?.[itemId] || 0) + change;
      const newCount = Math.max(0, currentCount); // Ensure count doesn't go below 0

      const newItems = { ...prev.items, [itemId]: newCount };

      // Update the main 'furniture' array for the API payload
      const newFurniture = configOptions.furniture
         .map(item => ({
            id: item.id,
            count: newItems[item.id] || 0, // Get count from updated 'items'
            name: item.name, // Get name from config
            // Add common/exclusiveAccess if needed, defaulting to false
             common: prev.furniture.find(f => f.id === item.id)?.common ?? false,
             exclusiveAccess: prev.furniture.find(f => f.id === item.id)?.exclusiveAccess ?? false,
         }))
         .filter(item => item.count > 0); // Only include items with count > 0

      return { ...prev, items: newItems, furniture: newFurniture };
    });
  }, [configOptions.furniture]); // Dependency on furniture config

  const handleClearAllFurnishing = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: {}, // Clear internal count state
      furniture: [] // Clear final furniture array
    }));
  }, []);

  // Pet Modal Handler
  const handlePetSelection = useCallback((petId, action) => {
    setFormData(prev => {
      const currentPets = prev.petsAllowed || [];
      let newPets;
      if (action === 'add' && !currentPets.includes(petId)) {
        newPets = [...currentPets, petId];
      } else if (action === 'remove') {
        newPets = currentPets.filter(id => id !== petId);
      } else {
        newPets = currentPets; // No change
      }
      return { ...prev, petsAllowed: newPets };
    });
     setErrors(prev => ({...prev, petsAllowed: ''})); // Clear error on change
  }, []);

  const getPetNameById = useCallback((petId) => {
      return configOptions.pets.find(p => p.id === petId)?.name || 'Unknown Pet';
  }, [configOptions.pets]);


  // Validation Error Processing
  const handleValidationError = (error) => {
    const validationErrors = {};
    error.inner.forEach((err) => {
      const path = err.path.split('.');
      let current = validationErrors;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] = current[path[i]] || {};
      }
      current[path[path.length - 1]] = err.message;
    });
    setErrors(validationErrors);
     toast.error("Please fix the validation errors.", { /* toast options */ });
  };

  // --- Submit Handler ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // 1. Convert images currently in state (could be File, URL, or Base64) to Base64
      // Make sure formData.furnitureImages and formData.unitImages contain the relevant data
      const furnitureImagesBase64 = await convertFilesToBase64(formData.furnitureImages);
      const unitImagesBase64 = await convertFilesToBase64(formData.unitImages);


      // 2. Transform data for API/Validation
      const apiData = transformFormDataForApi(formData, preferences, furnitureImagesBase64, unitImagesBase64);
        if (isEditMode && row?.listingId) {
            apiData.listingId = row.listingId; // Add listingId for update
        }

      console.log("Data prepared for API:", apiData);

      // 3. Validate
       try {
          await validationSchema.validate(apiData, { abortEarly: false });
       } catch (validationError) {
           if (validationError.name === 'ValidationError') {
               handleValidationError(validationError);
           } else {
               console.error("Unexpected validation error:", validationError);
               toast.error("An unexpected validation error occurred.", { /* toast options */ });
           }
           setIsLoading(false); // Stop loading on validation failure
           return; // Prevent API call
       }


      // 4. API Call
      let response;
      if (isEditMode) {
        response = await updateListingFunction(apiData);
      } else {
        response = await addListingFunction(apiData);
      }

      // 5. Handle Response
      console.log("API Response:", response); // Log the raw response
      // Adjust success check based on actual API response structure
      if (response?.data?.status?.code === 200 || response?.status === 200 || response?.statusCode === 200) {
        toast.success(response?.data?.status?.message || "Listing saved successfully!", { /* toast options */ });
        navigate(`/web/admin/home`); // Redirect on success
      } else {
         // Handle API errors gracefully (e.g., duplicate entry, server error)
        const errorMessage = response?.data?.status?.message || response?.message || "Failed to save listing. Please try again.";
        toast.error(errorMessage, { /* toast options */ });
        // Optionally parse specific API errors and set them in the 'errors' state
         if (response?.data?.errors) {
             setErrors(response.data.errors); // If API returns errors in Yup format
         }
      }
    } catch (error) {
      console.error("Error during submission:", error);
       // Handle network errors or unexpected exceptions
       const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
       toast.error(message, { /* toast options */ });
       // Set a general API error if needed
       setErrors(prev => ({ ...prev, apiError: message }));
    } finally {
      setIsLoading(false);
    }
  };

   // Helper to get nested error messages safely
   const getError = (path) => {
       const keys = path.split('.');
       let current = errors;
       for (const key of keys) {
           if (current && typeof current === 'object' && key in current) {
               current = current[key];
           } else {
               return undefined; // Path doesn't exist in errors object
           }
       }
       return typeof current === 'string' ? current : undefined; // Return only if it's a string message
   };


  // --- Render ---
  if (isFetchingConfig) {
     return <GradientBox><CircularProgress /></GradientBox>; // Show loading indicator while config loads
  }

  return (
    <GradientBox>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#10552F' }}>
         {isEditMode ? "Edit Listing" : "Add Listing"}
      </Typography>

      <FormCard>
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* --- Basic Details --- */}
          <Box>
             <SelectionButtonGroup
                label="Listing Type"
                name="listingType" // Added name
                options={ListingTypeOptions}
                selectedValue={formData.listingType}
                onChange={(value) => handleSelectionChange('listingType', value)} // Use specific handler
                error={!!getError('listingType')}
                errorText={getError('listingType')}
            />

             <SelectionButtonGroup
                label="Select Property Type"
                name="propertyType"
                options={configOptions.propertyType} // Use fetched options
                selectedValue={formData.propertyType}
                onChange={(value) => handleSelectionChange('propertyType', value)}
                error={!!getError('propertyType')}
                errorText={getError('propertyType')}
            />

            <SelectionButtonGroup
                label="Select Unit Type"
                name="unitType"
                options={configOptions.unitType}
                selectedValue={formData.unitType}
                onChange={(value) => handleSelectionChange('unitType', value)}
                error={!!getError('unitType')}
                errorText={getError('unitType')}
            />

             {formData.listingType === "room" && ( // Conditional rendering based on state
                <SelectionButtonGroup
                    label="Select Room Type"
                    name="roomType"
                    options={configOptions.roomType}
                    selectedValue={formData.roomType}
                    onChange={(value) => handleSelectionChange('roomType', value)}
                    error={!!getError('roomType')}
                    errorText={getError('roomType')}
                 />
             )}

            <TextField fullWidth margin="normal" label="Title *" name="title" value={formData.title} onChange={handleChange} error={!!getError('title')} helperText={getError('title')} />
            <TextField fullWidth margin="normal" label="Property Name" name="propertyName" value={formData.propertyName} onChange={handleChange} error={!!getError('propertyName')} helperText={getError('propertyName')} />
            <TextField fullWidth margin="normal" multiline rows={3} label="Description *" name="description" value={formData.description} onChange={handleChange} error={!!getError('description')} helperText={getError('description')} />
          </Box>

          {/* --- Location Details --- */}
          <Box>
             <Typography variant="h6" sx={{ color: "#10552F", mb: 1 }}>Location Details</Typography>
                <Grid container alignItems="center" spacing={2} marginTop={1}>
                 <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Zip *" name="location.postalCode" value={formData.location.postalCode} onChange={handleChange} inputProps={{ maxLength: 5 }} error={!!getError('location.postalCode')} helperText={getError('location.postalCode')} />
                 </Grid>
                 <Grid item xs={12} md={6}>
                     <Tooltip title={formData.location.postalCode ? "" : "Auto-filled from Zip"} >
                        <TextField disabled fullWidth label="Country *" name="location.country" value={formData.location.country || 'USA'} InputLabelProps={{ shrink: !!formData.location.country }} error={!!getError('location.country')} helperText={getError('location.country')} />
                     </Tooltip>
                 </Grid>
                 <Grid item xs={12} md={6}>
                     <Tooltip title={formData.location.postalCode ? "" : "Auto-filled from Zip"} >
                         <TextField disabled fullWidth label="State *" name="location.state" value={formData.location.state} InputLabelProps={{ shrink: !!formData.location.state }} error={!!getError('location.state')} helperText={getError('location.state')} />
                      </Tooltip>
                 </Grid>
                 <Grid item xs={12} md={6}>
                     <Tooltip title={formData.location.postalCode ? "" : "Auto-filled from Zip"} >
                         <TextField disabled fullWidth label="City *" name="location.city" value={formData.location.city} InputLabelProps={{ shrink: !!formData.location.city }} error={!!getError('location.city')} helperText={getError('location.city')} />
                      </Tooltip>
                 </Grid>
                 <Grid item xs={12} md={6}>
                    <TextField fullWidth margin="normal" label="Address Line 1 *" name="location.address" value={formData.location.address} onChange={handleChange} error={!!getError('location.address')} helperText={getError('location.address')} />
                 </Grid>
                 <Grid item xs={12} md={6}>
                    <TextField fullWidth margin="normal" label="Address Line 2" name="location.address2" value={formData.location.address2} onChange={handleChange} error={!!getError('location.address2')} helperText={getError('location.address2')} />
                 </Grid>
                  {formData.listingType === "room" && (
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth margin="normal" label="Room Number" name="location.roomNumber" value={formData.location.roomNumber} onChange={handleChange} error={!!getError('location.roomNumber')} helperText={getError('location.roomNumber')} />
                    </Grid>
                  )}
             </Grid>
          </Box>

          {/* --- Property Details --- */}
           <Box>
                <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>Property Details</Typography>
                 <Grid container spacing={3}>
                     <Grid item xs={12} md={6}>
                        <MultiSelectCheckbox
                            label="Amenities"
                            name="amenities"
                            options={configOptions.amenities}
                            value={formData.amenities}
                            onChange={handleChange} // Use generic handler for multi-select array
                            error={!!getError('amenities')}
                            errorText={getError('amenities')}
                            required={true}
                         />
                    </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Available From *" name="availability.startDate" type="date" InputLabelProps={{ shrink: true }} value={formData.availability.startDate} onChange={handleChange} error={!!getError('availability.startDate')} helperText={getError('availability.startDate')} />
                    </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Available Till *" name="availability.endDate" type="date" InputLabelProps={{ shrink: true }} value={formData.availability.endDate} onChange={handleChange} error={!!getError('availability.endDate')} helperText={getError('availability.endDate')} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel control={ <Checkbox name="availability.flexible" checked={formData.availability?.flexible || false} onChange={handleChange} /> } label="Date Flexible" />
                    </Grid>

                     {/* Use ConfigurationToggleButtonGroup */}
                      <ConfigurationToggleButtonGroup
                        label="Number of Bedrooms"
                        value={formData.configurationHouse?.bedrooms?.number}
                        onChange={(value) => handleConfigurationChange('bedrooms', value)}
                        error={!!getError('configurationHouse.bedrooms.number')}
                        errorText={getError('configurationHouse.bedrooms.number')}
                        required={true}
                       />
                       <ConfigurationToggleButtonGroup
                        label="Number of Bathrooms"
                        value={formData.configurationHouse?.bathrooms?.number}
                        onChange={(value) => handleConfigurationChange('bathrooms', value)}
                        error={!!getError('configurationHouse.bathrooms.number')}
                        errorText={getError('configurationHouse.bathrooms.number')}
                         required={true}
                       />
                       <ConfigurationToggleButtonGroup
                         label="Number of Balconies"
                         value={formData.configurationHouse?.balcony?.number}
                         onChange={(value) => handleConfigurationChange('balcony', value)}
                         error={!!getError('configurationHouse.balcony.number')}
                         errorText={getError('configurationHouse.balcony.number')}
                         required={true} // Or false if optional
                       />
                        {/* Check if this should be Kitchen or Parking based on original state/label */}
                        <ConfigurationToggleButtonGroup
                          label="Number of Kitchens" // Assuming kitchen based on original label
                          value={formData.configurationHouse?.kitchen?.number}
                          onChange={(value) => handleConfigurationChange('kitchen', value)}
                          error={!!getError('configurationHouse.kitchen.number')}
                          errorText={getError('configurationHouse.kitchen.number')}
                          required={true}
                       />
                       {/* Add Parking if needed */}
                       {/* <ConfigurationToggleButtonGroup
                          label="Number of Parking"
                          value={formData.configurationHouse?.parking?.number}
                          onChange={(value) => handleConfigurationChange('parking', value)}
                          error={!!getError('configurationHouse.parking.number')}
                          errorText={getError('configurationHouse.parking.number')}
                          required={false} // Adjust requirement
                       /> */}

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}> Pets Allowed <span className="text-red-900">*</span> </Typography>
                        <ToggleButtonGroup value={formData.arePetsAllowed} exclusive onChange={(_, value) => { if (value !== null) setFormData(prev => ({ ...prev, arePetsAllowed: value })); setErrors(prev => ({...prev, arePetsAllowed: ''})); }} fullWidth >
                            <ToggleButton value={false}>Not Allowed</ToggleButton>
                            <ToggleButton value={true}>Allowed</ToggleButton>
                        </ToggleButtonGroup>
                         {getError('arePetsAllowed') && <FormHelperText error>{getError('arePetsAllowed')}</FormHelperText>}
                    </Grid>
                     {formData.arePetsAllowed && (
                         <Grid item xs={12}>
                            <Box borderRadius="8px" mt={2} p={2} bgcolor="#f0f7f2">
                                <Typography variant="subtitle1" fontWeight="bold"> Pets Included <span className="text-red-900">*</span> </Typography>
                                {formData.petsAllowed?.length > 0 ? (
                                    <Box sx={{ mt: 1, mb: 2 }}>
                                     {formData.petsAllowed.map((petId) => (
                                        <Typography key={petId} component="span" sx={{ display: "inline-block", backgroundColor: "#23BB67", color: "white", padding: "4px 12px", borderRadius: "16px", margin: "4px", fontSize: "0.875rem" }}>
                                            {getPetNameById(petId)}
                                        </Typography>
                                     ))}
                                    </Box>
                                ) : ( <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2 }} > No pets selected </Typography> )}
                                <Button onClick={() => setOpenPetModel(true)}>Add/Edit Pets</Button>
                                 {getError('petsAllowed') && <FormHelperText error>{getError('petsAllowed')}</FormHelperText>}
                            </Box>
                         </Grid>
                     )}

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#10552F", fontWeight: 500 }}> Furnishing Status <span className="text-red-900">*</span> </Typography>
                        <ToggleButtonGroup value={formData.furnishing} exclusive onChange={(_, value) => { if (value !== null) handleFurnishingChange({ target: { value } }); }} fullWidth >
                            <ToggleButton value="Unfurnished">Unfurnished</ToggleButton>
                            <ToggleButton value="Semi-Furnished">Semi-Furnished</ToggleButton>
                            <ToggleButton value="Furnished">Furnished</ToggleButton>
                        </ToggleButtonGroup>
                         {getError('furnishing') && <FormHelperText error>{getError('furnishing')}</FormHelperText>}
                    </Grid>

                     {formData.furnishing !== "Unfurnished" && (
                        <Grid item xs={12}>
                             <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
                                <Typography variant="subtitle1" fontWeight="bold"> Furniture Included <span className="text-red-900">*</span> </Typography>
                                 <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2, mt: 1, mb: 2 }}>
                                    {formData.furniture?.length > 0 ? formData.furniture.map(item => (
                                        <Typography key={item.id} sx={{ color: "#333", fontWeight: 500, mb: 1 }}>
                                            {item.name} ({item.count})
                                            {/* Add toggles for common/exclusiveAccess here if needed */}
                                        </Typography>
                                    )) : <Typography variant="body2" color="text.secondary">No furniture added yet.</Typography>}
                                </Box>
                                <Button onClick={() => setOpenFurnishingModal(true)} sx={{ mt: 1 }}> Add/Edit Furniture </Button>
                                {getError('furniture') && <FormHelperText error>{getError('furniture')}</FormHelperText>}
                            </Box>
                        </Grid>
                     )}

                    <Grid item xs={12}>
                        {/* Use ImageUploadGrid for Furniture Images */}
                         <ImageUploadGrid
                             label="Furniture Images"
                             images={formData.furnitureImages} // Pass the array directly
                             onImageUpload={handleImageUpdate}
                             onImageRemove={handleImageRemove}
                             maxImages={3}
                             imageType="furniture"
                             error={!!getError('furnitureImages')}
                             errorText={getError('furnitureImages')}
                             required={formData.furnishing !== 'Unfurnished'} // Required if furnished/semi
                         />
                    </Grid>
                 </Grid>
           </Box>


          {/* --- Pricing Details --- */}
          <Box>
             <Typography variant="h6" sx={{ color: "#10552F", mb: 3 }}>Pricing Details</Typography>
             <TextField fullWidth margin="normal" label="Expected Rent ($) *" name="rentAmount" type="number" value={formData.rentAmount} onChange={handleChange} error={!!getError('price.rent.amount')} helperText={getError('price.rent.amount')} />
             <TextField fullWidth margin="normal" label="Security Deposit ($) *" name="depositAmount" type="number" value={formData.depositAmount} onChange={handleChange} error={!!getError('price.deposit.amount')} helperText={getError('price.deposit.amount')} />
             <TextField fullWidth margin="normal" label="Other Fees ($)" name="subleaseCharges" type="number" value={formData.subleaseCharges} onChange={handleChange} error={!!getError('price.fees.cleaning.amount')} helperText={getError('price.fees.cleaning.amount')} />
             <TextField fullWidth margin="normal" label="Contact Phone Number *" name="mobile" type="tel" inputProps={{ maxLength: 10, pattern: "[0-9]*" }} value={formData.mobile} onChange={handleChange} error={!!getError('mobile')} helperText={getError('mobile')} />
             <FormControlLabel control={ <Checkbox name="price.flexible" checked={formData.price?.flexible || false} onChange={handleChange} /> } label="Price Negotiable" />
          </Box>

          {/* --- Property Images --- */}
          <Box>
            {/* Use ImageUploadGrid for Property Images */}
            <ImageUploadGrid
                label="Property Images"
                images={formData.unitImages} // Pass the array directly
                onImageUpload={handleImageUpdate}
                onImageRemove={handleImageRemove}
                maxImages={3}
                imageType="unit" // Changed type to 'unit' to match state key
                 error={!!getError('unitImages')}
                 errorText={getError('unitImages')}
                 required={true}
             />
          </Box>

            {/* --- Roommate Preferences (Example using MultiSelectCheckbox) --- */}
            {/* Keep this section if the UI requires it, otherwise remove if preferences are handled differently */}
           {/* <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: "#10552F", mb: 2 }}> Roommate Preferences <span className="text-red-900">*</span> </Typography>
               {configOptions.roommatePreferencesOptions?.map((prefGroup) => ( // Use fetched options structure
                 <MultiSelectCheckbox
                    key={prefGroup.key} // Assuming key is unique like 'Gender', 'Ethnicity'
                    label={prefGroup.key}
                    name={`preferences.${prefGroup.key.toLowerCase()}`} // e.g., preferences.gender
                    options={prefGroup.values?.map(v => ({ id: v, name: v })) || []} // Map values to id/name for component
                    value={preferences[prefGroup.key.toLowerCase()] || []} // Access state using lowercase key
                    onChange={(e) => {
                        const { name, value } = e.target;
                        const prefKey = name.split('.')[1]; // Get 'gender', 'ethnicity', etc.
                        setPreferences(prev => ({ ...prev, [prefKey]: value }));
                        setErrors(prev => ({...prev, roommatePreferences: ''})); // Clear general error
                    }}
                    error={!!getError('roommatePreferences')} // General error for the section
                    errorText={getError('roommatePreferences')}
                 />
               ))}
           </Box> */}


          {/* --- Submit Button --- */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" disabled={isLoading} sx={{ backgroundColor: "#23BB67", "&:hover": { backgroundColor: "#10552F" }, px: 4, py: 1.5 }} >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Update Listing" : "Submit Listing")}
            </Button>
          </Box>
        </Box>

        {/* --- Modals --- */}

        {/* Furnishing Modal */}
        {openFurnishingModal && (
          <Modal open={openFurnishingModal} onClose={() => setOpenFurnishingModal(false)} aria-labelledby="furnishing-modal-title">
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: 600, width: "90%", maxHeight: "80vh", overflowY: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography id="furnishing-modal-title" variant="h6" component="h2" sx={{ color: "#10552F", fontWeight: 600 }}> Furnishing Details </Typography>
                <IconButton onClick={() => setOpenFurnishingModal(false)} aria-label="Close furnishing modal" sx={{ color: 'red' }}> <RemoveIcon /> </IconButton>
              </Box>
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                 <InputLabel>Furnishing Status</InputLabel>
                 <Select name="furnishing" value={formData.furnishing} onChange={handleFurnishingChange}>
                     <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                     <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                     <MenuItem value="Furnished">Furnished</MenuItem>
                 </Select>
              </FormControl>
              {formData.furnishing !== "Unfurnished" && (
                 <>
                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                         <Typography variant="subtitle1" sx={{ color: "#10552F", fontWeight: 500 }}> Available Items </Typography>
                         <Button onClick={handleClearAllFurnishing} sx={{ color: "#23BB67" }}> Clear all </Button>
                     </Box>
                     <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}>
                         {configOptions.furniture?.map(item => (
                             <ItemQuantitySelector
                                key={item.id}
                                item={item}
                                quantity={formData.items?.[item.id] || 0}
                                onQuantityChange={handleQuantityChange}
                             />
                         ))}
                     </Box>
                 </>
              )}
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                 <Button variant="contained" onClick={() => setOpenFurnishingModal(false)} sx={{ backgroundColor: "#23BB67", '&:hover': { backgroundColor: "#10552F" } }}>Done</Button>
               </Box>
            </Box>
          </Modal>
        )}

        {/* Pet Modal */}
        {openPetModel && (
            <Modal open={openPetModel} onClose={() => setOpenPetModel(false)} aria-labelledby="pet-modal-title">
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: 600, width: "90%", maxHeight: "80vh", overflowY: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                         <Typography id="pet-modal-title" variant="h6" component="h2" sx={{ color: "#10552F", fontWeight: 600 }}> Add Pets </Typography>
                         <IconButton onClick={() => setOpenPetModel(false)} aria-label="Close pet modal" sx={{ color: 'red' }}> <RemoveIcon /> </IconButton>
                    </Box>
                    {/* Available Pets */}
                    <Box sx={{ mb: 4 }}>
                         <Typography variant="subtitle1" sx={{ mb: 2, color: "#10552F" }}> Available Pets </Typography>
                         <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}>
                            {configOptions.pets?.map((pet) => (
                                <Grid container key={pet.id} alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: "1px solid #e0e0e0", "&:last-child": { borderBottom: "none" } }} >
                                    <Typography sx={{ color: "#333", fontWeight: 500 }}> {pet.name} </Typography>
                                    <IconButton onClick={() => handlePetSelection(pet.id, 'add')} disabled={formData.petsAllowed?.includes(pet.id)} sx={{ color: "#23BB67", "&:disabled": { color: 'grey' } }} aria-label={`Add ${pet.name}`} >
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            ))}
                         </Box>
                    </Box>
                    {/* Selected Pets */}
                     {formData.petsAllowed?.length > 0 && (
                         <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: "#10552F" }}> Selected Pets </Typography>
                            <Box sx={{ backgroundColor: "#f8f9fa", borderRadius: 2, p: 2 }}>
                                {formData.petsAllowed.map((petId) => (
                                     <Grid container key={petId} alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: "1px solid #e0e0e0", "&:last-child": { borderBottom: "none" } }} >
                                        <Typography sx={{ color: "#333", fontWeight: 500 }}> {getPetNameById(petId)} </Typography>
                                        <IconButton onClick={() => handlePetSelection(petId, 'remove')} sx={{ color: "red" }} aria-label={`Remove ${getPetNameById(petId)}`} >
                                            <RemoveIcon />
                                        </IconButton>
                                     </Grid>
                                ))}
                            </Box>
                         </Box>
                     )}
                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                         <Button variant="contained" onClick={() => setOpenPetModel(false)} sx={{ backgroundColor: "#23BB67", '&:hover': { backgroundColor: "#10552F" } }}>Done</Button>
                     </Box>
                </Box>
            </Modal>
        )}

      </FormCard>
    </GradientBox>
  );
}

