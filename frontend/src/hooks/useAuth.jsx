// useAuth.js
// handleLogin, handleRegister, Logout, updateProfile
import { useAppContext } from '../context/authContext';
import { loginRequest, loginSuccess, loginFailure, logoutUser } from '../actions/actions';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate()
  const handleLogin = async (email, password, history) => {
    dispatch(loginRequest());

    //test account page
    const user = {email: email, password: password}
    dispatch(loginSuccess(user));

    navigate('/home')
   /* try {
        const response = await fetch('your_login_api_endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const userData = await response.json();
          dispatch(loginSuccess(userData));
        } else {
          const errorData = await response.json();
          dispatch(loginFailure(errorData.message));
        }
      } catch (error) {
        dispatch(loginFailure('An error occurred during login.'));
      }*/
  };

  const handleRegister = async (email, password) => {

  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const updateProfile = (updateData) => {

  }
  
  const changePassword = (newPassword) => {

  }

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    handleLogin,
    handleRegister,
    handleLogout,
    updateProfile,
    changePassword
  };
};

export default useAuth;
