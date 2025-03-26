import * as Yup from "yup";

export const AddListingValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  address1: Yup.string().required("Address1 is required"),
  address2: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  zip: Yup.string()
    .matches(/^\d{5}$/, "Invalid ZIP code")
    .required("ZIP code is required"),
  countryCode: Yup.string()
    .length(2, "Country code must be 2 characters")
    .required("Country code is required"),
  rentAmount: Yup.number()
    .typeError("Rent amount must be a number")
    .positive("Rent amount must be positive")
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
    onsiteLaundry: Yup.boolean().required(),
    attachedBalcony: Yup.boolean().required(),
    water: Yup.boolean().required(),
    sweage: Yup.boolean().required(),
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
    // .of(Yup.string().matches(/^<BASE64_image>$/, "Invalid image format"))
    .optional(),
  unitImages: Yup.array()
    // .of(Yup.string().matches(/^<BASE64_image>$/, "Invalid image format"))
    .optional(),
  isOwnedByPropertyManager: Yup.boolean().oneOf([false]),
  availability: Yup.object().shape({
    startDate: Yup.string()
      //   .matches(/^\d{8}$/, "Start date must be in YYYYMMDD format")
      .required("Start date is required"),
    endDate: Yup.string()
      //   .matches(/^\d{8}$/, "End date must be in YYYYMMDD format")
      .required("End date is required"),
    flexible: Yup.boolean().required(),
  }),
  roomateDetails: Yup.array()
    // .of(
    //   Yup.object().shape({
    //     countryCode: Yup.string()
    //       .matches(/^\+\d{1,3}$/, "Invalid country code")
    //       .required("Country code is required"),
    //     phoneNumber: Yup.string()
    //       .matches(/^\d{7,15}$/, "Invalid phone number")
    //       .required("Phone number is required"),
    //   })
    // )
    .optional(),
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
