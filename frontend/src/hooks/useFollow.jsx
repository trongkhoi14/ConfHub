
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
const useFollow = () => {
  const { state, dispatch } = useAppContext()
  const {token, refreshToken} = useToken()
  const {user} = useLocalStorage()
  const getListFollowedConferences = async () => {
    if(user){
      const response = await fetch(`${baseURL}/follow`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(response.message);
      }
      const data = await response.json();      
      const extractData = data.data.map(item => item.callForPaper); // Trích xuất dữ liệu từ trường callForPaper của mỗi object và tạo một object mới trong danh sách data
      dispatch(getFollowedConferenceAction(extractData))
    }
  }
  const followConference = async (id) => {
    if(token){
      console.log('token', token)
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
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
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