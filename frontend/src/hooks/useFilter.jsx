import { useAppContext } from '../context/authContext'
import { addFilter, clearFilters, getResult, getoptionsSelected, removeFilter, addFilterDateResults } from '../actions/filterActions'

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
      clearFilters()
      return event.returnValue = ''; // Hiển thị thông báo trên trình duyệt
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getOptionsFilter = async (label, staticData) => {
    const params = ["source", "for", "acronym"];
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
    requestApi()
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

    dispatch(addFilterDateResults(label, keywordFormat));
    dispatch(getResult(data.data));
  }


  const deleteKeyword = (label, keyword) => {

    const updateOptionsSelected = {
      ...state.optionsSelected,
      [label]: state.optionsSelected[label].filter(item => item !== keyword),
    };
    console.log({ updateOptionsSelected })
    // Xóa 1 filter trong danh sách
    dispatch(removeFilter(updateOptionsSelected));
    //sendFilter()

  }
  const clearKeywords = () => {
    if (state.optionsSelected && state.fetchedResults) {
      const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
      dispatch(clearFilters(clearedOptionsSelected))
    }

    //reset all


  }
  // Hàm để xây dựng query string từ object chứa các từ khóa
  const buildParamsString = (params) => {
    const listLabel = ['location', 'rank', 'for', 'source', 'acronym', 'type']
    const queryString = Object.keys(params)
      .filter(key => params[key].length > 0) // Lọc ra các key có mảng giá trị không rỗng
      .map(key => {
        // Tạo chuỗi query string từ mảng giá trị
        const valuesQueryString = params[key].map(
          value =>
            listLabel.includes(key) ? `${key}[]=${value}` : `${key}=${value}`
        )
          .join('&');
        return valuesQueryString;
      })
      .join('&'); // Nối các chuỗi query string lại với nhau

    return queryString;
  };

  const sendFilter = () => {
    const apiUrl = `${baseURL}/conference?${buildParamsString(state.optionsSelected)}`;

    console.log('gui filter', state.optionsSelected)
    // Thực hiện fetch API với URL đã tạo
    fetch(apiUrl, {
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Xử lý dữ liệu khi nhận được response
        dispatch(getResult(data.data));
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        throw new Error('Network response was not ok');
      });
  }


  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    fetchedResults: state.fetchedResults,
    filterOptionsAuth: state.filterOptionsAuth,
    resultFilter: state.resultFilter,
    getOptionsFilter,
    addKeywords,
    sendFilterDate,
    deleteKeyword,
    clearKeywords,
    sendFilter
  }
}

export default useFilter