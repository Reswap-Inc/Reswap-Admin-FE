import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Container, Typography, Box, Card, CardContent, CardMedia, Grid, Chip, List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress, Alert, Stack, Avatar, Paper, Popover, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Modal
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BalconyIcon from '@mui/icons-material/Balcony';
import PetsIcon from '@mui/icons-material/Pets';
// import NoPetsIcon from '@mui/icons-material/NoPets';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SellIcon from '@mui/icons-material/Sell';
import GroupIcon from '@mui/icons-material/Group';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BuildIcon from '@mui/icons-material/Build'; // For Utilities
import WeekendIcon from '@mui/icons-material/Weekend'; // For Furniture
import InfoIcon from '@mui/icons-material/Info'; // For General Info
import VisibilityIcon from '@mui/icons-material/Visibility'; // For View Count
import ImageSearchIcon from '@mui/icons-material/ImageSearch'; // Placeholder for images
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import BlockIcon from "@mui/icons-material/Block";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { getListingThunk } from "../network/ListingThunk";
import { updateListingFunction, deleteListingThunk, approveListing } from "../network/ListingThunk";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Assuming you have this thunk
// import { getListingThunk } from "../network/ListingThunk";

// --- Helper Function to format dates ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// --- Helper Function to format boolean values ---
const formatBoolean = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "N/A";
};

// --- Helper Function to format currency ---
const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

const ListingDetails = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteApiMessage, setDeleteApiMessage] = React.useState("");
  const [openmode, setopenmode] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();
  const { detail: currentProperty, loading, error } = useSelector((state) => state.listing);
  const profile = useSelector((state) => state.getProfileSlice?.data);
  const isSuperAdmin = Boolean(profile?.params?.Roles);
  useEffect(() => {
    if (listingId) {
      dispatch(getListingThunk(listingId));
    }
  }, [dispatch, listingId]);

  // ---- Loading State ----
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load property details: {error || 'Unknown error'}
        </Alert>
      </Container>
    );
  }

  // // ---- No Data State ----
  if (!currentProperty) {
    // If not loading and no error, but still no property, means not found or initial state
    if (!loading && !error) {
      return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert severity="warning">Property not found or not loaded yet.</Alert>
        </Container>
      );
    }
    // Avoid rendering further if no data in initial state without loading trigger
    return null;
  }

  const handleActionsOpen = (event) => setAnchorEl(event.currentTarget);
  const handleActionsClose = () => setAnchorEl(null);

  const onSubmitHibernate = async () => {
    try {
      const newStatus = currentProperty?.status === 'active' ? 'inactive' : 'active';
      const form = { listingId: currentProperty?.listingId, status: newStatus };
      const res = await updateListingFunction(form);
      toast.success(res?.data?.status?.message || res?.data?.message || "Listing status updated successfully");
      if (!isSuperAdmin && newStatus === 'active') {
        toast.info("Listing activation request submitted for super admin review.");
      }
      handleActionsClose();
      dispatch(getListingThunk(currentProperty?.listingId)); // Refresh details
    } catch (error) {
      toast.error(error.message || "Failed to update listing status");
    }
  };

  const onSubmitApprove = async () => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can approve listings");
      handleActionsClose();
      return;
    }
    try {
      const form = {
        listingId: currentProperty?.listingId,
        action: "approve"
      };
      const res = await dispatch(approveListing(form));
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "Listing approved successfully");
      handleActionsClose();
      dispatch(getListingThunk(currentProperty?.listingId)); // Refresh details
    } catch (error) {
      toast.error(error.message || "Failed to approve listing");
    }
  };

  const onSubmitReject = async () => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can reject listings");
      handleActionsClose();
      return;
    }
    try {
      const form = {
        listingId: currentProperty?.listingId,
        reason: message,
        action: "reject"
      };
      const res = await dispatch(approveListing(form));
      toast.success(res?.payload?.status?.message || res?.payload?.response?.status?.message || "Listing rejected successfully");
      setMessage("");
      setopenmode(false);
      handleActionsClose();
      dispatch(getListingThunk(currentProperty?.listingId)); // Refresh details
    } catch (error) {
      toast.error(error.message || "Failed to reject listing");
    }
  };

  const handleDelete = async () => {
    if (!isSuperAdmin) {
      toast.error("Only super admins can delete listings");
      handleActionsClose();
      return;
    }
    setDeleting(true);
    setDeleteApiMessage("");
    try {
      const result = await dispatch(deleteListingThunk(currentProperty?.listingId)).unwrap();
      const apiMsg = result?.status?.message || result?.message || "Listing deleted successfully";
      setDeleteApiMessage(apiMsg);
      if (!result?.status?.error && !result?.error) {
        setTimeout(() => {
          setDeleteDialogOpen(false);
          setDeleteApiMessage("");
          navigate('/web/admin/home'); // Go back to listing page after delete
        }, 1500);
      }
    } catch (error) {
      const apiMsg = error?.status?.message || error?.message || "Failed to delete listing";
      setDeleteApiMessage(apiMsg);
    } finally {
      setDeleting(false);
    }
  };

  // ---- Main Content ----
  const fullAddress = [
    currentProperty?.location?.address,
    currentProperty?.location?.address2,
    currentProperty?.location?.roomNumber,
    currentProperty?.location?.city,
    currentProperty?.location?.state,
    currentProperty?.location?.postalCode,
    currentProperty?.location?.country
  ].filter(Boolean).join(', '); // Filter out empty parts and join
  const managerUser = currentProperty?.propertyManagerDetails?.user;
  const fallbackOwner = currentProperty?.ownerUser;
  const ownerSource = managerUser || fallbackOwner || currentProperty?.propertyManagerDetails;
  const ownerName = ownerSource?.given_name || ownerSource?.name || ownerSource?.preferred_username || ownerSource?.sub || null;
  const ownerEmail = ownerSource?.email || ownerSource?.preferred_username || null;
  const ownerPhone = ownerSource?.phone_number || ownerSource?.phoneNumber || null;
  const ownerLabel = ownerName || ownerEmail || ownerPhone || null;
  const isActiveListing = currentProperty?.status === 'active';
  const showVerifiedBadge = isActiveListing && currentProperty?.verified;
  const verifierDisplay = currentProperty?.verifiedByUser?.given_name
    || currentProperty?.verifiedByUser?.preferred_username
    || currentProperty?.verifiedBy
    || null;

  const FALLBACK_IMAGE_SRC = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="#f4f4f4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial" font-size="16">Image unavailable</text></svg>'
  );

  const handleImageError = (event) => {
    if (event?.target) {
      event.target.onerror = null;
      event.target.src = FALLBACK_IMAGE_SRC;
    }
  };

  const unitImageUrls = Array.isArray(currentProperty?.unitImages)
    ? currentProperty.unitImages.filter((img) => typeof img === 'string' && img.length)
    : [];
  const furnitureImageUrls = Array.isArray(currentProperty?.furnitureImages)
    ? currentProperty.furnitureImages.filter((img) => typeof img === 'string' && img.length)
    : [];
  const floorPlanUrl = (Array.isArray(currentProperty?.floorPlanImage)
    ? currentProperty.floorPlanImage[0]
    : currentProperty?.floorPlanImage) || null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* --- Header Section --- */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3, flexDirection: 'column', flexWrap: 'wrap' }}>
        {/* 3-dot menu above property name */}
        <Box width="100%" display="flex" justifyContent="flex-end">
          <IconButton onClick={handleActionsOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={3} width="100%">
          <Avatar
            alt={currentProperty?.propertyName || 'Property'}
            src={unitImageUrls[0] || undefined}
            sx={{ width: 100, height: 100, border: '2px solid', borderColor: 'divider' }}
          >
            {!currentProperty?.unitImages?.[0] && <HomeWorkIcon sx={{ fontSize: 50 }} />}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentProperty?.title || 'Property Listing'}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {currentProperty?.propertyName || 'N/A'}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {ownerLabel && (
                <Chip
                  icon={<AccountCircleIcon />}
                  label={`Owner: ${ownerLabel}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {ownerEmail && ownerEmail !== ownerLabel && (
                <Chip
                  icon={<EmailIcon />}
                  label={ownerEmail}
                  size="small"
                  variant="outlined"
                />
              )}
              {ownerPhone && ownerPhone !== ownerLabel && (
                <Chip
                  icon={<PhoneIcon />}
                  label={ownerPhone}
                  size="small"
                  variant="outlined"
                />
              )}
              <Chip
                label={currentProperty?.status ? currentProperty.status.charAt(0).toUpperCase() + currentProperty.status.slice(1) : 'Unknown Status'}
                color={currentProperty?.status === 'active' ? 'success' : 'default'}
                size="small"
              />
              {showVerifiedBadge && (
                <Chip
                  icon={<VerifiedIcon />}
                  label={`Verified${verifierDisplay ? ` by ${verifierDisplay}` : ''}`}
                  color="info"
                  size="small"
                  variant="outlined"
                />
              )}
              <Chip
                icon={<VisibilityIcon />}
                label={`${currentProperty?.viewCount || 0} views`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<InfoIcon />}
                label={`Listing ID: ${currentProperty?.listingId || 'N/A'}`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
          <Box textAlign={{ xs: 'left', sm: 'right' }} mt={{ xs: 2, sm: 0 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatCurrency(currentProperty?.price?.rent?.amount, currentProperty?.price?.rent?.currency)} / month
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            Deposit: {formatCurrency(currentProperty?.price?.deposit?.amount, currentProperty?.price?.deposit?.currency)}
            {currentProperty?.price?.flexible && <Chip label="Flexible Price" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />}
          </Typography>
          {currentProperty?.price?.fees?.cleaning?.amount && (
            <Typography variant="body2" color="text.secondary">
              Cleaning Fee: {formatCurrency(currentProperty?.price?.fees?.cleaning?.amount, currentProperty?.price?.fees?.cleaning?.currency)}
            </Typography>
          )}
        </Box>
        </Box>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleActionsClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <List>
            <ListItem button onClick={() => navigate("/web/admin/home/add-listing", { state: { editMode: true, listingId: currentProperty?.listingId } })}>
              <ListItemIcon><EditIcon /></ListItemIcon>
              <ListItemText primary="Edit Listing" />
            </ListItem>
            <ListItem button onClick={onSubmitHibernate}>
              <ListItemIcon>
                {currentProperty?.status === 'active' ? <PauseCircleIcon color="warning" /> : <PlayCircleIcon color="success" />}
              </ListItemIcon>
              <ListItemText
                primary={
                  currentProperty?.status === 'active'
                    ? 'Hide Listing'
                    : isSuperAdmin
                      ? 'Activate Listing'
                      : 'Submit for Activation'
                }
              />
            </ListItem>
            {isSuperAdmin && (
              <>
                <ListItem button onClick={onSubmitApprove}>
                  <ListItemIcon><ArchiveIcon /></ListItemIcon>
                  <ListItemText primary="Approve" />
                </ListItem>
                <ListItem button onClick={() => setopenmode(true)}>
                  <ListItemIcon><BlockIcon /></ListItemIcon>
                  <ListItemText primary="Reject" />
                </ListItem>
                <ListItem button onClick={() => setDeleteDialogOpen(true)}>
                  <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
                  <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
                </ListItem>
              </>
            )}
          </List>
        </Popover>
        <Modal open={openmode} onClose={() => setopenmode(false)}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enter your reason
            </Typography>
            <TextField
              fullWidth
              label="Message"
              variant="outlined"
              value={message}
              onChange={e => setMessage(e.target.value)}
              inputProps={{ maxLength: 150 }}
              multiline
              rows={3}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" onClick={onSubmitReject}>
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setopenmode(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Listing</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this listing?</Typography>
            {deleteApiMessage && (
              <Typography sx={{ mt: 2, color: deleteApiMessage.toLowerCase().includes('fail') ? 'error.main' : 'success.main' }}>
                {deleteApiMessage}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
            <Button onClick={handleDelete} color="error" disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* --- Rejected Reason Note --- */}
      {currentProperty?.status === 'rejected' && currentProperty?.rejectedReason && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning">
            <strong>Note:</strong> This listing had a rejection reason: {currentProperty.rejectedReason}
          </Alert>
        </Box>
      )}

      {/* --- Image Gallery --- */}
      {(unitImageUrls.length > 0 || floorPlanUrl || furnitureImageUrls.length > 0) && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Images</Typography>
            <Grid container spacing={2}>
              {/* Main Unit Images */}
              {unitImageUrls.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={`unit-img-${index}`}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Unit Image ${index + 1}`}
                    sx={{ borderRadius: 1, height: 200, objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                </Grid>
              ))}
              {/* Floor Plan */}
              {floorPlanUrl && (
                <Grid item xs={12} sm={6} md={4} key="floorplan-img">
                  <Typography variant="subtitle2" gutterBottom>Floor Plan</Typography>
                  <CardMedia
                    component="img"
                    image={floorPlanUrl}
                    alt="Floor Plan"
                    sx={{ borderRadius: 1, height: 200, objectFit: 'contain', border: '1px solid', borderColor: 'divider' }}
                    onError={handleImageError}
                  />
                </Grid>
              )}
              {/* Furniture Images (Optional - can be combined or separate) */}
              {furnitureImageUrls.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={`furniture-img-${index}`}>
                  <Typography variant="subtitle2" gutterBottom>Furniture</Typography>
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Furniture Image ${index + 1}`}
                    sx={{ borderRadius: 1, height: 200, objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                </Grid>
              ))}
              {(unitImageUrls.length === 0 && !floorPlanUrl && furnitureImageUrls.length === 0) && (
                <Grid item xs={12}>
                  <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageSearchIcon fontSize="small" /> No images provided.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* --- Left Column (Main Details) --- */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Property Overview</Typography>
              <Typography variant="body1" paragraph>
                {currentProperty?.description || 'No description available.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Location</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOnIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">{fullAddress || 'Location not specified'}</Typography>
                {/* Potential: Add a Link/Button to Google Maps */}
                {/* <Button size="small" sx={{ml: 2}} href={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`} target="_blank">View Map</Button> */}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Configuration & Type</Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                  <ListItem dense disableGutters>
                    <ListItemIcon sx={{ minWidth: 35 }}><BedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={`${currentProperty?.configurationHouse?.bedrooms?.number ?? 'N/A'} Beds`} />
                  </ListItem>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ListItem dense disableGutters>
                    <ListItemIcon sx={{ minWidth: 35 }}><BathtubIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={`${currentProperty?.configurationHouse?.bathrooms?.number ?? 'N/A'} Baths`} />
                  </ListItem>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ListItem dense disableGutters>
                    <ListItemIcon sx={{ minWidth: 35 }}><KitchenIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={`${currentProperty?.configurationHouse?.kitchen?.number ?? 'N/A'} Kitchen`} />
                  </ListItem>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ListItem dense disableGutters>
                    <ListItemIcon sx={{ minWidth: 35 }}><BalconyIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={`${currentProperty?.configurationHouse?.balcony?.number ?? 0} Balcony`} />
                  </ListItem>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip icon={<HomeWorkIcon />} label={`Property Type: ${currentProperty?.propertyType?.name || 'N/A'}`} size="small" variant="outlined" />
                <Chip icon={<MeetingRoomIcon />} label={`Unit Type: ${currentProperty?.unitType?.name || 'N/A'}`} size="small" variant="outlined" />
                <Chip icon={<SellIcon />} label={`Sale Type: ${currentProperty?.saleType?.name || 'N/A'}`} size="small" variant="outlined" />
                <Chip icon={<MeetingRoomIcon />} label={`Room Type: ${currentProperty?.roomType || 'N/A'}`} size="small" variant="outlined" />
              </Stack>


              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Availability</Typography>
              <ListItem dense disableGutters>
                <ListItemIcon sx={{ minWidth: 35 }}><EventAvailableIcon fontSize="small" /></ListItemIcon>
                <ListItemText
                  primary={`Available from ${formatDate(currentProperty?.availability?.startDate)} to ${formatDate(currentProperty?.availability?.endDate)}`}
                  secondary={currentProperty?.availability?.flexible ? 'Dates may be flexible' : 'Fixed dates'}
                />
              </ListItem>

            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Furniture & Belongings</Typography>
              <Chip
                icon={currentProperty.comesWithFurniture ? <CheckCircleIcon /> : <CancelIcon />}
                label={`Comes with Furniture: ${formatBoolean(currentProperty.comesWithFurniture)}`}
                color={currentProperty.comesWithFurniture ? 'success' : 'default'}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                icon={currentProperty.belongingsIncluded ? <CheckCircleIcon /> : <CancelIcon />}
                label={`Belongings Included: ${formatBoolean(currentProperty.belongingsIncluded)}`}
                color={currentProperty.belongingsIncluded ? 'success' : 'default'}
                variant="outlined"
                sx={{ mb: 1 }}
              />

              {currentProperty.furniture && currentProperty.furniture.length > 0 && (
                <List dense sx={{ pt: 1 }}>
                  {currentProperty.furniture.map((item, index) => (
                    <ListItem key={item.id || index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 35 }}><WeekendIcon fontSize="small" /></ListItemIcon>
                      <ListItemText
                        primary={`${item.count || 1} x ${item.name || 'Unknown Item'}`}
                        secondary={`${item.type || 'Furniture'} ${item.common ? '(Common Area)' : ''} ${item.exclusiveAccess ? '(Exclusive Access)' : ''}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              {(currentProperty.furniture?.length === 0 && currentProperty.comesWithFurniture) && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No specific furniture items listed.</Typography>
              )}
            </CardContent>
          </Card>

        </Grid>

        {/* --- Right Column (Features & Preferences) --- */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Amenities</Typography>
              {currentProperty.amenities && currentProperty.amenities.length > 0 ? (
                <List dense>
                  {currentProperty.amenities.map((item, index) => (
                    <ListItem key={item.id || index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        {/* Basic Icon - Replace with specific icons if available */}
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item.name} secondary={item.type} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No amenities listed.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Utilities</Typography>
              {currentProperty.utilities && currentProperty.utilities.length > 0 ? (
                <List dense>
                  {currentProperty.utilities.map((item, index) => (
                    <ListItem key={item.id || index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        {item.included
                          ? <CheckCircleIcon color="success" fontSize="small" />
                          : <CancelIcon color="disabled" fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={item.included ? 'Included' : 'Not Included'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No utility information provided.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pet Policy</Typography>
              <ListItem dense disableGutters>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  {/* {currentProperty.arePetsAllowed ? <PetsIcon color="success" /> : "mmmmmmmmmmmmmmm"} */}
                    <PetsIcon color="success" /> 
                </ListItemIcon>
                <ListItemText primary={`Pets Allowed: ${formatBoolean(currentProperty.arePetsAllowed)}`} />
              </ListItem>

              {currentProperty.arePetsAllowed && currentProperty.petsAllowed?.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 1, ml: '35px' }}>Allowed Types:</Typography>
                  <List dense sx={{ pl: '35px' }}>
                    {currentProperty.petsAllowed.map((pet) => (
                      <ListItem key={pet.id} sx={{ py: 0.2 }}>
                        <ListItemText primary={pet.name} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {currentProperty.petsPresent?.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 1, ml: '35px', color: 'black', fontWeight: 'bold' }}>Pets Currently Present:</Typography>
                  <List dense sx={{ pl: '35px' }}>
                    {currentProperty.petsPresent.map((pet) => (
                      <ListItem key={pet.id} sx={{ py: 0.2 }}>
                        <ListItemText primary={pet.name} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {currentProperty.arePetsAllowed === undefined && ( // Handle case where it's not specified
                <Typography variant="body2" color="text.secondary">Pet policy not specified.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Preferences</Typography>

              <Typography variant="subtitle1" gutterBottom>
                <GroupIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Roommate Preferences
              </Typography>
              {currentProperty.roommatePreferences && currentProperty.roommatePreferences.length > 0 ? (
                <List dense>
                  {currentProperty.roommatePreferences.map((pref, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={pref.key}
                        secondary={pref.values && pref.values.length > 0 ? pref.values.join(', ') : 'Any / Not specified'}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No roommate preferences specified.</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <RestaurantIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Food Preferences
              </Typography>
              {currentProperty.foodPreferences && currentProperty.foodPreferences.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {currentProperty.foodPreferences.map((food, index) => (
                    // Assuming these indicate allowed/preferred types
                    <Chip key={food.id || index} label={food.name} size="small" variant="outlined" color="primary" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No food preferences specified.</Typography>
              )}
            </CardContent>
          </Card>

        </Grid>
      </Grid>

    </Container>
  );
};

export default ListingDetails;
