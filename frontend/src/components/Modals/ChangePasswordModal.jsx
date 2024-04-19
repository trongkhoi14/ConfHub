import React, { useState } from 'react'
import {Modal, Form, Button, Col} from 'react-bootstrap'
import useAuth from '../../hooks/useAuth';
import SuccessModal from './SuccessModal';
const ChangePasswordModal = ({ show, handleClose }) => {
    const { changePassword, error } = useAuth()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isMatch, setMatch] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOpenSuccessModal = () => setShowSuccessModal(true);
    const handleChangePassword = () => {
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('The new password does not match the old one.');
        setMatch(false)
      } 
      else if (newPassword === oldPassword) {
        setErrorMessage('The new password matches the old password');
        setMatch(false)
      }
      else {
        // Thực hiện xử lý thay đổi mật khẩu ở đây
        setMatch(true)
        changePassword(oldPassword, newPassword)
        if(error === null) {
          handleOpenSuccessModal()    
        }
      }
    };
    
    return (
      <Modal 
        show={show} 
        onHide={handleClose}
        size='lg'
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 fw-bold text-color-black">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='px-5' on>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Old password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                autoComplete='off'
                className='border-blue-normal'
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">New password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                autoComplete='off'
                className='border-blue-normal'
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Confirm new password</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                autoComplete='off'
                className={isMatch ? 'border-blue-normal' : 'border border danger'}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Modal.Footer>
        <SuccessModal show={showSuccessModal} handleClose={handleClose} />
      </Modal>
    );
  };

export default ChangePasswordModal