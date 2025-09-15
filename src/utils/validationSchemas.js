import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  listingType: Yup.string().required("Listing type is required"),
  propertyType: Yup.string().required("Property type is required"),
//   unitType: Yup.string().required("Unit type is required"),
//   roomType: Yup.string().required("Room type is required"),
  title: Yup.string().required("Title is required"),

  // foodPreferences: Yup.array().of(Yup.string()).min(1, "At least one food preference is required"),

  // roommatePreferences: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       key: Yup.string().required("Preference key is required"),
  //       values: Yup.array().of(Yup.string()).min(1, "At least one value is required").required(),
  //     })
  //   )
  //   .min(1, "At least one roommate preference is required")
  //   .required(),

  propertyName: Yup.string().required("Property name is required"),
  description: Yup.string().required("Description is required"),
//   belongingsIncluded: Yup.boolean().required("Belongings included field is required"),

//   arePetsAllowed: Yup.boolean().required("Pets allowance status is required"),
//   petsAllowed: Yup.array().of(Yup.string()).min(1, "At least one pet type must be selected"),
//   petsPresent: Yup.array().of(Yup.string()).min(1, "At least one present pet must be specified"),

//   amenities: Yup.array().of(Yup.string()).min(1, "At least one amenity is required"),
//   utilities: Yup.array().of(Yup.string()).min(1, "At least one utility is required"),

  configurationHouse: Yup.object().shape({
    bedrooms: Yup.object().shape({
      number: Yup.number()
        .integer()
        .min(1, "At least one bedroom is required")
        .required("Bedrooms are required"),
      required: Yup.boolean().required(),
    }),
    bathrooms: Yup.object().shape({
      number: Yup.number()
        .integer()
        .min(1, "At least one bathroom is required")
        .required("Bathrooms are required"),
      required: Yup.boolean().required(),
    }),
    // kitchen: Yup.object().shape({
    //   number: Yup.number()
    //     .integer()
    //     .min(1, "At least one kitchen is required")
    //     .required("Kitchen is required"),
    //   required: Yup.boolean().required(),
    // }),
    balcony: Yup.object().shape({
      number: Yup.number().integer().min(0, "Balcony count must be zero or more").required(),
      required: Yup.boolean().required(),
    }),
  }),

//   comesWithFurniture: Yup.boolean().required("Furniture status is required"),
//   furniture: Yup.array().of(Yup.string()).min(1, "At least one furniture item is required"),

  location: Yup.object().shape({
    address: Yup.string().required("Address is required"),
    // address2: Yup.string().required("Address2 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.string().required("Postal code is required"),
    
    coordinates: Yup.object().shape({
      lat: Yup.number().required("Latitude is required"),
      lng: Yup.number().required("Longitude is required"),
    }),
  }),

  price: Yup.object().shape({
    rent: Yup.object().shape({
      amount: Yup.number().min(1, "Rent amount must be positive").required("Rent amount is required"),
      currency: Yup.string().default("USD").required("Currency is required"),
    }),
    deposit: Yup.object().shape({
      amount: Yup.number().min(1, "Deposit amount must be positive").required("Deposit amount is required"),
      currency: Yup.string().default("USD").required("Currency is required"),
    }),
  
    // flexible: Yup.boolean().required("Price flexibility status is required"),
  }),

  availability: Yup.object().shape({
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    // flexible: Yup.boolean().required("Availability flexibility is required"),
  }),

//   currentResidents: Yup.array().of(Yup.string()).min(1, "At least one resident is required"),
  furnitureImages: Yup.array().of(Yup.string()).min(1, "At least one furniture image is required"),
//   unitImages: Yup.array().of(Yup.string()).min(1, "At least one unit image is required"),
});

export const fetchNearByPlacesValidationSchema = Yup.object().shape({
  address1: Yup.string().required("Address1 is required"),
  address2: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zip: Yup.string()
    .matches(/^\d{5}$/, "Invalid ZIP code")
    .required("ZIP code is required"),
  countryCode: Yup.string()
    .length(2, "Country code must be 2 characters")
    .required("Country code is required"),
});
