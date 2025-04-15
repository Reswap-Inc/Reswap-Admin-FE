import React, { useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Card,
  CardMedia,
  Button,
  Grid,
  Container,
  List,
  ListItem,
  CardContent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useSelector } from "react-redux";
import { getListingThunk } from "../network/ListingThunk";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ListItemIcon, ListItemText} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// const property = {
//   name: 'UNITi Montroseis',
//   members: 9,
//   images: [
//     'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   ],
//   location: 'Palisades-2 3B 1226 W. Adams Blvd, Los Angeles',
//   placesNearby: [
//     { name: 'Mitchel Park', distance: '1 km' },
//     { name: 'Mark University', distance: '2 km' },
//     { name: 'Adams Hospital', distance: '1 km' },
//   ],
//   rent: 230,
//   deposit: 100,
//   roommatePreferences: ['Male'],
//   foodPreferences: ['Veg'],
//   petsIncluded: ['Dog', 'Cat'],
//   bedrooms: 6,
//   bathrooms: 5,
//   balconies: 5,
//   carParkings: 5,
//   amenities: ['Air conditioning available', 'Club house fitness center'],
//   furnitureDetails: ['1 Wardrobe', '1 AC', '1 Chimney'],
//   leaseDuration: '20 April 2024 - 20 August 2024'
// };

const ListingDetails = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const { listings } = useSelector((state) => state.listing);
  console.log(listings, "listinggguday");

  useEffect(() => {
    if (listingId) {
      dispatch(getListingThunk(listingId));
    }
  }, [dispatch, listingId]);
  const property = listings?.body;

  return (
    <Container maxWidth="lg">
      <Box
        textAlign="center"
        mb={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          src={property?.unitImages?.[0]}
          style={{
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            objectFit: "cover",
            border: "2px solid #000" // You can change color and width as needed
          }}
        />

        <Typography variant="h4" mt={2}>
          {property?.propertyName}
        </Typography>
        {/* <Typography variant="body1" color="textSecondary">
          {property?.members} Members
        </Typography> */}
      </Box>
      {/* <AppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Property Detail" />
          <Tab label={`Members (${property?.members})`} />
        </Tabs>
      </AppBar> */}

      <Box mt={2}>
        <Typography variant="h5">Property Images</Typography>
        <Grid container spacing={2}>
          {property?.furnitureImages?.map((img, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  image={img}
                  alt={`Property ${index}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card sx={{ margin: "auto", mt: 3, p: 2 }}>
        <CardContent>
          {/* Property Title */}
          <Typography variant="h4" mt={2}>
            {property?.title}
          </Typography>

          {/* Property Description */}
          <Typography variant="body1" mt={2}>
            {property?.description}
          </Typography>

          {/* Rent and Deposit */}
          <Grid container spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AttachMoneyIcon />}
                color="success"
              >
                Rent: ${property?.price?.rent.amount}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AttachMoneyIcon />}
                color="warning"
              >
                Deposit: ${property?.price?.deposit.amount}
              </Button>
            </Grid>
          </Grid>

          {/* Location */}
          <Typography variant="body1" mt={2}>
            {`${property?.location?.address}, ${property?.location?.city}, ${property?.location?.state}, ${property?.location?.country}`}
          </Typography>

          {/* Utilities */}
          <Typography variant="h6" mt={3}>
            Utilities
          </Typography>
          <List>
            {property?.utilities?.map((utility, index) => (
              <ListItem key={index}>
                {utility.name} {utility.included ? "(Included)" : "(Not Included)"}
              </ListItem>
            ))}
          </List>

          {/* Amenities */}
          <Typography variant="h6" mt={3}>
            Amenities
          </Typography>
          <List>
            {property?.amenities?.map((amenity, index) => (
              <ListItem key={index}>
                <Typography variant="subtitle1">{amenity.name || "---"}</Typography>
              </ListItem>
            ))}
          </List>

          {/* Roommate Preferences */}
          <Typography variant="h6" mt={3}>
            Roommate Preferences
          </Typography>
          <List>
            {property?.roommatePreferences?.map((item, index) => (
              <ListItem key={index}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.key}: {item.values.join(", ") || "Any"}
                </Typography>
              </ListItem>
            ))}
          </List>

          {/* Food Preferences */}
          <Typography variant="h6" mt={3}>
            Food Preferences
          </Typography>
          <List>
            {property?.foodPreferences?.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </List>

          {/* Furniture */}
          <Typography variant="h6" mt={3}>
            Furniture
          </Typography>
          <List>
            {property?.furniture?.map((item, index) => (
              <ListItem key={index}>{item.name}</ListItem>
            ))}
          </List>

          {/* Configuration House */}
          <Typography variant="h6" mt={3}>
            Configuration
          </Typography>
          <List>
            <ListItem>
              <Typography variant="subtitle1" fontWeight="bold">
                Bedrooms: {property?.configurationHouse?.bedrooms?.number}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle1" fontWeight="bold">
                Bathrooms: {property?.configurationHouse?.bathrooms?.number}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle1" fontWeight="bold">
                Balconies: {property?.configurationHouse?.balcony?.number}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle1" fontWeight="bold">
                Kitchen: {property?.configurationHouse?.kitchen?.number}
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ListingDetails;
