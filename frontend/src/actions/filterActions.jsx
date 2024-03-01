import * as actionTypes from './actionTypes'

export const getoptionsSelected = (options) => {
  return {
    type: actionTypes.GET_OPTIONS_FILTER,
    payload: options
}}
export const addFilter = (label, keywords) => ({
    type: actionTypes.ADD_FILTER,
    payload: {label, keywords},
})

export const addFilterSubmission = (keyword) => ({
  type: actionTypes.ADD_FILTER_SUBMISSION_DATE,
  payload: keyword,
})
export const addFilterConference = (keyword) => ({
  type: actionTypes.ADD_FILTER_CONFERENCE_DATE,
  payload: keyword,
})

export const removeFilter = (label, updateOptions, updateResults) => {
  return {
    type: actionTypes.REMOVE_FILTER,
    payload: {label, updateOptions, updateResults},
  }
}
export const clearFilters = (clearedFetchedResults, clearedOptionsSelected) => {
  return {
    type: actionTypes.CLEAR_FILTERS,
    payload: {clearedFetchedResults, clearedOptionsSelected}
  }
}

export const getResult = (option, results) => {
  return {
    type: actionTypes.GET_RESULT_AFTER_FILTER,
    payload: {option, results}
  }
}
