import * as actionTypes from './actionTypes'

export const getoptionsSelected = (option) => {
  return {
    type: actionTypes.GET_OPTIONS_FILTER,
    payload: option
}}
export const addFilter = (label, keywords) => ({
    type: actionTypes.ADD_FILTER,
    payload: {label, keywords, loading: false},
})

export const addFilterDateResults = (label, keyword) => {
  return {
  type: actionTypes.ADD_FILTER_DATE,
  payload: {label, keyword},
}}

export const removeFilter = (updateOptionsSelected) => {
  return {
    type: actionTypes.REMOVE_FILTER,
    payload: {updateOptionsSelected},
  }
}
export const clearFilters = (clearedOptionsSelected) => {
  return {
    type: actionTypes.CLEAR_FILTERS,
    payload: clearedOptionsSelected
  }
}

export const getResult = (results) => {
  return {
    type: actionTypes.GET_RESULT_AFTER_FILTER,
    payload: results
  }
}
