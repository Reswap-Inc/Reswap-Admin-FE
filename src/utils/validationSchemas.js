import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  listingType: Yup.string().required("Listing type is required"),
  propertyType: Yup.string().required("Property type is required"),
  unitType: Yup.string().required("Unit type is required"),
  roomType: Yup.string().required("Room type is required"),
  saleType: Yup.string().required("Sale type is required"),
  title: Yup.string().required("Title is required"),
  propertyName: Yup.string().nullable(),
  description: Yup.string().required("Description is required"),
  comesWithFurniture: Yup.boolean().required("Furnishing status is required"),
  arePetsAllowed: Yup.boolean().required("Pets allowance selection is required"),
  belongingsIncluded: Yup.boolean().required("Belongings included selection is required"),
  petsAllowed: Yup.array().required("Pets allowed field is required"),
  petsPresent: Yup.array().required("Pets present field is required"),
  roommatePreferences: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string().required("Preference key is required"),
        values: Yup.array().required("Preference values are required"),
      })
    )
    .required("Roommate preferences are required"),
  foodPreferences: Yup.array().required("Food preferences field is required"),
  amenities: Yup.array().required("Amenities field is required"),
  utilities: Yup.array().required("Utilities field is required"),
  furniture: Yup.array().required("Furniture list is required"),
  currentResidents: Yup.array().required("Current residents field is required"),
  configurationHouse: Yup.object().shape({
    bedrooms: Yup.object().shape({
      number: Yup.number()
        .min(0, "Bedroom count must be zero or more")
        .test(
          "bedrooms-integer",
          "Bedrooms must be a whole number",
          (value) => value === undefined || Number.isInteger(value)
        )
        .required("Bedrooms are required"),
      required: Yup.boolean().required(),
    }),
    bathrooms: Yup.object().shape({
      number: Yup.number()
        .min(0, "Bathroom count must be zero or more")
        .test(
          "bathrooms-half-step",
          "Bathrooms must be in 0.5 increments",
          (value) => value === undefined || Math.abs(value * 2 - Math.round(value * 2)) < 1e-6
        )
        .required("Bathrooms are required"),
      required: Yup.boolean().required(),
    }),
    balcony: Yup.object().shape({
      number: Yup.number()
        .min(0, "Balcony count must be zero or more")
        .test(
          "balcony-integer",
          "Balcony count must be a whole number",
          (value) => value === undefined || Number.isInteger(value)
        )
        .required("Balcony value is required"),
      required: Yup.boolean().required(),
    }),
    kitchen: Yup.object().shape({
      number: Yup.number()
        .min(0, "Kitchen count must be zero or more")
        .test(
          "kitchen-integer",
          "Kitchen count must be a whole number",
          (value) => value === undefined || Number.isInteger(value)
        )
        .required("Kitchen value is required"),
      required: Yup.boolean().required(),
    }),
  }),
  location: Yup.object().shape({
    address: Yup.string().required("Address is required"),
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
  }),
  availability: Yup.object().shape({
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
  }),
  furnitureImages: Yup.array().of(Yup.string()),
  unitImages: Yup.array().of(Yup.string()).min(1, "At least one unit image is required"),
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
