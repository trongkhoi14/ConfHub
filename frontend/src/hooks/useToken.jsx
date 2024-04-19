import { useEffect, useState } from 'react';

const useToken = () => {
  // Kiểm tra xem có dữ liệu người dùng trong localStorage không
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage không
    const storedtoken = localStorage.getItem('token');
    if (storedtoken) {
      setToken(JSON.parse(storedtoken));
    }
  }, []);

  // Hàm để lưu thông tin người dùng vào localStorage
  const savetokenToLocalStorage = (tokenData) => {
    console.log('token', tokenData)
    localStorage.setItem('token', JSON.stringify(tokenData));
    setToken(tokenData);
  };

  // Hàm để xóa thông tin người dùng khỏi localStorage
  const deletetokenFromLocalStorage = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return {
    token,
    savetokenToLocalStorage,
    deletetokenFromLocalStorage,
  };
};

export default useToken;