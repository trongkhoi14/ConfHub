import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import EditIcon from './../../assets/imgs/edit.png'
import useNote from '../../hooks/useNote';
const UpdateNoteInput = ({ existEvents, onClose, onUpdate, onDelete }) => {
  // State để lưu trữ giá trị "note" và "date_value"
  const [isEdited, setisEdited] = useState(false)

  const { updateNote } = useNote()
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [status, setStatus] = useState(false)
  const [countdown, setCountdown] = useState(5); // Số giây đếm ngược
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closingOverlay, setClosingOverlay] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState({});
  const [deleteId, setDeleteId] = useState('')

  const [anyChecked, setAnyChecked] = useState(false);
  
  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const editingEventId = existEvents[index]['id']; // Lấy giá trị của editingEventId từ existEvents
    setEditingEventId(editingEventId);
    setInputValues(prevState => ({
      ...prevState,
      [name]: value // Sử dụng editingEventId làm key
    }));
  };

  // Thêm trường checked vào mỗi object trong danh sách ban đầu
  const initialCheckedData = existEvents.map(item => ({ ...item, checked: false }));

  const [data, setData] = useState(initialCheckedData);

  const handleCheckboxChange = (id) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setData(updatedData);
    setAnyChecked(updatedData.some(item => item.checked));
  };

  const navigate = useNavigate()
  useEffect(() => {
    if (isSubmitting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (!isSubmitting) {
        setIsSubmitting(false)
        setMessage('');
        setStatus(false);
        setError(false);
      }
    }
  }, [countdown, isSubmitting]);
  // Sử dụng useEffect để kiểm soát việc đóng overlay khi countdown kết thúc
  useEffect(() => {
    if (countdown === 0 && closingOverlay) {
      // Khi countdown kết thúc và biến state đóng overlay được đặt, đóng overlay
      onClose(false);
    }
  }, [countdown, closingOverlay]);

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    try {

      setLoading(true)
      setIsSubmitting(true)
      const result = await onUpdate(editingEventId, inputValues)
      console.log(result)
      if (result.message) {
        setLoading(false)
        setMessage('Note added successfully. Auto close in ');
        setStatus(true)
        setCountdown(3); // Khởi động lại đếm ngược
        // Đặt biến state để không đóng overlay ngay lập tức
        setClosingOverlay(true);
      } else {
        setMessage(result.message);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      const checkedItems = data.filter(item => item.checked);
      for (const item of checkedItems) {
        const result = await onDelete(item.id);
        console.log(result)
        if (result.message) {
          setLoading(false)
          setMessage('Note deleted successfully. Auto close in ');
          setStatus(true)
          setCountdown(3); // Khởi động lại đếm ngược
          // Đặt biến state để không đóng overlay ngay lập tức
          setClosingOverlay(true);
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  }
  return (
    <>
      <Form value={existEvents} onChange={e => setDeleteId(e.target.value)}>
        {initialCheckedData.length > 0 ?
          <>
            {existEvents.map((event, index) => (
              <div
                key={index} className='w-100 text-nowrap text-truncate overflow-hidden fs-6 '>
                {
                  !isEdited
                    ?
                    <div className="d-flex">
                      <input
                        type="checkbox"
                        id="checkbox-id"
                        checked={event.checked}
                        onChange={() => handleCheckboxChange(event.id)}
                      />
                      <Button
                        disabled={event.date_type === 'note-event' ? true : false}
                        onClick={() => navigate(`/detail/importantdates/${event.conf_id}`)}
                        className='w-100 d-flex justify-content-between border border-info rounded mt-1 mb-2 ms-2 px-2 text-color-darker bg-primary-normal'

                      >
                        {event.note}
                        {event.date_type !== 'note-event' && <span>{`${`->`}`}</span>}

                      </Button>
                    </div>
                    :
                    <Form.Control
                      placeholder={event.note}
                      type="text"
                      name={event.id}
                      value={inputValues[event.id] || ''}
                      onChange={e => handleInputChange(e, index)}
                      className='my-2'
                      autoFocus
                    />
                }
              </div>
            ))}

            {
              error &&
              <span className="text-danger">{message}</span>
            }
            {
              status &&
              <span className="text-success">{message} {countdown}</span>
            }
            <div className="d-flex justify-content-center">
              {
                isEdited ?
                  <>
                    <Button
                      onClick={() => setisEdited(false)}
                      className='rounded-2 bg-secondary border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
                      Cancel
                    </Button>
                    {
                      !loading && !isSubmitting ?

                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
                          <Image width={20} height={20} className='me-2' src={EditIcon} />
                          Edit
                        </Button>
                        :
                        <Button className='w-50 rounded-2 border-0 bg-primary-normal' disabled>
                          <Spinner animation="border" size="sm" />;
                        </Button>
                    }

                  </>
                  :
                  <>
                    <Button
                      disabled={!anyChecked}
                      type="submit"
                      onClick={handleDelete}
                      className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
                      <Image width={20} height={20} className='me-2' src={EditIcon} />
                      Delete
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => setisEdited(true)}
                      className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
                      <Image width={20} height={20} className='me-2' src={EditIcon} />
                      Edit
                    </Button>
                  </>
              }

            </div>
          </>
          : <span>No events</span>
        }
      </Form>
    </>
  );
}

export default UpdateNoteInput