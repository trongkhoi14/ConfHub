import { useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf, requestConference } from "../actions/confAction"


const useConference = () => {
  const { state, dispatch } = useAppContext()
  const [quantity, setQuantity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const handleGetList = async (page) => {
    console.log('hook', page)
      try {
        const response = await fetch(`${baseURL}/conference?page=${page}&size=7`);
        const data = await response.json(); 
        if (!response.ok) {
          throw new Error(response.message);
        }
      // Gửi action để cập nhật all conferences
      dispatch(getAllConf(data.data));
      //cập nhật state
      setTotal(data.maxRecords)
      setQuantity(data.quantity)
      } catch (error) {
        setError(error);
      }
  }

  const handleGetOne = async (id) => {
    try {
      //size = 5
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      //Gửi action để cập nhật state
      dispatch(getOneConf(data.data));
      setTotal(data.maxRecords)
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return {
    conferences: state.conferences,
    conference: state.conference,
    quantity: quantity,
    filterOptions: state.filterOptions,
    loading: isLoading,
    error: error,
    total,
    handleGetList,
    handleGetOne,
  }
}

export default useConference