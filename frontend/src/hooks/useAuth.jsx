// useAuth.js
// handleLogin, handleRegister, Logout, updateProfile
import { useAppContext } from '../context/authContext';
import { loginRequest, loginSuccess, loginFailure, logoutUser, registrationRequest, registrationSuccess, registrationFailure, setError, requestApi } from '../actions/actions';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './api/baseApi';
import useLocalStorage from './useLocalStorage';
import useToken from './useToken';
import { useState } from 'react';

const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const { token, savetokenToLocalStorage } = useToken()
  const { saveUserToLocalStorage, deleteUserFromLocalStorage, updateUserInStorage} = useLocalStorage()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    dispatch(loginRequest());

    //test account page
    try {
      const response = await fetch(`${baseURL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json()
        const userData = responseData.data
        dispatch(loginSuccess(userData));
        saveUserToLocalStorage(userData)
        savetokenToLocalStorage(userData.accessToken)
        navigate('/home')
      } else {
        const errorData = await response.json();
        dispatch(loginFailure(errorData.message));
      }
    } catch (error) {
      dispatch(loginFailure('An error occurred during login.'));
    }

  };

  const handleRegister = async (email, password) => {
    const user = {
      email: email,
      name: '',
      phone: '',
      address: '',
      nationality: '',
      password: password
    }
    try {
      // Dispatch registration request action
      dispatch(registrationRequest());

      // Make API request to register
      const response = await fetch(`${baseURL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok && response.status !== 400) {
        // Successful registration
        const responseData = await response.json();
        const userData = responseData.data
        dispatch(registrationSuccess(userData));
        saveUserToLocalStorage(userData)
        navigate('/home')

        // Optionally, you can perform additional actions like redirecting to a login page
      } else {
        // Handle registration failure
        const errorData = await response.json();
        dispatch(registrationFailure(errorData.message));
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('An error occurred during registration:', error);
      dispatch(registrationFailure('An error occurred during registration.'));
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    deleteUserFromLocalStorage()
    navigate('/home')
    window.location.reload()
  };


  const updateProfile = (updateData) => {
    console.log({updateData})
    fetch(`${baseURL}/user/infomation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData),
    })
      .then(response => {
        if (response.ok) {
          updateUserInStorage(updateData)
        }
        return response.json();
      })
      .catch(error => {
        setError(error)
      });
  }

  const changePassword = async (currentPassword, newPassword) => {
    
    try {
      const response = await fetch(`${baseURL}/user/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });
      const responseData = await response.json();
      return responseData
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  return {
    user: state.user,
    loading: state.loading,
    error: error,
    message: message,
    status: status,
    handleLogin,
    handleRegister,
    handleLogout,
    updateProfile,
    changePassword,
  };
};

export default useAuth;
