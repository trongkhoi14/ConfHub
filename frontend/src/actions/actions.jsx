import * as actionTypes from './actionTypes';

//base URL 
const baseURL = ""

export const loginRequest = () => {
  return {
    type: actionTypes.LOGIN_REQUEST,
  };
};

export const loginSuccess = (userData) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: userData,
  };
};

export const loginFailure = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    payload: error,
  };
};

export const logoutUser = () => {
  return {
    type: actionTypes.LOGOUT_USER,
  };
};


export const getAllNotifications = () => {

}

export const addFilter = (keyword) => ({
    type: actionTypes.ADD_FILTER,
    payload: keyword,
})

export const addFilterSubmission = (keyword) => ({
  type: actionTypes.ADD_FILTER_SUBMISSION_DATE,
  payload: keyword,
})
export const addFilterConference = (keyword) => ({
  type: actionTypes.ADD_FILTER_CONFERENCE_DATE,
  payload: keyword,
})

export const removeFilter = (keyword) => {
  return {
    type: actionTypes.REMOVE_FILTER,
    payload: keyword
  }
}
export const clearFilters = () => {
  return {
    type: actionTypes.CLEAR_FILTERS
  }
}