import { useAppContext } from '../context/authContext'
import { addFilter, clearFilters, getResult, getoptionsSelected, removeFilter } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { formatDateFilter } from '../utils/formatDate'
import { useState } from 'react'
import useToken from './useToken'
import { useLocation } from 'react-router-dom'
import useFollow from './useFollow'
import usePost from './usePost'
import { capitalizeFirstLetter } from '../utils/formatWord'
const useSearch = () => {
  const { state, dispatch } = useAppContext()
  const { token } = useToken()
  const { listFollowed } = useFollow()
  const { postedConferences } = usePost()
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  
  const sortList = (list) => {
    // Lọc các mục là các chữ cái duy nhất
    const uniqueLetters = list.filter(item => /^[A-Z]$/.test(item));
    // Lọc các mục không phải là chữ cái duy nhất
    const nonUniqueLetters = list.filter(item => !/^[A-Z]$/.test(item)).sort();
  
    // Sắp xếp các chữ cái duy nhất theo thứ tự bảng chữ cái
    const uniqueList = nonUniqueLetters.reduce((accumulator, currentValue) => {
      const standardizedValue = currentValue.toLowerCase(); // Chuyển đổi giá trị thành chữ thường
      if (!accumulator.includes(standardizedValue)) {
        accumulator.push(capitalizeFirstLetter(standardizedValue));
      }
      return accumulator;
    }, []);
  
    // Sắp xếp danh sách giá trị duy nhất theo thứ tự bảng chữ cái
    uniqueList.sort();
    // Kết hợp lại
    return [...uniqueLetters, ...uniqueList];
  };
  
  const getOptionsFilter = async (label, staticData) => {
    const params = ["source", "for", "acronym", "rank"];
    const existedOptions = state.filterOptions
    setLoading(true)
    if (label === "") {
      for (const param of params) {
        if (!existedOptions[param]) {
          if (param === "acronym") {
            try {

              const response = await fetch(`${baseURL}/conf/${param}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              );
              const data = await response.json();
              // Gửi action để cập nhật dữ liệu cho label hiện tại
              const sorted = sortList(data.data)
              dispatch(getoptionsSelected({ [param]: Array.from(new Set(sorted)) }));

            } catch (error) {
              console.error(`Error fetching data for ${param}:`, error);
            }
          }
          else {

            try {
              const response = await fetch(`${baseURL}/${param}`);
              const data = await response.json();
              // Gửi action để cập nhật dữ liệu cho label hiện tại 
               const sorted = sortList(data.data)
              dispatch(getoptionsSelected({ [param]: Array.from(new Set(sorted)) }));

            } catch (error) {
              console.error(`Error fetching data for ${param}:`, error);
            }
          }
        }

      }
    }
    else {
      const options = staticData.map(item => item.label);
      dispatch(getoptionsSelected({ [label]: options }))
    }
    setLoading(false)
  }
  const addKeywords = (label, keywords) => {
    if(label === 'submissionDate' || label === 'conferenceDate'){
      dispatch({type: "ADD_FILTER_DATE", payload: {label, keyword: keywords}})
    }
    else {
      if (!state.optionsSelected[label].includes(keywords[0])) {
        dispatch(addFilter(label, keywords))
      }
      else deleteKeyword(label, keywords[0])
    }
    
  }

  const sendFilterDate = async (startDate, endDate, label) => {
    setLoading(true)
    const start = formatDateFilter(startDate)
    const end = formatDateFilter(endDate)
    let data = []
    if (label === 'submissionDate') {
      const response = await fetch(`${baseURL}/conference?subStart=${start}&subEnd=${end}`);
      data = await response.json();

    }
    else {
      const response = await fetch(`${baseURL}/conference?confStart=${start}&confEnd=${end}`);
      data = await response.json();
    }
    setLoading(false)
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

        //setTotal(maxRecords)
        return data.maxRecords
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Error sending filter request:', error);
      });
  };

  const getKeyword = (keyword) => {
    const parts = keyword.split('(');
    const getKeyword = parts[0].trim();
    const storedData = sessionStorage.getItem('dataFilters');

    if (!storedData) {
      return 0;
    }
    const parsedData = JSON.parse(storedData);
    const listFromStorage = parsedData[getKeyword] || [];
    let commonCount = 0

    if (location.pathname === '/followed') {
      const setToCompare = new Set(listFollowed.map(conf => conf.id));
      commonCount = listFromStorage.filter(conf => setToCompare.has(conf.id)).length;

    }
    else if (location.pathname === '/yourconferences') {
      const setToCompare = new Set(postedConferences.map(conf => conf.id));
      commonCount = listFromStorage.filter(conf => setToCompare.has(conf.id)).length;
    }
    const newKeyword = `${getKeyword} (${commonCount})`
    return newKeyword
  }

  const extractQuantity = (keyword) => {
    const regex = /\((\d+)\)/;
    // Sử dụng biểu thức chính quy để tìm kiếm giá trị trong ngoặc tròn
    const match = keyword.match(regex);

    if (match) {
      const valueInParentheses = match[1];
      return valueInParentheses;
    } else {
      return 0;
    }
  }

  const getTotalConf = (keywords) => {
    let keywordValuePairs = JSON.parse(sessionStorage.getItem('keywordFilter')) || {};
    let total = 0;

    keywords.forEach(key => {
      // Chuyển đổi giá trị thành số nguyên trước khi cộng vào tổng
      if (keywordValuePairs[key.label]) {
        total += parseInt(keywordValuePairs[key.label], 10);
      }
    });
    
    return total;
  }

 // Hàm để phân tích params từ URL và cập nhật optionsSelected
 const updateOptionsSelectedFromParams = (searchParams) => {
  const newOptionsSelected = { ...state.optionsSelected };
  // Loop qua các key của optionsSelected
  for (const key in newOptionsSelected) {
    if (Object.hasOwnProperty.call(newOptionsSelected, key)) {
      // Kiểm tra xem key có tồn tại trong params không
      if (searchParams.has(key)) {
        // Lấy giá trị tương ứng và cập nhật vào optionsSelected
        newOptionsSelected[key] = searchParams.get(key).split(',');
        const keyword = searchParams.get(key).split(',');
        console.log({newOptionsSelected, key, keyword})
      } else {
        // Nếu không tồn tại, đặt giá trị là mảng trống
        newOptionsSelected[key] = [];
      }
    }
  }
};

function getCountryName(countryCode) { 
  
}
 

  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    appliedFilterResult: state.appliedFilterResult,
    filterOptionsAuth: state.filterOptionsAuth,
    resultFilter: state.resultFilter,
    total: total,
    actionWithKeyword: state.actionWithKeyword,
    loading,
    setTotal,
    getOptionsFilter,
    addKeywords,
    sendFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter,
    getKeyword,
    extractQuantity,
    getTotalConf,
    updateOptionsSelectedFromParams,
    getCountryName,
  }
}

export default useSearch