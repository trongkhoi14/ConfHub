import { baseURL } from './api/baseApi'
import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
import useSessionToken from './useToken'
const usePost = () => {
  const [myConferences, setConferences] = useState([])
  const {user} = useLocalStorage()
  const {token, refreshToken} = useSessionToken()
  const [loading, setLoading] = useState(false)
  const getPostedConferences = async () => {
    setLoading(true)
    if(user){
      try {
        const response = await fetch(`${baseURL}/post`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setLoading(false)
        setConferences(data.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  const postConference = async (conference) => {
    if(user){
      try {
        const response = await fetch(`${baseURL}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify( conference ),
        });
        const data = response.json()        
        const message = data.message
        if (response.ok) {
          return {status: true, message}
        }
        else return {status: false, message}
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }

  }
  return {
    postedConferences: myConferences,
    loading,
    getPostedConferences,
    postConference
  }
}


export default usePost