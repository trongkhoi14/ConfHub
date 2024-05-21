
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const useFollow = () => {
  const { state, dispatch } = useAppContext()
  const {token, refreshToken} = useToken()
  const {user} = useLocalStorage()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate()



  useEffect(() => {
    setLoading(true);
    try {
        const fetchPage = async (page) => {
          const response = await fetch(`${baseURL}/follow?page=${page}&size=7`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        };

        const fetchAllPages = async () => {
            try {
                const firstPageData = await fetchPage(1);
                const extractData = firstPageData.data.map(item => item.callForPaper);
                dispatch(getFollowedConferenceAction(extractData));

                // Fetch remaining pages asynchronously
                for (let i = 2; i <= firstPageData.maxPages; i++) {
                    const pageData = await fetchPage(i);
                    const extractData = pageData.data.map(item => item.callForPaper);
                    dispatch(getFollowedConferenceAction(extractData));
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        if (user) {
            fetchAllPages();
        }
    } catch (error) {
        setError(error);
        setLoading(false);
    }
}, []);

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
        else {
          getListFollowedConferences()
          return true
        }
      } catch (error) {
        console.error('Error:', error);
        return false
      }
    }
    else {
      alert('Log in before continuing, please!')
      navigate('/login')
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
       
        return false
      }
      else {
        getListFollowedConferences()
        return true
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