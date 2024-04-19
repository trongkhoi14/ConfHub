
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
const useFollow = () => {
  const { state, dispatch } = useAppContext()
  const {token} = useToken()
  const {user} = useLocalStorage()
  const getListFollowedConferences = async () => {
    if(user){
      try {
        const response = await fetch(`${baseURL}/follow`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        dispatch(getFollowedConferenceAction(data.data))
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  const followConference = async (id) => {
    try {
      const response = await fetch(`${baseURL}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cfp_id: id})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  }
  const unfollowConference = async (id) => {
    try {
      const response = await fetch(`${baseURL}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cfp_id: id})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

    return {
      listFollowed: state.listFollowed,
      getListFollowedConferences,
      followConference,
      unfollowConference,
    }
  }


  export default useFollow