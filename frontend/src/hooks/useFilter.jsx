import React from 'react'
import { useAppContext } from '../context/authContext'
import { addFilter, removeFilter, clearFilters, addFilterSubmission, addFilterConference  } from '../actions/actions'
const useFilter = () => {
    const {state, dispatch} = useAppContext()

    const getFilter = () => {
      //trích ra danh sách các từ khóa để đưa vào các dropdown tương ứng
    }

    const addKeywords = (keywords) => {
      //keyword do người dùng chọn sẽ được thêm vào danh sách
      if (typeof keywords === "string") {
        dispatch(addFilter(keywords))
      }
      else{
        console.log("keywords", keywords)
        keywords.forEach((keyword) => {
          
          if (!state.keywordFilter.includes(keyword) && keyword !== ''){
            dispatch(addFilter(keyword))
          }
        });
      }
      dispatch(removeFilter(""))
    }
    
    const addFilterDate = (date, label) => {
      if(label === 'submission'){dispatch(addFilterSubmission(date))}
      else {dispatch(addFilterConference(date))}
    }
    const deleteKeyword = (keyword) => {
      //xóa 1 filter trong danh sách
      dispatch(removeFilter(keyword))

    }
    const clearKeywords = () => {
      //reset all
      dispatch(clearFilters())
      console.log(state.keywordFilter)
    }
  return{
    keywordFilter: state.keywordFilter,
    filterOptions: state.filterOptions,
    getFilter,
    addKeywords,
    addFilterDate,
    deleteKeyword,
    clearKeywords
  }
}

export default useFilter