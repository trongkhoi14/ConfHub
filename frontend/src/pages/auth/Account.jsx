import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Account = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    if (!currentUser) {
        return <Navigate to="/login" />;
      }
  return (
    <div>Account da dang nhap thanh cong</div>
  )
}

export default Account