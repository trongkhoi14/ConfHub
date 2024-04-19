import { useEffect, useState } from 'react';
import { useAppContext } from '../context/authContext';
import { loginSuccess } from '../actions/actions';
import useToken from './useToken';

const useLocalStorage = () => {
  const { savetokenToLocalStorage } = useToken()
  // Kiểm tra xem có dữ liệu người dùng trong localStorage không
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage không
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if(JSON.parse(storedUser).accessToken){
        savetokenToLocalStorage(JSON.parse(storedUser).accessToken)
      } 
    }
  }, []);

  // Hàm để lưu thông tin người dùng vào localStorage
  const saveUserToLocalStorage = (userData, callback) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    callback && callback(userData); // Call the callback if provided
    return userData;
  };

  // Hàm để xóa thông tin người dùng khỏi localStorage
  const deleteUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    saveUserToLocalStorage,
    deleteUserFromLocalStorage,
  };
};

export default useLocalStorage;