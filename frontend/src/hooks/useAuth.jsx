// useAuth.js
// handleLogin, handleRegister, Logout, updateProfile
import { useAppContext } from '../context/authContext';
import { loginRequest, loginSuccess, loginFailure, logoutUser, registrationRequest, registrationSuccess, registrationFailure, setError, requestApi } from '../actions/actions';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './api/baseApi';
import useLocalStorage from './useLocalStorage';
import useToken from './useToken';

const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const { token, savetokenToLocalStorage, deletetokenFromLocalStorage } = useToken()
  const { user, saveUserToLocalStorage, deleteUserFromLocalStorage} = useLocalStorage()
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
    
    console.log('user', user)
    navigate('/home')
    window.location.reload()
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${baseURL}/user/current`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      saveUserToLocalStorage(data.data)
      console.log('after updated', user)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const updateProfile = (updateData) => {
    fetch(`${baseURL}/user/current`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData),
    })
      .then(response => {
        if (response.ok) {
          getCurrentUser()
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const changePassword = (currentPassword, newPassword) => {
    console.log(state.user)
    requestApi()
    fetch(`${baseURL}/user/changePassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword
      })
    })
      .then(response => {
        if (!response.ok) {
          setError(response.message)
        }
        console.log('Đổi mật khẩu thành công');
      })
      .catch(error => {
        console.error(error);
      });
  }


  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    handleLogin,
    handleRegister,
    handleLogout,
    updateProfile,
    changePassword,
  };
};

export default useAuth;
