// useAuth.js
// handleLogin, handleRegister, Logout, updateProfile
import { useAppContext } from '../context/authContext';
import { loginRequest, loginSuccess, loginFailure, logoutUser, registrationRequest, registrationSuccess, registrationFailure } from '../actions/actions';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './api/baseApi';

const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    dispatch(loginRequest());

    //test account page
    const user = {email: email, password: password}
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
          localStorage.setItem("user-info", JSON.stringify(userData))
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
    const user ={
      email: email,
      name: 'ThaoVy',
      phone: '07949962',
      address: 'Ho Chi Minh city',
      nationality: 'Viet Nam',
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
        body: JSON.stringify( user ),
      });
  
      if (response.ok && response.status !== 400) {
        // Successful registration
        const responseData = await response.json();          
        const userData = responseData.data
        dispatch(registrationSuccess(userData));
        localStorage.setItem("user-info", JSON.stringify(userData))
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
    localStorage.removeItem('user-info');
  };

  const updateProfile = (updateData) => {

  }
  
  const changePassword = (newPassword) => {

  }

  const storedUser = () => {
    const storedUser = localStorage.getItem('user-info');
    if (storedUser) {
      // Nếu có giá trị, thực hiện đăng nhập lại
      const parsedUser = JSON.parse(storedUser);
      dispatch(loginSuccess(parsedUser));
      // Gọi hàm đăng nhập lại hoặc thực hiện các bước cần thiết
    }
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
    storedUser
  };
};

export default useAuth;
