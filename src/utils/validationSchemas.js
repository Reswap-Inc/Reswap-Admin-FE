import * as yup from "yup";

export const validationSchema = yup.object().shape({
  listingType: yup.string().required('Listing Type is required'),
  propertyType: yup.string().required('Property Type is required'),
  unitType: yup.string().required('Unit Type is required'),
  roomType: yup.string().required('Room Type is required'),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  belongingsIncluded: yup.boolean().required('Belongings Included is required'),
  saleType: yup.string().required('Sale Type is required'),
  arePetsAllowed: yup.boolean().required('Pets Allowed is required'),
  petsAllowed: yup.array().required('Pets Allowed is required'),
  petsPresent: yup.array().required('Pets Present is required'),
  amenities: yup.array().required('Amenities are required'),
  utilities: yup.array().required('Utilities are required'),
  configurationHouse: yup.object().shape({
      bedrooms: yup.object().shape({
          number: yup.number().required('Number of bedrooms is required')
      }),
      bathrooms: yup.object().shape({
          number: yup.number().required('Number of bathrooms is required')
      }),
      kitchen: yup.object().shape({
          number: yup.number().required('Number of kitchens is required')
      })
  }).required('Configuration House is required'),
  comesWithFurniture: yup.boolean().required('Comes with Furniture is required'),
  furniture: yup.array().required('Furniture is required'),
  location: yup.object().shape({
      address: yup.string().required('Address is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      country: yup.string().required('Country is required'),
      postalCode: yup.string().required('Postal Code is required'),
  }).required('Location is required'),
  price: yup.object().shape({
      rent: yup.object().shape({
          amount: yup.number().required('Rent Amount is required')
      }),
      deposit: yup.object().shape({
          amount: yup.number().required('Deposit Amount is required')
      }),
      fees: yup.object().shape({
          cleaning: yup.object().shape({
              amount: yup.number().required('Cleaning Fee Amount is required')
          })
      })
  }).required('Price is required'),
  availability: yup.object().shape({
      startDate: yup.date().required('Start Date is required'),
      endDate: yup.date().required('End Date is required')
  }).required('Availability is required'),
  currentResidents: yup.array().required('Current Residents are required'),
  furnitureImages: yup.array().required('Furniture Images are required'),
  unitImages: yup.array().required('Unit Images are required')
});
export const fetchNearByPlacesValidationSchema = yup.object().shape({
  address1: yup.string().required("Address1 is required"),
  address2: yup.string().optional(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string()
    .matches(/^\d{5}$/, "Invalid ZIP code")
    .required("ZIP code is required"),
  countryCode: yup.string()
    .length(2, "Country code must be 2 characters")
    .required("Country code is required"),
});
