const HOST_NAME = "reswap.tmithun.com";
const PORT_NUMBER = "443";
const VERSION = "v1.2";
export const cookies="reswap.sid=s%3AGS__BaPud08HZTSCoTKxXhj6K2dqS-TA.RYyXg69nR0okmyrt6iODY28Lp%2FvItWxt%2Fd4DhAhvd8k; LIAM_state.RW001=QYQkfAzYnJdUK21kPRTmxKekYUheGABTgloQn3aXlhc; LIAM_state.RW001.legacy=QYQkfAzYnJdUK21kPRTmxKekYUheGABTgloQn3aXlhc"

//Auth and user
const BASE_URL = `https://${HOST_NAME}:${PORT_NUMBER}`;
export const REGISTRATION = `${BASE_URL}/api/auth/${VERSION}/register`;
export const FORGOT_PASSWORD_EMAIL = `${BASE_URL}/api/auth/${VERSION}/forgotPasswordEmail`;
export const RESET_PASSWORD_EMAIL = `${BASE_URL}/api/auth/${VERSION}/forgotPasswordUser`;
export const CHANGE_PASSWORD = `${BASE_URL}/api/auth/${VERSION}/resetPasswordUser`;
export const WIP_SET_USERS = `${BASE_URL}/api/auth/${VERSION}/setUser`;
export const LOGIN = `${BASE_URL}/api/auth/${VERSION}/login`;

//General
export const ROBOT_TXT = `${BASE_URL}/api/general/${VERSION}/robots.txt`;
export const ABOUT_US = `${BASE_URL}/api/general/${VERSION}/files/pages/PrivacyPolicy.html`;
export const TERMS_AND_CONDITIONS = `${BASE_URL}/api/general/${VERSION}/TermsAndCondition`;
export const PRIVACY_POLICY = `${BASE_URL}/api/general/${VERSION}/PrivacyPolicy`;
export const WIP_FAQ = `${BASE_URL}/api/general/{{VERSION}}/faqs?module=`; //NEED TO APPEND module NAME IN QUERY
export const GET_ALL_COUNTRIES = `${BASE_URL}/api/general/${VERSION}/getCountries`;
export const GET_COMMUNITIES = `${BASE_URL}/api/general/${VERSION}/getCommunities`;

//Fashion/Essentials

//SpaceShare
export const GET_LISTING = `${BASE_URL}/api/space/${VERSION}/getListingDetails`;
export const ADD_LISTING = `${BASE_URL}/api/space/${VERSION}/addNewListing`;
export const DELETE_LISTING = `${BASE_URL}/api/space/${VERSION}/deleteListing`;
export const EDIT_LISTING = `${BASE_URL}/api/space/${VERSION}/editListing`;
export const GET_ROOM_PREFERENCE = `${BASE_URL}/api/space/${VERSION}/getFoodPreferencesOptions`; //NEED TO APPEND module NAME IN QUERY
export const GET_PLACE_NEAR_LISTING = `${BASE_URL}/api/space/${VERSION}/getPlacesNearListing`;
export const APPROVE_REJECT = `${BASE_URL}/api/space/${VERSION}/approveListing`;
export const GET_FOOD_PREFERENCE = `${BASE_URL}/api/space/${VERSION}//getRoommatePreferencesOptions`;
export const SEARCH_SPACE_LISTING = `${BASE_URL}/api/space/${VERSION}/searchSpaceListings`;
// export const GET_FOOD_PREFERENCE = `${BASE_URL}/api/general/${VERSION}/getCountries`;
//RideShare
