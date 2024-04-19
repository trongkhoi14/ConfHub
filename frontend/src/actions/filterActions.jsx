import * as actionTypes from './actionTypes'

export const getoptionsSelected = (option) => {
  return {
    type: actionTypes.GET_OPTIONS_FILTER,
    payload: option
}}
export const addFilter = (statename, label, keywords) => ({
    type: actionTypes.ADD_FILTER,
    payload: {statename, label, keywords, loading: false},
})

export const addFilterDateResults = (statename, label, keyword, conferences) => {
  return {
  type: actionTypes.ADD_FILTER_DATE,
  payload: {statename, label, keyword, conferences},
}}

export const removeFilter = (statename, updatedResults, updateOptionsSelected) => {
  return {
    type: actionTypes.REMOVE_FILTER,
    payload: {statename, updatedResults, updateOptionsSelected},
  }
}
export const clearFilters = (statename, clearedFetchedResults, clearedOptionsSelected) => {
  return {
    type: actionTypes.CLEAR_FILTERS,
    payload: {statename, clearedFetchedResults, clearedOptionsSelected}
  }
}

export const getResult = (option, results) => {
  return {
    type: actionTypes.GET_RESULT_AFTER_FILTER,
    payload: {option, results}
  }
}
