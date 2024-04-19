import { useAppContext } from '../context/authContext'
import { addFilter, addFilterDateResults, clearFilters, getResult, getoptionsSelected, removeFilter } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { formatDateFilter } from '../utils/formatDate'
import { convertToLowerCaseFirstLetter } from '../utils/formatWord'
import { requestApi } from '../actions/actions'
import { useEffect } from 'react'

const useFilter = () => {
  const { state, dispatch } = useAppContext()
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Xử lý trước khi chuyển trang
      event.preventDefault();
      clearFilters()
      return event.returnValue = ''; // Hiển thị thông báo trên trình duyệt
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getOptionsFilter = async (label, data) => {
    const params = ["source", "for"];
    if (label === "") {
      for (const param of params) {
        try {
          const response = await fetch(`${baseURL}/${param}`);
          const data = await response.json();
          // Gửi action để cập nhật dữ liệu cho label hiện tại
          dispatch(getoptionsSelected({ [param]: data.data }));
          
        } catch (error) {
          console.error(`Error fetching data for ${label}:`, error);
        }
      }
    }
    else {
      const options = data.map(item => item.label);
      dispatch(getoptionsSelected({ [label]: options }))
      
    }

  }
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
      dispatch(addFilterDateResults(statename, label, keywordFormat, data.data))
    }
    else {
      const response = await fetch(`${baseURL}/conference?startDate=${start}&endDate=${end}`);
      const data = await response.json();
      dispatch(addFilterDateResults(statename, label, keywordFormat, data.data))
    }
  }


  const deleteKeyword = (statename, label, keyword) => {
    let formatKeyword = keyword
    let modifiedLabel = label
    if (label === 'type') {
      formatKeyword = convertToLowerCaseFirstLetter(keyword)
    }
    else formatKeyword = keyword

    if (label === 'for') {
      modifiedLabel = 'fieldOfResearch'
    }
    else if (label === 'search') {
      modifiedLabel = 'name'
      formatKeyword = keyword.toUpperCase()
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
    dispatch(removeFilter(statename, updatedResultsFilter, updateOptionsSelected));


  }
  const clearKeywords = (statename) => {
    const clearedFetchedResults = Object.fromEntries(Object.keys(state.fetchedResults).map((key) => [key, []]));
    const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
    //reset all
    dispatch(clearFilters(statename, clearedFetchedResults, clearedOptionsSelected))

  }

  const sendFilter = async (label, selectedOptions) => {
    const listLabel = ['location', 'search', 'category', 'rank', 'for', 'source', 'acronym', 'rating']
    requestApi()
    if(listLabel.includes(label)){
      const response = await fetch(`${baseURL}/conference?size=15&${label}=${selectedOptions[0]}`);
      const data = await response.json();
      dispatch(getResult(label, data.data));
    }
    else if (label === 'type') {
      for (const option of selectedOptions) {
        const formatOption = option.toLowerCase()
        const response = await fetch(`${baseURL}/conference?size=15&type=${formatOption}`);
        const data = await response.json();
        dispatch(getResult(label, data.data));
      }
    }
    else if (label === 'impactfactor') {
      for (const option of selectedOptions) {

        const response = await fetch(`${baseURL}/conference?size=15&type=${option}`);
        const data = await response.json();
        dispatch(getResult(label, data.data));
      }
    }
  }

  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    fetchedResults: state.fetchedResults,
    filterOptionsAuth: state.filterOptionsAuth,
    getOptionsFilter,
    addKeywords,
    addFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter
  }
}

export default useFilter