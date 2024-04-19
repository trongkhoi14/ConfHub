import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessModal = ({ show, handleClose }) => {
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);

  useEffect(() => {
    if (show) {
      // Đặt timer để tự động đóng modal sau 3 giây
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      
      setAutoCloseTimer(timer);
    } else {
      // Xóa timer nếu modal không còn được hiển thị
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    }

    // Cleanup timer
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [show, handleClose, autoCloseTimer]);

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size='sm'
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title>Thành công!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Thao tác đã được thực hiện thành công.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
