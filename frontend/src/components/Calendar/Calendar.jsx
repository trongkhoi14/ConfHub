import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Modal, Form, Overlay, Popover } from 'react-bootstrap';
import styles from './calendar.module.css'
import { formatDate } from '../../utils/formatDate';
import EventOverlay from './EventOverlay';
import useFollow from '../../hooks/useFollow';
import useNote from '../../hooks/useNote';
import useLocalStorage from '../../hooks/useLocalStorage';
import useConference from '../../hooks/useConferences';
const Calendar = () => {
  const { user }= useLocalStorage()
  const { handleGetList } = useConference()
  const {listFollowed, getListFollowedConferences} = useFollow()
  const { notes, getAllNotes} = useNote()
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([
    { _id: "65b81b006de0bd3c98cc1d9e", date: '2024-03-12T17:00:00.000Z', description: 'Book hotel', type: "note-event" },
    { _id: "65b81b006de0bd3c98cc1d9e", date: '2024-03-15T17:00:00.000Z', description: 'Camera ready date', type: "camera-event"},
    { _id: "65b81b006de0bd3c98cc1d9e", date: '2024-04-31T17:00:00.000Z', description: 'Conference date', type: "conference-event" },
    { _id: "65b81b006de0bd3c98cc1d9e", date: '2024-04-10T17:00:00.000Z', description: 'Submission date', type: "submission-event" },
    { _id: "65b81b006de0bd3c98cc1d9e", date: '2024-04-20T17:00:00.000Z', description: 'Notification date', type: "notification-event" }
    // Add more events as needed
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDescription, setEventDescription] = useState('');
  const [existEvents, setExistEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);


  useEffect(()=>{
    handleGetList()
    getAllNotes()
  }, [user])
  

  const handleClick = (date, event) => {
    // Tạo danh sách sự kiện cho ngày được chọn
  const dateVal = formatDate(date);
  const dateEvents = notes.filter((event) => event.date_value === dateVal);
console.log({notes, dateEvents})
    setExistEvents(dateEvents)
    setShow(!show);
    setTarget(event.target);
  };
  const getDaysInMonth = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1);    
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDay = firstDayOfMonth.getDay(); // Ngày trong tuần của ngày đầu tiên (0-6)
    const daysInMonth = [];

  
    // Nếu ngày đầu tiên không phải là thứ 2 (Monday), thêm các ngày của tháng trước vào mảng daysInMonth
    if (startingDay !== 1) {
      const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
      const daysToAdd = startingDay - 1;
  
      for (let i = 0; i < daysToAdd; i++) {
        const previousDay = new Date(year, month - 1, lastDayOfPreviousMonth - i);
        daysInMonth.unshift(previousDay);
      }
    }
  
    // Thêm ngày của tháng hiện tại
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      daysInMonth.push(date);
    }
    // Thêm ngày của tháng sau để đảm bảo có đủ 35 ngày
    const remainingDays = 35 - daysInMonth.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(year, month + 1, i);
      daysInMonth.push(nextMonthDate);
    }
  
  
    // Chỉ lấy 35 giá trị
    return daysInMonth.slice(0, 35);
  };
  


  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };


  const handleSaveEvent = () => {
    setEvents([...events, { date: formatDate(selectedDate), description: eventDescription }]);
    setSelectedDate(null);
    setEventDescription('');
    setSelectedDate(null)
    setShow(!show);
    setTarget(null);
  };

  const renderEventsForDate = (date) => {
    const dateVal = formatDate(date)
    const dateEvents = notes.filter((event) => event.date_value === dateVal );
    if(dateEvents.length > 0) {
      return dateEvents.map((event, index) => (
        <div key={index} className={`${styles['event']} ${styles[event.subStyle]} text-nowrap text-truncate overflow-hidden`}>
          {event.name ? event.name : 'Input your note'}
        </div>
      ));
    }
    return null
  };
  const renderWeek = (week, rowIndex) => (
    <div className="d-flex flex-wrap" key={rowIndex}>
      {week.map((day, index) => (
        <div
          key={index}        
          className={`${styles.day}  ${selectedDate && selectedDate.getTime() === day.getTime() ? styles.selected : ''}`}
          onClick={(e) => handleClick(day, e)}
        >
          <div className='text-end'>{day.getDate()}</div>
          <div className={` ${styles['event-container']}`}>{renderEventsForDate(day)}</div>
        </div>
      ))}
    </div>
  );

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
  const weeks = [];
  let currentWeek = [];
  let currentDayIndex = 0;

  daysInMonth.forEach(() => {
    // Thêm ngày vào currentWeek
    currentWeek.push(daysInMonth[currentDayIndex]);
    currentDayIndex++;

    // Nếu currentWeek đã có 7 ngày hoặc đã đến ngày cuối cùng của tháng
    if (currentWeek.length === 7 || currentDayIndex === daysInMonth.length) {
      weeks.push([...currentWeek]); // Thêm currentWeek vào mảng weeks
      currentWeek = []; // Reset currentWeek
    }
  });

    return weeks.map((week, index) => renderWeek(week, index));
  };

  return (
    <Container>
      <Row className="align-items-center justify-content-space mb-3">
        <Col xs="auto" className="d-flex">
          <Button variant="primary" className='rounded-0 border border-0 bg-blue-dark px-4' onClick={handlePrevMonth}>&lt;</Button>
          <Button variant="primary" className='rounded-0 border border-0 bg-blue-dark px-4' onClick={handleNextMonth}>&gt;</Button>
        </Col>
        <Col xs="auto" className='mx-auto'>
          <h4 className="d-inline">
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
        </Col>
      </Row>
    
      <div className="d-flex">

        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ].map((day, index) => (
          <div key={index} className={`${styles['day-in-week']}`}>
            {day}
          </div>
        ))}
      </div>
      <div ref={ref}>
        <div className="d-flex flex-wrap">
          {renderCalendar()}
        </div>
        <EventOverlay
          show={show}
          target={target}
          container={ref}
          setShow={setShow}
          selectedDate={selectedDate}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          handleSaveEvent={handleSaveEvent}
          existEvents = {existEvents}
      />
      </div>
    </Container>
  );
};

export default Calendar;
