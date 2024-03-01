import React, { useState } from 'react'
import { useAppContext } from '../context/authContext'
import { addFilter, removeFilter, clearFilters, addFilterSubmission, addFilterConference, getoptionsSelected, getResult } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { getAllConf } from '../actions/ConfAction'
import { formatDateFilter } from '../utils/formatDate'
const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const [maxpage, setMaxPage] = useState()
  const [amount, setAmount] = useState()

  const addKeywords = (label, keywords) => {
    dispatch(addFilter(label, keywords))
  }

  const addFilterDate = async (startDate, endDate, label) => {
    if (label === 'Submission') { 
      const response = await fetch(`${baseURL}/conference?startSubDate=${startDate}&endSubDate=${endDate}`);
      const data = await response.json();
      dispatch(addFilterSubmission(label, data.conferences));
      dispatch(getResult(label, data.conferences))
     }
    else {
      const response = await fetch(`${baseURL}/conference?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      dispatch(addFilterSubmission(label, data.conferences));
      dispatch(getResult(label, data.conferences))
    }
  }


  const deleteKeyword = (label, keyword) => {
    console.log({label, keyword})
    const updateOptions = state.optionsSelected[label].filter(option => option !== keyword);
    
      // Tạo một bản sao mới của fetchedResults    
    const updateResults = state.fetchedResults[label].filter(item => item.value !== keyword);
    //console.log('after remove', {updateOptions, updateResults});

    // Xóa 1 filter trong danh sách
    //dispatch(removeFilter(label, updateOptions, updateResults));


  }
  const clearKeywords = () => {
    const clearedFetchedResults = Object.fromEntries(Object.keys(state.fetchedResults).map((key) => [key, []]));
    const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
    //reset all
    dispatch(clearFilters(clearedFetchedResults, clearedOptionsSelected ))
  }

  const sendFilter = async (label, selectedOptions) => {
    console.log("Seneneen", state.fetchedResults)
    if(label === 'locations'){
      for(const option of selectedOptions){
        const response = await fetch(`${baseURL}/conference?size=15&location=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }else if(label === 'search')
    {
      console.log({selectedOptions, label})
      const response = await fetch(`${baseURL}/conference?size=15&search=${selectedOptions}`);
      const data = await response.json();
      dispatch(getResult(label, data.conferences));
    }
    else if(label === 'category')
    {
      for(const option of selectedOptions){
        const transformedString = option.toLowerCase();
        console.log(transformedString)
        const response = await fetch(`${baseURL}/conference?size=15&category=${transformedString}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'types')
    {
      for(const option of selectedOptions){
        console.log("before add", state.fetchedResults)
        const response = await fetch(`${baseURL}/conference?size=15&type=${option}`);
        const data = await response.json();
        const updatedField = [...state.fetchedResults[label], ...data.conferences];
        
        console.log("after applied", updatedField)
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'ranks')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&rank=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'fors')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&for[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'sources')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&source[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'acronyms')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&acronym[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'Rating')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&rating=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'impactfactor')
    {
      for(const option of selectedOptions){
        console.log(option)
        const response = await fetch(`${baseURL}/conference?size=15&type=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if(label === 'Submission')
    {
      const end = formatDateFilter(selectedOptions.endDate)
      const start = formatDateFilter(selectedOptions.startDate)
      const response = await fetch(`${baseURL}/conference?startSubDate=${start}&endSubDate=${end}`);
      const data = await response.json();
      dispatch(addFilterSubmission(label, data.conferences));
    }
    else if(label === 'Conference')
    {
      const end = formatDateFilter(selectedOptions.endDate)
      const start = formatDateFilter(selectedOptions.startDate)
      const response = await fetch(`${baseURL}/conference?startSubDate=${start}&endSubDate=${end}`);
      const data = await response.json();
      dispatch(addFilterConference(label, data.conferences));
    }
    
    console.log('Send', state.fetchedResults)
  }

  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    fetchedResults: state.fetchedResults,
    
    addKeywords,
    addFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter
  }
}

export default useFilter