import { baseURL } from './api/baseApi'
import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
import useSessionToken from './useToken'
const usePost = () => {
  const [myConferences, setConferences] = useState([])
  const [status, setStatus] = useState(false)
  const {user} = useLocalStorage()
  const {token, refreshToken} = useSessionToken()
  const getPostedConferences = async () => {
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
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ conference }),
        });
  
        if (response.ok) {
          setStatus(true)
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }

  }
  return {
    postedConferences: myConferences,
    status: status,
    setStatus,
    getPostedConferences,
    postConference
  }
}


export default usePost