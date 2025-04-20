
// Okay, let's simplify the AddListing component by extracting repetitive JSX into reusable components and streamlining some logic, while preserving all functionality and error handling.
// 1. Create Reusable Components:
// We'll create components for:
// SelectionButtonGroup: Handles the styled buttons for selecting single options (like Property Type, Unit Type).
// ConfigurationToggleButtonGroup: Handles the toggle button groups for numbers (Bedrooms, Bathrooms, etc.).
// ImageUploadGrid: Handles the grid display and upload logic for images.
// ItemQuantitySelector: (Optional but good for Furnishing Modal) Handles the +/- buttons for item quantities.
// MultiSelectCheckbox: (Optional but good for multi-select fields like Amenities) Handles the multi-select with checkboxes.
// // --- Reusable Components (Place these preferably in separate files) ---

import React from 'react';
import {
  Box, Button, Typography, Grid, IconButton, TextField, ToggleButtonGroup, ToggleButton,
  FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText,
  FormHelperText, CircularProgress
} from '@mui/material';
import { AddPhotoAlternate as AddPhotoAlternateIcon, Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
};

// --- SelectionButtonGroup ---
export const SelectionButtonGroup = ({ label, options, selectedValue, onChange, error, errorText, name }) => (
  <Box mb={3}>
    <Typography variant="h6" sx={{ color: "#10552F", mb: 1 }}>
      {label} {error && <span style={{ color: 'red' }}>*</span>}
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
      {options?.map((option) => (
        <Button
          key={option.id || option.value} // Use id or value as key
          variant={selectedValue === option.value ? "contained" : "outlined"}
          onClick={() => onChange(option.value)} // Pass the value directly
          name={name} // Add name prop for potential form handling
          sx={{
            borderRadius: "20px", textTransform: "none", fontSize: "14px",
            backgroundColor: selectedValue === option.value ? "#23BB67" : "white",
            color: selectedValue === option.value ? "white" : "#10552F",
            border: `1px solid ${selectedValue === option.value ? "#23BB67" : "#10552F"}`,
            "&:hover": {
              backgroundColor: selectedValue === option.value ? "#10552F" : "rgba(35, 187, 103, 0.1)",
            },
          }}
        >
          {option.label || option.name} {/* Use label or name */}
        </Button>
      ))}
    </Box>
    {error && errorText && (
      <Typography sx={{ color: "error.main", mt: 1, fontSize: '0.75rem' }}>
        {errorText}
      </Typography>
    )}
  </Box>
);

// // --- ConfigurationToggleButtonGroup ---
export const ConfigurationToggleButtonGroup = ({ label, value, onChange, options = ["0", "1", "2", "3", "4", "5+"], error, errorText, required = false }) => (
  <Grid item xs={12}>
    <Typography
      variant="subtitle1"
      sx={{ mt: 2, mb: 1, color: error ? "error.main" : "#10552F", fontWeight: 500 }}
    >
      {label} {required && <span className="text-red-900">*</span>}
    </Typography>
    <ToggleButtonGroup
      value={value?.toString() || options[0]} // Default to first option if null/undefined
      exclusive
      onChange={(_, newValue) => {
        if (newValue !== null) { // Ensure a value is selected
           onChange(newValue); // Pass the new value directly
        }
      }}
      fullWidth
    >
      {options.map((item) => (
        <ToggleButton key={item} value={item}>
          {item}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
    {error && errorText && (
      <FormHelperText error>{errorText}</FormHelperText>
    )}
  </Grid>
);

// --- ImageUploadGrid ---
export const ImageUploadGrid = ({ label, images, onImageUpload, onImageRemove, maxImages = 3, imageType, error, errorText, required = false }) => (
  <Box mb={3}>
    <Typography variant="h6" sx={{ color: "#10552F", mb: 2 }}>
      {label} (Max {maxImages}) {required && <span className="text-red-900">*</span>}
    </Typography>
    <Grid container spacing={2}>
      {Array.from({ length: maxImages }).map((_, index) => (
        <Grid item xs={12} sm={4} key={`${imageType}-${index}`}>
          <Box
            sx={{
              width: "100%", height: 200, border: "2px dashed #23BB67", borderRadius: 2,
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "#f8faf8", overflow: "hidden", "&:hover": { borderColor: "#10552F" },
            }}
          >
            {images[index] ? (
              <>
                <img src={images[index]} alt={`${imageType}-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton
                  sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}
                  onClick={() => onImageRemove(index, imageType)}
                  aria-label={`Remove ${imageType} image ${index + 1}`}
                >
                  <RemoveIcon />
                </IconButton>
              </>
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
                onClick={() => document.getElementById(`${imageType}-upload-${index}`)?.click()}
                role="button"
                aria-label={`Upload ${imageType} image ${index + 1}`}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "#23BB67", mb: 1 }} />
                <Typography variant="body2" color="textSecondary">Click to upload</Typography>
              </Box>
            )}
            <input
              type="file"
              id={`${imageType}-upload-${index}`}
              accept="image/*"
              hidden
              onChange={(event) => onImageUpload(event, index, imageType)}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
     {error && errorText && (
      <Typography sx={{ color: "error.main", mt: 1, fontSize: '0.75rem' }}>
        {errorText}
      </Typography>
    )}
  </Box>
);

// // --- MultiSelectCheckbox ---
export const MultiSelectCheckbox = ({ label, name, options, value = [], onChange, error, errorText, required=false }) => (
   <FormControl fullWidth error={error}>
    <InputLabel>{label} {required && <span className="text-red-900">*</span>}</InputLabel>
    <Select
      multiple
      name={name}
      value={value} // Ensure value is always an array
      onChange={onChange}
      input={<OutlinedInput label={label} />}
      renderValue={(selected) =>
        options
          .filter(option => selected.includes(option.id))
          .map(option => option.name)
          .join(', ') || ' ' // Ensure renderValue doesn't receive undefined/null if nothing selected
      }
      MenuProps={MenuProps}
      sx={{"& .MuiOutlinedInput-notchedOutline": { borderColor: "#23BB67" }}}
    >
      {options?.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          <Checkbox checked={value.includes(option.id)} />
          <ListItemText primary={option.name} />
        </MenuItem>
      ))}
    </Select>
    {error && errorText && <FormHelperText>{errorText}</FormHelperText>}
  </FormControl>
);

// // --- ItemQuantitySelector (For Furnishing Modal) ---
export const ItemQuantitySelector = ({ item, quantity, onQuantityChange }) => (
   <Grid
      container
      key={item.id}
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 1.5, borderBottom: "1px solid #e0e0e0", "&:last-child": { borderBottom: "none" } }}
    >
      <Typography sx={{ color: "#333", fontWeight: 500 }}>
        {item.name}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ backgroundColor: "#ffffff", borderRadius: 1, border: "1px solid #e0e0e0", px: 1 }}>
        <IconButton size="small" onClick={() => onQuantityChange(item.id, -1)} sx={{ color: "#23BB67", "&:hover": { backgroundColor: "rgba(35, 187, 103, 0.1)" } }}>
          <RemoveIcon />
        </IconButton>
        <Typography sx={{ mx: 2, minWidth: "30px", textAlign: "center" }}>
          {quantity}
        </Typography>
        <IconButton size="small" onClick={() => onQuantityChange(item.id, 1)} sx={{ color: "#23BB67", "&:hover": { backgroundColor: "rgba(35, 187, 103, 0.1)" } }}>
          <AddIcon />
        </IconButton>
      </Box>
    </Grid>
);
// Use code with caution.
// JavaScript
// 2. Utility Function:
// Move the image conversion logic outside the component.
// --- utils/imageUtils.js (or similar) ---
export const convertImageUrlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
       throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error); // Pass the actual error object
      reader.readAsDataURL(blob);
    });
  } catch (error) {
     console.error("Error fetching or converting image URL to Base64:", error);
     // Decide how to handle: re-throw, return null, return a placeholder?
     // Returning null might be safest if the image isn't critical for the NEXT step.
     return null;
     // Or re-throw: throw error;
  }
};

export const convertFilesToBase64 = async (files) => {
  // Filter out null/undefined files first
  const validFiles = files.filter(file => file);
  if (validFiles.length === 0) {
    return []; // Return empty array if no valid files
  }
  try {
     return await Promise.all(
       validFiles.map(fileOrUrl => {
         // Check if it's already a base64 string
         if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('data:image')) {
           return Promise.resolve(fileOrUrl);
         }
         // Check if it's a URL (needs fetching) - simplified check
         if (typeof fileOrUrl === 'string' && (fileOrUrl.startsWith('http') || fileOrUrl.startsWith('/'))) {
            return convertImageUrlToBase64(fileOrUrl);
         }
         // Assume it's a File object (needs FileReader) - check instanceof File
         if (fileOrUrl instanceof File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(fileOrUrl);
            });
         }
         // If it's none of the above, return null or handle as an error
         console.warn("Unsupported image type for conversion:", fileOrUrl);
         return Promise.resolve(null);
       })
     );
  } catch (error) {
    console.error("Error converting image files/URLs to Base64:", error);
    return []; // Return empty array on error
  }
};