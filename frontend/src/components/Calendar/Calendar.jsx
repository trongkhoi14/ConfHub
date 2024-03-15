import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Modal, Form, Overlay, Popover } from 'react-bootstrap';
import styles from './calendar.module.css'
import { formatDate } from '../../utils/formatDate';
import EventOverlay from './EventOverlay';
import useFollow from '../../hooks/useFollow';
const Calendar = () => {
  const {listFollowed} = useFollow()
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
    
  }, [])
  

  const filterEventsByDate = (date) => {
    const dateStr = formatDate(date);   
    return events.filter((event) => formatDate(event.date) === dateStr);
  };

  const handleClick = (date, event) => {
    setSelectedDate(date)
    const eventsForDate = filterEventsByDate(selectedDate);
    setExistEvents(eventsForDate)
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
  
    // Thêm ngày của tháng trước
    for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
      const date = new Date(year, month, 0 - i + 1);
      daysInMonth.push(date);
    }
  
    // Thêm ngày của tháng hiện tại
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      daysInMonth.push(date);
    }
  
    // Lấy ngày của tháng sau nếu có ít hơn 35 ngày
    while (daysInMonth.length < 35) {
      const date = new Date(year, month + 1, daysInMonth.length - lastDayOfMonth.getDate() + 1);
      daysInMonth.push(date);
    }
  
    // Chỉ lấy 35 giá trị
    return daysInMonth.slice(0, 35);
  };
  

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isPastDate = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return date < currentDate;
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
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
    const dateStr = formatDate(date);
    const dateEvents = events.filter((event) => formatDate(event.date) === dateStr);
    return dateEvents.map((event, index) => (
      <div key={index} className={`${styles['event']} ${styles[event.type]}`}>
        {event.description}
      </div>
    ));
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

    daysInMonth.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Đảm bảo còn lại của currentWeek được thêm vào nếu có
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

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
