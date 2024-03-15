import { useAppContext } from '../context/authContext'
import { addFilter, addFilterDateResults, clearFilters, getResult, removeFilter } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { formatDateFilter } from '../utils/formatDate'
import { convertToLowerCaseFirstLetter } from '../utils/formatWord'

const useFilter = () => {
  const { state, dispatch } = useAppContext()

  const addKeywords = (statename, label, keywords) => {
    dispatch(addFilter(statename, label, keywords))
  }

  const addFilterDate = async (statename, startDate, endDate, label, keywordFormat) => {
    const start = formatDateFilter(startDate)
    const end = formatDateFilter(endDate)
    
    if (label === 'submissionDate') {
      const response = await fetch(`${baseURL}/conference?startSubDate=${start}&endSubDate=${end}`);
      const data = await response.json();
      //dispatch(addFilterSubmission(label, data.conferences));
      dispatch(addFilterDateResults(statename, label, keywordFormat, data.conferences))
    }
    else {
      const response = await fetch(`${baseURL}/conference?startDate=${start}&endDate=${end}`);
      const data = await response.json();
      dispatch(addFilterDateResults(statename, label, keywordFormat, data.conferences))
    }
  }


  const deleteKeyword = (statename, label, keyword) => {
    let formatKeyword = keyword
    let modifiedLabel = label
    if (label === 'types') {
      formatKeyword = convertToLowerCaseFirstLetter(keyword)
    }
    else formatKeyword = keyword

    if(label === 'fors') {
      modifiedLabel = 'fieldOfResearch'
    }
    else if (label === 'search') {
      modifiedLabel = 'name'
      formatKeyword = keyword.toUpperCase()
    }
    else if (label === 'categories') {
      modifiedLabel = 'category'
    }
    else if (label.endsWith("s")) {
      modifiedLabel = label.slice(0, -1)
    }    


    let updatedResultsFilter = {}
    let updateOptionsSelected = {}
    if (label === 'submissionDate' || label === 'date') {
      updateOptionsSelected = {
        ...state.optionsSelected,
        [label]: [],
      };
      updatedResultsFilter = {
        ...state.fetchedResults,
        [label]: []
      }
    }
    else if (label === 'rating') {
      updatedResultsFilter = {
        ...state.fetchedResults,
        [label]: state.fetchedResults[label].filter(item => {
          const avgRating = item[modifiedLabel]['avgRating']
          const extractedNumber = parseInt(keyword.match(/\d+/));

          return !isNaN(extractedNumber) && extractedNumber > avgRating;
        }),
      }
      updateOptionsSelected = {
        ...state[statename],
        [label]: state[statename][label].filter(item => item !== keyword),
      };
    }
    else {
      updatedResultsFilter = {
        ...state.fetchedResults,
        [label]: state.fetchedResults[label].filter(item => !item[modifiedLabel].includes(formatKeyword)),
      }
      updateOptionsSelected = {
        ...state[statename],
        [label]: state[statename][label].filter(item => item !== keyword),
      };
    }
    // Xóa 1 filter trong danh sách
    dispatch( removeFilter(statename,updatedResultsFilter, updateOptionsSelected));


  }
  const clearKeywords = (statename) => {
    const clearedFetchedResults = Object.fromEntries(Object.keys(state.fetchedResults).map((key) => [key, []]));
    const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
    //reset all
    dispatch(clearFilters(statename, clearedFetchedResults, clearedOptionsSelected))
    
  }

  const sendFilter = async (label, selectedOptions) => {
    if (label === 'locations') {
      const response = await fetch(`${baseURL}/conference?size=15&location=${selectedOptions[0]}`);
      const data = await response.json();
      dispatch(getResult(label, data.conferences));
    } else if (label === 'search') {
      const response = await fetch(`${baseURL}/conference?size=15&search=${selectedOptions}`);
      const data = await response.json();
      dispatch(getResult(label, data.conferences));
    }
    else if (label === 'categories') {
      const response = await fetch(`${baseURL}/conference?size=15&category=${selectedOptions[0]}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
    }
    else if (label === 'types') {
      for (const option of selectedOptions) {
        const formatOption = option.toLowerCase()
        const response = await fetch(`${baseURL}/conference?size=15&type=${formatOption}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'ranks') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&rank=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'fors') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&for[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'sources') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&source[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'acronyms') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&acronym[]=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'rating') {
      for (const option of selectedOptions) {
        const response = await fetch(`${baseURL}/conference?size=15&rating=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
    else if (label === 'impactfactor') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&type=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.conferences));
      }
    }
  }

  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    fetchedResults: state.fetchedResults,
    filterOptionsFollowed: state.filterOptionsFollowed,
    addKeywords,
    addFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter
  }
}

export default useFilter