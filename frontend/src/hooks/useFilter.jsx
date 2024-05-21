import React, { useEffect, useState } from 'react'
import { getUniqueConferences } from '../utils/checkFetchedResults'
import useSearch from './useSearch'
import { useAppContext } from '../context/authContext'
import { inputOptionFilterKeyword, selectOptionFilterKeyword } from '../actions/filterActions'

const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const { optionsSelected } = useSearch()
  const [optionsFilter, setOptionsFilter] = useState([])
  const [selectOptionFilter, setSelectOptionFilter] = useState([])
  const [inputFilter, setInputFilter] = useState('')

  useEffect(() => {
    let transformedOptions = []
    const uniqueValues = getUniqueConferences(optionsSelected)
    transformedOptions = uniqueValues.map((item, index) => ({
      value: index + 1,
      label: item,
      isSelected: selectOptionFilter.some(option => option.label === item)
    }));
    setOptionsFilter(transformedOptions)
    setSelectOptionFilter(transformedOptions)
    dispatch(selectOptionFilterKeyword(transformedOptions))
  }, [optionsSelected])


  const handleChangeOptions = (selectedOptions) => {
    console.log({ selectOptionFilter })
    setSelectOptionFilter(selectedOptions);
    dispatch(selectOptionFilterKeyword(selectedOptions))
  };

  const handleInputFilterChange = (e) => {
    setInputFilter(e.target.value)
  }

  const searchInput = (keyword) => {
    console.log({ keyword })
    const dataFilter = sessionStorage.getItem('dataFilters');
    const data = JSON.parse(dataFilter)
    if (dataFilter) {
      const result = [];

    // Duyệt qua từng danh sách object trong data
    for (const category in data) {
      const filteredObjects = data[category].filter(obj => searchInObject(obj, keyword));
      if (filteredObjects.length > 0) {
        console.log({filteredObjects})
        result.push(...filteredObjects);
      }
    }
      dispatch(inputOptionFilterKeyword(result))

      console.log({ data, keyword, result })
    }
    return []
  }

  const searchInObject = (obj, keyword) => {
    keyword = keyword.toLowerCase();
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(keyword);
    }

    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item, keyword));
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => searchInObject(value, keyword));
    }

    return false;
  }
  return {
    optionsFilter,
    selectOptionFilter: state.optionFilter,
    inputFilter,
    resultInputFilter: state.resultKeywordFilter,
    handleChangeOptions,
    handleInputFilterChange,
    searchInput,
  }
}

export default useFilter