const HOST_NAME = "https://reswap.tmithun.com";
const PORT_NUMBER = "443";
const VERSION = "v1.2";
export const cookies="reswap.sid=s%3AYGFRteqnhClTXgsNMYfZ44dyY-XIH6ed.QdU3mE%2B2zJ3GtsjB7kyA0qLYWuKCcU%2FLaAEPBpat5Bs; LIAM_state.RW001=QYQkfAzYnJdUK21kPRTmxKekYUheGABTgloQn3aXlhc; LIAM_state.RW001.legacy=QYQkfAzYnJdUK21kPRTmxKekYUheGABTgloQn3aXlhc"

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

//RideShare
