import { useAppContext } from '../context/authContext'
import { addFilter, clearFilters, getResult, getoptionsSelected, removeFilter, addFilterDateResults } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { formatDateFilter } from '../utils/formatDate'
import { convertToLowerCaseFirstLetter } from '../utils/formatWord'
import { requestApi } from '../actions/actions'
import { useEffect, useState } from 'react'
import useToken from './useToken'
import { useLocation } from 'react-router-dom'
import useConference from './useConferences'
import useFollow from './useFollow'
import usePost from './usePost'

const useSearch = () => {
  const { state, dispatch } = useAppContext()
  const { token } = useToken()
  const { listFollowed} = useFollow()
  const {postedConferences} = usePost()
  const [total, setTotal] = useState(0)
  const location = useLocation()  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Xử lý trước khi chuyển trang
      clearFilters()
      return event.returnValue = ''; // Hiển thị thông báo trên trình duyệt
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getOptionsFilter = async (label, staticData) => {
    const params = ["source", "for", "acronym", "rank"];
    if (label === "") {
      for (const param of params) {
        if (param === "acronym") {
          try {
            
            const response = await fetch(`${baseURL}/conf/${param}`);
            const data = await response.json();
            // Gửi action để cập nhật dữ liệu cho label hiện tại
            dispatch(getoptionsSelected({ [param]: data.data }));

          } catch (error) {
            console.error(`Error fetching data for ${param}:`, error);
          }
        }
        else {

          try {
            const response = await fetch(`${baseURL}/${param}`);
            const data = await response.json();
            // Gửi action để cập nhật dữ liệu cho label hiện tại
            dispatch(getoptionsSelected({ [param]: data.data }));

          } catch (error) {
            console.error(`Error fetching data for ${param}:`, error);
          }
        }
       
      }
    }
    else {
      const options = staticData.map(item => item.label);
      dispatch(getoptionsSelected({ [label]: options }))

    }

  }
  const addKeywords = (label, keywords) => {
    if (!state.optionsSelected[label].includes(keywords[0])) {
      dispatch(addFilter(label, keywords))
    }
  }

  const sendFilterDate = async (startDate, endDate, label, keywordFormat) => {
    
    const start = formatDateFilter(startDate)
    const end = formatDateFilter(endDate)
    console.log({ keywordFormat, label })
    let data = []
    if (label === 'submissionDate') {
      const response = await fetch(`${baseURL}/conference?subStart=${start}&subEnd=${end}`);
      data = await response.json();
      
    }
    else {
      const response = await fetch(`${baseURL}/conference?confStart=${start}&confEnd=${end}`);
      data = await response.json();
    }

    //dispatch(getResult(label, data.data));
    const maxRecords = data.data.maxRecods + total

    setTotal(maxRecords)
    return data.maxRecords
  }


  const deleteKeyword = (label, keyword) => {
    const updatedResultsFilter = {
      ...state.appliedFilterResult,
      [label]: []
      }

    const updateOptionsSelected = {
      ...state.optionsSelected,
      [label]: state.optionsSelected[label].filter(item => item !== keyword),
    };

    // Xóa 1 filter trong danh sách
    dispatch(removeFilter(updateOptionsSelected, updatedResultsFilter));
    

  }
  const clearKeywords = () => {
    if (state.optionsSelected && state.appliedFilterResult) {
      const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
      const clearedConferencesFilter = Object.fromEntries(Object.keys(state.appliedFilterResult).map((key) => [key, []]));
      dispatch(clearFilters(clearedOptionsSelected, clearedConferencesFilter))
    }
    //reset all
  }

  const sendFilter = async (label, keyword) => {
    const listLabel = ['location', 'rank', 'for', 'source', 'acronym', 'type'];
    let apiUrl = baseURL;

    if (listLabel.includes(label)) {
        apiUrl += `/conference?page=1&size=1&${label}[]=${keyword}`;
    } else {
        apiUrl += `/conference?page=1&size=1&${label}=${keyword}`;
    }
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu khi nhận được response
            dispatch(getResult(label, data.data));
            setTotal(data.maxRecods)
            const maxRecords = data.data.maxRecods + total

            //setTotal(maxRecords)
            return data.maxRecords
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('Error sending filter request:', error);
        });
};

const getQuantity = (conferenceList) => {
  let count = 0
  if(location.pathname==='/followed'){
    
    count = conferenceList.filter(obj1 => listFollowed.some(obj2 => obj1.id === obj2.id)).length;
    
  }
  else if(location.pathname==='/yourconferences'){
    count = conferenceList.filter(obj1 => postedConferences.some(obj2 => obj1.id === obj2.id)).length;
    
  }
  else {
    count = conferenceList.length
  }
  return count
}

const extractQuantity = (keyword) => {
  const regex = /\((\d+)\)/;
  console.log({keyword})
  // Sử dụng biểu thức chính quy để tìm kiếm giá trị trong ngoặc tròn
  const match = keyword.match(regex);

  if (match) {
    const valueInParentheses = match[1];
    return valueInParentheses;
  } else {
    return 0;
  }
}


  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    appliedFilterResult: state.appliedFilterResult,
    filterOptionsAuth: state.filterOptionsAuth,
    resultFilter: state.resultFilter,
    total: total,
    setTotal,
    getOptionsFilter,
    addKeywords,
    sendFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter,
    getQuantity,
    extractQuantity
  }
}

export default useSearch