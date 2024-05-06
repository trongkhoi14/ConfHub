// EventOverlay.jsx
import React, { useState } from 'react';
import { Overlay, Popover, Form, Button, Row, Col, Carousel, Tabs, Tab, Image } from 'react-bootstrap';
import { formatDate } from '../../utils/formatDate';
import { Link, useNavigate } from 'react-router-dom';

import EditIcon from './../../assets/imgs/edit.png'
import useNote from '../../hooks/useNote';
const EventOverlay = ({ show, target, container, setShow, selectedDate, eventDescription, setEventDescription, handleSaveEvent, existEvents }) => {
  const [isEdited, setisEdited] = useState(false)
  const [inputValues, setInputValues] = useState(''); // Khởi tạo state với mảng chứa một giá trị rỗng
  const [editingEventId, setEditingEventId] = useState(null);
  const { updateNote } = useNote()
  const navigate = useNavigate()
  // Hàm để cập nhật giá trị của mảng state khi có sự thay đổi trong input
  const handleChange = (index, e) => {
    const {name, value} = e.target
    setEditingEventId(existEvents[index]['id'])
    console.log({value})
    const newInputValues = [...inputValues]; // Tạo một bản sao của mảng state
  newInputValues[index] = value; // Cập nhật giá trị mới vào vị trí index
  setInputValues(value); // Cập nhật state với mảng đã được cập nhật
  };

  // Hàm để thêm một input mới vào danh sách
  const handleEditNote = () => {
    updateNote(editingEventId, inputValues)
  };

  // Hàm để xóa một input khỏi danh sách
  const handleRemoveInput = (index) => {
    const newInputValues = [...inputValues]; // Tạo một bản sao của mảng state
    newInputValues.splice(index, 1); // Xóa phần tử tại vị trí index
    setInputValues(newInputValues); // Cập nhật state với mảng đã được cập nhật
  };

  return (
    <Overlay
      show={show}
      target={target}
      placement="bottom"
      container={container}
      containerPadding={10}
    >
      <Popover id="popover-contained">
        <Popover.Header className="d-flex justify-content-between align-items-center bg-white">
          <span className='text-primary-normal'>Add Event</span>
          <Button variant="outline-secondary border border-0" size="sm" onClick={() => setShow(false)}>
            &times;
          </Button>
        </Popover.Header>
        <Popover.Body>
        <Tabs defaultActiveKey="conferences" id="tabs" className="mb-3">
  <Tab eventKey="conferences" title="Already">
    {/* Nội dung của mục 'Already notes' */}
    <span className='fw-bold text-color-medium'>Already events:</span>
    {existEvents.length > 0 ?
      <>
        {existEvents.map((event, index) => (
          <div 
          key={index} className='w-100 text-nowrap text-truncate overflow-hidden fs-6 '>
          {
            !isEdited
            ?
            <Button
            disabled={event.date_type === 'note-event' ? true : false}
            onClick={()=>navigate(`/detail/importantdates/${event.id}`)}
            className='w-100 d-flex justify-content-between border border-info rounded mt-1 mb-2 px-2 text-primary'
           
          >
          {event.name}
          <span>{`${`->`}`}</span>
          </Button>
          :
          <Form.Control
            placeholder={event.name}
            disabled={event.date_type !== 'note-event' ? true : false}
            type="text" 
            value={event.name} 
            name={event.name}
            onChange={(e) => handleChange(index, e)} 
          />
          }
          </div>
        ))}
        <div className="d-flex justify-content-center">
        {
          isEdited ?
<>
          <Button
          onClick={()=>setisEdited(false)}
          className='rounded-2 bg-secondary border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
          
          Cancel
        </Button>
          <Button
          type="submit"
          onClick={handleEditNote}
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
          <Image width={20} height={20} className='me-2' src={EditIcon} />
          Edit
        </Button>
        </>
        :
        <Button
        type="submit"
        onClick={()=>setisEdited(true)}
        className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
        <Image width={20} height={20} className='me-2' src={EditIcon} />
        Edit
      </Button>
        }
         
        </div>
      </>
      : <span>No events</span>
    }
  </Tab>
  <Tab eventKey="notes" title="Add note">
    {/* Nội dung của mục 'Your Notes' */}
    <Form>
      <div className='fw-bold text-color-medium mt-2 mb-1'>Add your note:</div>
      <Form.Control
        type="text"
        placeholder={formatDate(selectedDate)}
        aria-label="Disabled input example"
        disabled
        readOnly
      />
      <Form.Control
        as="textarea"
        rows={4}
        type="text"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        placeholder='Description...'
        className='mt-3'
      />
      <Row className="align-items-center justify-content-end mt-3">
        <Col xs="auto">
          <Button variant="primary rounded-0 border-0 px-3 py-1 bg-primary-dark" onClick={handleSaveEvent}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  </Tab>
</Tabs>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};

export default EventOverlay;
