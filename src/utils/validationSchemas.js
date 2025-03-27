import * as Yup from "yup";

export const AddListingValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.object().shape({
    address: Yup.string().required("Address is required"),
    address2: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.string()
      .matches(/^\d{5}$/, "Invalid ZIP code")
      .required("ZIP code is required"),
    roomNumber: Yup.string(),
    coordinates: Yup.object().shape({
      lat: Yup.number().nullable(),
      lng: Yup.number().nullable()
    })
  }),
  rentAmount: Yup.string()
    .matches(/^\d+$/, "Must be a valid number")
    .required("Rent amount is required"),
  depositAmount: Yup.number()
    .typeError("Deposit amount must be a number")
    .positive("Deposit amount must be positive")
    .required("Deposit amount is required"),
  propertyType: Yup.string().required("Property type is required"),
  unitType: Yup.string().required("Property type is required"),
  feesAmount: Yup.number()
    .typeError("Fees amount must be a number")
    .positive("Fees amount must be positive")
    .required("Fees amount is required"),
  petsAllowed: Yup.array().of(Yup.string()),
  petsPresent: Yup.array().of(Yup.string()),
  roomatePreferences: Yup.array().of(Yup.string()),
  foodPreferences: Yup.array().of(Yup.string()),
  configurationHouse: Yup.object().shape({
    bedrooms: Yup.number()
      .positive()
      .integer()
      .required("Number of bedrooms is required"),
    bathrooms: Yup.number()
      .positive()
      .integer()
      .required("Number of bathrooms is required"),
    kitchen: Yup.number()
      .positive()
      .integer()
      .required("Number of kitchens is required"),
    balcony: Yup.number()
      .positive()
      .integer()
      .required("Number of balconies is required"),
  }),
  ammenitiesIncluded: Yup.object().shape({
    onsiteLaundry: Yup.boolean().required("Please specify if onsite laundry is available"),
    attachedBalcony: Yup.boolean().required("Please specify if attached balcony is available"),
    water: Yup.boolean().required("Please specify if water is included"),
    sewage: Yup.boolean().required("Please specify if sewage is included"),
    trash: Yup.boolean().required(),
    electricity: Yup.boolean().required(),
    wifi: Yup.boolean().required(),
    landscaping: Yup.boolean().required(),
    pool: Yup.boolean().required(),
    gym: Yup.boolean().required(),
    commonStudyArea: Yup.boolean().required(),
  }),
  belongingsIncluded: Yup.boolean().required(),
  comesWithFurniture: Yup.boolean().required(),
  furnitureDetails: Yup.object().shape({
    couch: Yup.object().shape({
      count: Yup.number().integer().min(0).required(),
      common: Yup.boolean().required(),
      exclusiveAccess: Yup.boolean().required(),
    }),
    bedframe: Yup.object().shape({
      count: Yup.number().integer().min(0).required(),
      common: Yup.boolean().required(),
      exclusiveAccess: Yup.boolean().required(),
    }),
  }),
  furnitureImages: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "File too large", (value) => !value || value.size <= 5000000)
        .test("fileType", "Unsupported file type", (value) => 
          !value || ["image/jpeg", "image/png", "image/webp"].includes(value.type)
        )
    )
    .optional(),
  unitImages: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "File too large", (value) => !value || value.size <= 5000000)
        .test("fileType", "Unsupported file type", (value) => 
          !value || ["image/jpeg", "image/png", "image/webp"].includes(value.type)
        )
    )
    .optional(),
  isOwnedByPropertyManager: Yup.boolean().oneOf([false]),
  availability: Yup.object().shape({
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref('startDate'), "End date must be after start date"),
    flexible: Yup.boolean().required("Please specify if dates are flexible"),
  }),
  roomateDetails: Yup.array().of(
    Yup.object().shape({
      countryCode: Yup.string()
        .matches(/^\+\d{1,3}$/, "Invalid country code")
        .required("Country code is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{7,15}$/, "Invalid phone number")
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    })
  ).optional(),
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
