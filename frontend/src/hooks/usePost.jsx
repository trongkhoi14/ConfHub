import { baseURL } from './api/baseApi'
import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
import useSessionToken from './useToken'
const usePost = () => {
  const [myConferences, setConferences] = useState([])
  const {user} = useLocalStorage()
  const {token} = useSessionToken()
  const getPostedConferences = async () => {
    console.log({user, token})
    if(user){
      try {
        const response = await fetch(`${baseURL}/post`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
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
      fetch(`${baseURL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(conference),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
  return {
    postedConferences: myConferences,
    getPostedConferences,
    postConference
  }
}


export default usePost