import { useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/ConfAction"
import { getoptionsSelected } from "../actions/filterActions"

const useConference = () => {
  const { state, dispatch } = useAppContext()
  const [maxpage, setMaxPage] = useState(0)
  const [amount, setAmount] = useState(0)  

  const handleGetList = async (page) => {
    try {
      //size = 5

      const response = await fetch(`${baseURL}/conference?page=${page}&size=5`);
      const data = await response.json();
      //cập nhật các filter
      if (data !== null) {
        const allKeys = Object.keys(data);

        // Sử dụng Array.prototype.filter() để lọc chỉ những key có giá trị là mảng
        const arrayKeys = allKeys.filter(key => Array.isArray(data[key]));

        const updateLists = {};
        arrayKeys.forEach(key => {
          updateLists[key] = data[key];
        });

        dispatch(getoptionsSelected(updateLists))
      }
      // Gửi action để cập nhật all conferences
      dispatch(getAllConf(data.conferences));

      //cập nhật state
      setMaxPage(data.maxPage)
      setAmount(data.amount)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleGetOne = async (id) => {
    console.log(id)
    try {
      //size = 5
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      
      //Gửi action để cập nhật state
      dispatch(getOneConf(data.conference[0]));
      console.log(state.conference)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return {
    conferences: state.conferences,
    conference: state.conference,
    maxpage: maxpage,
    amount: amount,
    filterOptions: state.filterOptions,
    handleGetList,
    handleGetOne
  }
}

export default useConference