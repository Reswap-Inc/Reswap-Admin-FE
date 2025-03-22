import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepButton,
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
  FormGroup
  // Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { AddPhotoAlternate as AddPhotoAlternateIcon } from "@mui/icons-material";
import { useState } from 'react';
const steps = [
  'Basic Details',
  'Property Details',
  // 'Furnishing Details',
  'Photos and Pricing'
];
 
// Custom styled components
const GradientBox = styled(Box)({
  background: '#ffffff',
  minHeight: '100vh',
  padding: '2rem',
  color: '#333',
});

const FormCard = styled(Box)({
  background: '#ffffff',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  margin: '1rem auto',
  width: '100%',
});

const CustomStepper = styled(Stepper)({
  '& .MuiStepLabel-label': {
    color: '#333',
    '&.Mui-active': {
      color: '#23BB67',
    },
    '&.Mui-completed': {
      color: '#10552F',
    },
  },
  '& .MuiStepIcon-root': {
    color: '#e0e0e0',
    '&.Mui-active': {
      color: '#23BB67',
    },
    '&.Mui-completed': {
      color: '#10552F',
    },
  },
});

export default function AddForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [openall, setopenall] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [completed, setCompleted] = React.useState({});
  const [images, setImages] = useState([null, null, null]);

  
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    countryCode: 'us',
    rentAmount: '',
    depositAmount: '',
    propertyType: '', // apartment or townhouse
    feesAmount: '',
    
    petsAllowed: [],
    petsPresent: [],
    
    roomatePreferences: [],
    foodPreferences: [],
    
    configurationHouse: {
      bedrooms: 1,
      bathrooms: 1,
      kitchen: 1,
      balcony: 1
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
      commonStudyArea: false
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
      startDate: '', // YYYYMMDD
      endDate: '', // YYYYMMDD
      flexible: false
    },
    
    roomateDetails: [
      {
        countryCode: '+1',
        phoneNumber: ''
      }
    ]
  });

  const [furnishingItems] = React.useState([
    "Bed",
    "Wardrobe",
    "Study Table",
    "Chair",
    "Fan",
    "AC",
    "TV",
    "Refrigerator",
    "Washing Machine",
    "Sofa"
  ]);
  const handleImageUploadfur = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    const nameParts = name.split('.');
    
    if (nameParts.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0]],
          [nameParts[1]]: value
        }
      }));
    }
  };

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    setActiveStep((prev) => (isLastStep() ? 0 : prev + 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    setCompleted((prev) => ({ ...prev, [activeStep]: true }));
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setFormData({
      title: '',
      description: '',
      address1: '',
      address2: '',
      city: '',
      zip: '',
      countryCode: 'us',
      rentAmount: '',
      depositAmount: '',
      propertyType: '',
      feesAmount: '',
      petsAllowed: [],
      petsPresent: [],
      roomatePreferences: [],
      foodPreferences: [],
      configurationHouse: {
        bedrooms: 1,
        bathrooms: 1,
        kitchen: 1,
        balcony: 1
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
        commonStudyArea: false
      },
      belongingsIncluded: false,
      comesWithFurniture: false,
      furnitureDetails: {},
      furnitureImages: [],
      unitImages: [],
      isOwnedByPropertyManager: false,
      availability: {
        startDate: '',
        endDate: '',
        flexible: false
      },
      roomateDetails: [
        {
          countryCode: '+1',
          phoneNumber: ''
        }
      ]
    });
  };

  const handleImageUpload = (type, files) => {
    const imagePromises = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        [`${type}Images`]: [...prev[`${type}Images`], ...base64Images]
      }));
    });
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index)
    }));
  };

  const handlePropertyTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      propertyType: type
    }));
  };

  const handleFurnishingChange = (event) => {
    setFormData(prev => ({
      ...prev,
      furnishing: event.target.value
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      items: {}
    }));
  };

  const handleQuantityChange = (item, change) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: Math.max(0, (prev.items[item] || 0) + change)
      }
    }));
  };

  const handleAmmenityChange = (ammenity) => {
    setFormData(prev => ({
      ...prev,
      ammenitiesIncluded: {
        ...prev.ammenitiesIncluded,
        [ammenity]: !prev.ammenitiesIncluded[ammenity]
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFurnitureChange = (item, field, value) => {
    setFormData(prev => ({
      ...prev,
      furnitureDetails: {
        ...prev.furnitureDetails,
        [item]: {
          ...prev.furnitureDetails[item],
          [field]: value
        }
      }
    }));
  };

  const handleDateChange = (field, value) => {
    const formattedDate = value ? value.replace(/-/g, '') : '';
    
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: formattedDate
      }
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ color: '#333', backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ color: '#10552F', mb: 3 }}>Select Property Type</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {["Apartment", "Independent House/ Villa", "Shared Room", "Private Room with Shared Bathroom", "Private Room with Private Bathroom"]?.map((type) => (
                <Button
                  key={type}
                  variant={formData.propertyType === type ? "contained" : "outlined"}
                  onClick={() => handlePropertyTypeSelect(type)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor: formData.propertyType === type ? "#23BB67" : "white",
                    color: formData.propertyType === type ? "white" : "#10552F",
                    border: `1px solid ${formData.propertyType === type ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor: formData.propertyType === type ? "#10552F" : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type}
                </Button>
              ))}
            </Box>


            <Typography variant="h6" sx={{ color: '#10552F', mb: 3 }}>Select Unit Type</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
              {["1BHK", "2BHK", "3BHK", "4BHK"]?.map((type) => (
                <Button
                  key={type}
                  variant={formData.propertyType === type ? "contained" : "outlined"}
                  onClick={() => handlePropertyTypeSelect(type)}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor: formData.propertyType === type ? "#23BB67" : "white",
                    color: formData.propertyType === type ? "white" : "#10552F",
                    border: `1px solid ${formData.propertyType === type ? "#23BB67" : "#10552F"}`,
                    "&:hover": {
                      backgroundColor: formData.propertyType === type ? "#10552F" : "rgba(35, 187, 103, 0.1)",
                    },
                  }}
                >
                  {type}
                </Button>
              ))}
            </Box>
            {/* Location Details */}
            <Typography variant="h6">Location Details</Typography>
            <TextField fullWidth margin="normal" label="City" name="city" value={formData.city} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Address Line 1" name="address1" value={formData.address1} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Address Line 2" name="address2" value={formData.address2} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Room Number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />

            {/* Nearby Places */}
            <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
              <Typography variant="subtitle1" fontWeight="bold">Places near you</Typography>
              <Typography variant="body2">Mitchel Park - 1 km</Typography>
              <Typography variant="body2">Mark University - 2 km</Typography>
              <Typography variant="body2">Adams Hospital - 1 km</Typography>
            </Box>
            <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
            <Typography variant="subtitle1" fontWeight="bold">Upload Your Lease Agreement</Typography>
            <TextField fullWidth margin="normal"  type='file' name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ width: '100%', p: 3, bgcolor: "#ffffff", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#10552F', fontWeight: 600 }}>
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
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23BB67' } }}
                  >
                    <MenuItem value="Male">Male Only</MenuItem>
                    <MenuItem value="Female">Female Only</MenuItem>
                    <MenuItem value="Students">Students Only</MenuItem>
                    <MenuItem value="Professionals">Professionals Only</MenuItem>
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
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23BB67' } }}
                  >
                    <MenuItem value="Vegetarian">Vegetarian Only</MenuItem>
                    <MenuItem value="NonVegetarian">Non-Vegetarian Allowed</MenuItem>
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
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23BB67' } }}
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
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#23BB67' } }}
                />
              </Grid>
              <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={3} display="flex" flexDirection="column" gap={2}>
          <TextField
            type="number"
            label="Enter Custom Value"
           
            onChange={handleChange}
            inputProps={{ min: 6 }} // Only allows numbers
          />
          <Button variant="contained" onClick={()=>setOpen(false)}>
            Confirm
          </Button>
        </Box>
      </Dialog>
            <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
                  Number of Bedrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.bedrooms}
                  exclusive
                  onChange={(_, value) => setFormData({ ...formData, bedrooms: value })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#23BB67',
                        color: 'white',
                        '&:hover': { backgroundColor: '#10552F' }
                      }
                    }
                  }}
                >
                  {["0","1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>{item}</ToggleButton>
                  ))}
                  
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
                  Number of Bathrooms
                </Typography>
                <ToggleButtonGroup
                  value={formData.bathrooms}
                  exclusive
                  onChange={(_, value) => setFormData({ ...formData, bathrooms: value })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#23BB67',
                        color: 'white',
                        '&:hover': { backgroundColor: '#10552F' }
                      }
                    }
                  }}
                >
                  {["0","1", "2", "3", "4", "5+"].map((item) => (
                    <ToggleButton key={item} value={item}>{item}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
                  Number of Balconies
                </Typography>
                <ToggleButtonGroup
                  value={formData.balconies}
                  exclusive
                  onChange={(_, value) => setFormData({ ...formData, balconies: value })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#23BB67',
                        color: 'white',
                        '&:hover': { backgroundColor: '#10552F' }
                      }
                    }
                  }}
                >
                  {["0","1", "2", "3", "4", "5+"]?.map((item) => (
                    <ToggleButton key={item} value={item}>{item}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
                  Car Parking
                </Typography>
                <ToggleButtonGroup
                  value={formData.parking}
                  exclusive
                  onChange={(_, value) => setFormData({ ...formData, parking: value })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#23BB67',
                        color: 'white',
                        '&:hover': { backgroundColor: '#10552F' }
                      }
                    }
                  }}
                >
                  {["0","1", "2", "3", "4", "5+"]?.map((item) => (
                    <ToggleButton key={item} value={item}>{item}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
    Pets
  </Typography>
  <ToggleButtonGroup
    value={formData.petsAllowed}
    exclusive
    onChange={(_, value) => setFormData({ ...formData, petsAllowed: value })}
    fullWidth
    sx={{
      display: 'flex', // Ensures it takes full width
      justifyContent: 'center',
      '& .MuiToggleButton-root': {
        flex: 1, // Ensures buttons take equal width
        '&.Mui-selected': {
          backgroundColor: '#23BB67',
          color: 'white',
          '&:hover': { backgroundColor: '#10552F' }
        }
      }
    }}
  >
    <ToggleButton value="Not Allowed">Not Allowed</ToggleButton>
    <ToggleButton value="Allowed">Allowed</ToggleButton>
  </ToggleButtonGroup>
</Grid>

              <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
              <Typography variant="subtitle1" fontWeight="bold">Pets Include</Typography>
              <Button >Add More</Button>
            </Box>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#10552F', fontWeight: 500 }}>
                Select Property Type
                </Typography>
                <ToggleButtonGroup
                  value={formData.furnishing}
                  exclusive
                  onChange={(_, value) => setFormData({ ...formData, furnishing: value })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#23BB67',
                        color: 'white',
                        '&:hover': { backgroundColor: '#10552F' }
                      }
                    }
                  }}
                >
                  <ToggleButton value="Unfurnished">Unfurnished</ToggleButton>
                  <ToggleButton value="Semi-Furnished">Semi-Furnished</ToggleButton>
                  <ToggleButton value="Furnished">Furnished</ToggleButton>
                </ToggleButtonGroup>

              </Grid>
              <Box mt={2} p={2} bgcolor="#f0f7f2" borderRadius="8px">
              <Typography variant="subtitle1" fontWeight="bold">Furniture Includes</Typography>
              <Button onClick={()=>setopenall((prev)=>!prev)}>Add More</Button>
              {furnishingItems}
            </Box>
            </Grid>
            <Box sx={{ p: 2 }}>
      <Typography variant="h6">Furniture Images</Typography>
      <Grid container spacing={2}>
        {images?.map((image, index) => (
          <Grid item xs={4} key={index}>
            <Box
              sx={{
                width: 120,
                height: 120,
                border: "2px dashed #4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e8f5e9",
                borderRadius: 2,
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => document.getElementById(`upload-${index}`).click()}
            >
              {image ? (
                <img
                  src={image}
                  alt={`uploaded-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <IconButton component="span">
                  <AddPhotoAlternateIcon fontSize="large" color="success" />
                </IconButton>
              )}
              <input
                type="file"
                id={`upload-${index}`}
                accept="image/*"
                hidden
                onChange={(event) => handleImageUploadfur(event, index)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
          </Box>
        );
      case 7:
        return (
          <Box sx={{ 
            maxWidth: 600, 
            margin: "auto", 
            padding: 4, 
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#10552F', fontWeight: 600 }}>
              Furnishing Details
            </Typography>

            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel>Furnishing Status</InputLabel>
              <Select 
                name="furnishing" 
                value={formData.furnishing} 
                onChange={handleFurnishingChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#23BB67',
                    '&:hover': { borderColor: '#10552F' }
                  }
                }}
              >
                <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                <MenuItem value="Furnished">Furnished</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#10552F', fontWeight: 500 }}>
                Available Items
              </Typography>
              <Button 
                onClick={handleClearAll}
                sx={{ 
                  color: '#23BB67',
                  '&:hover': { 
                    color: '#10552F',
                    backgroundColor: 'rgba(35, 187, 103, 0.1)'
                  }
                }}
              >
                Clear all
              </Button>
            </Box>

            <Box sx={{ 
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              p: 2
            }}>
              {furnishingItems?.map((item) => (
                <Grid 
                  container 
                  key={item} 
                  alignItems="center" 
                  justifyContent="space-between" 
                  sx={{ 
                    py: 1.5,
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Typography sx={{ color: '#333', fontWeight: 500 }}>{item}</Typography>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    sx={{ 
                      backgroundColor: '#ffffff',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      px: 1
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item, -1)}
                      sx={{ 
                        color: '#23BB67',
                        '&:hover': { backgroundColor: 'rgba(35, 187, 103, 0.1)' }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                      {formData.items?.[item] || 0}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item, 1)}
                      sx={{ 
                        color: '#23BB67',
                        '&:hover': { backgroundColor: 'rgba(35, 187, 103, 0.1)' }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: "#ffffff" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Expected Rent ($)"
              name="expectedRent"
              value={formData.expectedRent}
              onChange={handleChange}
              type="number"
            />
            <FormControlLabel
              control={<Checkbox name="rentNegotiable" checked={formData.rentNegotiable} onChange={handleChange} />}
              label="Price Negotiable"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Security Deposit ($)"
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              type="number"
            />
            <FormControlLabel
              control={<Checkbox name="depositNegotiable" checked={formData.depositNegotiable} onChange={handleChange} />}
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
              control={<Checkbox name="transferNegotiable" checked={formData.transferNegotiable} onChange={handleChange} />}
              label="Price Negotiable"
            />

            {/* Image Upload Section */}
            <Box>
              <input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                  Upload Images
                </Button>
              </label>
              {/* Image Preview Grid */}
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {formData.propertyImages?.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <img src={URL.createObjectURL(image)} alt={image.name} style={{ width: '100%', height: 'auto' }} />
                      <Button
                        sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                        onClick={() => handleImageRemove(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <GradientBox>
      <FormCard>
        <CustomStepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </CustomStepper>
        <div>
          {allStepsCompleted() ? (
            <Typography sx={{ mt: 2, mb: 1, color: '#10552F' }}>
              All steps completed - you're finished
            </Typography>
          ) : (
            <>
              <Typography sx={{ mt: 2, mb: 1, color: '#10552F' }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button 
                  color="inherit" 
                  disabled={activeStep === 0} 
                  onClick={handleBack} 
                  sx={{ 
                    mr: 1,
                    color: '#10552F',
                    '&:disabled': { color: 'rgba(16, 85, 47, 0.3)' }
                  }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button 
                  onClick={handleNext} 
                  sx={{ 
                    mr: 1,
                    backgroundColor: '#23BB67',
                    color: 'white',
                    '&:hover': { backgroundColor: '#10552F' }
                  }}
                >
                  Next
                </Button>
                <Button 
                  onClick={handleComplete}
                  sx={{ 
                    backgroundColor: '#10552F',
                    color: 'white',
                    '&:hover': { backgroundColor: '#23BB67' }
                  }}
                >
                  {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                </Button>
              </Box>

              {openall&&<Modal open={openall} onClose={()=>setopenall(false)}>
              <Box  sx={{
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
        }}>
               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#10552F", fontWeight: 600 }}>
            Furnishing Details
          </Typography>
          <Button onClick={()=>setopenall(false)} sx={{ minWidth: "32px", fontSize: "18px", color: "red" }}>
            ✖
          </Button></Box>
                <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                  <InputLabel>Furnishing Status</InputLabel>
                  <Select 
                    name="furnishing" 
                    value={formData.furnishing} 
                    onChange={handleFurnishingChange}
                    sx={{ 
                      '& .MuiOutlinedInput-notchedOutline': { 
                        borderColor: '#23BB67',
                        '&:hover': { borderColor: '#10552F' }
                      }
                    }}
                  >
                    <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                    <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                    <MenuItem value="Furnished">Furnished</MenuItem>
                  </Select>
                </FormControl>
    
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#10552F', fontWeight: 500 }}>
                    Available Items
                  </Typography>
                  <Button 
                    onClick={handleClearAll}
                    sx={{ 
                      color: '#23BB67',
                      '&:hover': { 
                        color: '#10552F',
                        backgroundColor: 'rgba(35, 187, 103, 0.1)'
                      }
                    }}
                  >
                    Clear all
                  </Button>
                </Box>
    
                <Box sx={{ 
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  p: 2
                }}>
                  {furnishingItems?.map((item) => (
                    <Grid 
                      container 
                      key={item} 
                      alignItems="center" 
                      justifyContent="space-between" 
                      sx={{ 
                        py: 1.5,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Typography sx={{ color: '#333', fontWeight: 500 }}>{item}</Typography>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        sx={{ 
                          backgroundColor: '#ffffff',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          px: 1
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, -1)}
                          sx={{ 
                            color: '#23BB67',
                            '&:hover': { backgroundColor: 'rgba(35, 187, 103, 0.1)' }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                          {formData.items?.[item] || 0}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, 1)}
                          sx={{ 
                            color: '#23BB67',
                            '&:hover': { backgroundColor: 'rgba(35, 187, 103, 0.1)' }
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
             }
            </>
          )}
        </div>
      </FormCard>
    </GradientBox>
  );
}
