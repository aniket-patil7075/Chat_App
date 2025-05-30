export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO=`${AUTH_ROUTE}/user-info`;
export const UPDATE_PROFILE_ROUTE=`${AUTH_ROUTE}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE =`${AUTH_ROUTE}/add-profile-image`
export const REMOVE_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTE}/remove-profile-image`;
export const LOGOUT_ROUTE=`${AUTH_ROUTE}/logout`;

export const CONTACTS_ROUTES='api/contacts';
export const SEARCH_CONTACTS_ROUTES =`${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES=`${CONTACTS_ROUTES}/get-contact-for-dm`;
export const GET_ALL_CONTACTS_ROUTES=`${CONTACTS_ROUTES}/get-all-contacts`;
export const GET_USER_DETAILS_ROUTE = `${CONTACTS_ROUTES}/get-user/:userId`;

export const MESSAGES_ROUTES="api/messages";
export const GET_ALL_MESSAGES_ROUTE=`${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE=`${MESSAGES_ROUTES}/upload-file`;
export const CLEAR_ALL_CHAT= `${MESSAGES_ROUTES}/delete-messages/:id`;
export const DELETE_ONE_MESSAGE_ROUTE=`${MESSAGES_ROUTES}/delete-msg`;
export const DELETE_USER_MESSAGE = `${MESSAGES_ROUTES}/messages/delete/:id`;
export const DELETE_EVERYONE_ROUTE=`${MESSAGES_ROUTES}/delete-everyone`;

export const   CHANNEL_ROUTES='api/channel';
export const CREATE_CHANNEL_ROUTE=`${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTES=`${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES=`${CHANNEL_ROUTES}/get-channel-messages`;
export const ADD_CHANNEL_IMAGE_ROUTE =`${CHANNEL_ROUTES}/:id/upload`;