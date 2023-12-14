// actionTypes.js
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_USER = 'LOGOUT_USER';


export const SEARCH_KEYWORD_SUCCESS = 'SEARCH_KEYWORD_SUCCESS'; //get all keywords by input and filter
export const SEARCH_KEYWORD_FAILURE = 'SEARCH_KEYWORD_FAILURE'; //get FAILED

export const GET_ALL_CONFERENCES = 'GET_ALL_CONFERENCES';   //get all conferences from server
export const GET_ONE_CONFERENCE = 'GET_ONE_CONFERENCE'  //get data of one conference by id

export const FOLLOW = "FOLLOW";
export const UNFOLLOW = "UNFOLLOW"

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS'


export const ADD_FILTER_SUBMISSION_DATE = 'ADD_FILTER_SUBMISSION_DATE';
export const ADD_FILTER_CONFERENCE_DATE= 'ADD_FILTER_CONFERENCE_DATE';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';