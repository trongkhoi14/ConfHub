import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col, Modal, Form, Overlay, Popover } from 'react-bootstrap';
import styles from './calendar.module.css'
import { formatDate } from '../../utils/formatDate';
import Loading from './../Loading'
import EventOverlay from './EventOverlay';
import useFollow from '../../hooks/useFollow';
import useNote from '../../hooks/useNote';
import useLocalStorage from '../../hooks/useLocalStorage';
import useConference from '../../hooks/useConferences';
import useCalender from '../../hooks/useCalendar';
const Calendar = () => {
  const { user } = useLocalStorage()
  const { conferences } = useConference()
  const {listFollowed} =useFollow()
  const { getAllDatesInRange, getDaysInMonth} = useCalender()
  const { notes, loading, getAllNotes, updateNote, addNote, deleteNote } = useNote()
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [existEvents, setExistEvents] = useState([]);
  
  const [show, setShow] = useState(false);
  const [dateClicked, setDateClicked] = useState('')
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

useEffect(() => {
  if(notes.length === 0){
    getAllNotes()
  }
    
}, [listFollowed]);

  const handleClick = (date, event) => {
    // Tạo danh sách sự kiện cho ngày được chọn
    const dateVal = formatDate(date);
    const dateEvents = notes.filter((event) => event.date_value === dateVal);
    setDateClicked(dateVal)
    setExistEvents(dateEvents)
    setShow(!show);
    setTarget(event.target);
  };



  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };


  const renderEventsForDate = useMemo(() => {
    return (date) => {
        const formatedDate = formatDate(date);
        const dateEvents = notes.filter((event) => {
            if (event.date_value !== null) {
                if (event.date_value.includes('to')) {
                    const [startDateStr, endDateStr] = event.date_value.split(' to ');
                    const startDate = new Date(startDateStr);
                    const endDate = new Date(endDateStr);
                    return date >= startDate && date <= endDate;
                } else {
                    return event.date_value === formatedDate;
                }
            }
            return false;
        });

        if (dateEvents.length > 0) {
            const isSpanningEvent = dateEvents.some((event) => event.date_value.includes('to'));
            return dateEvents.map((event, index) => (
                <div key={index} className={`${styles['event']} ${isSpanningEvent ? styles['spanning-event'] : ''} ${styles[event.subStyle]} text-nowrap text-truncate overflow-hidden`}>
                    {event.note ? event.note : 'Input your note'}
                </div>
            ));
        }
        return null;
    };
}, [notes, formatDate]);

  
  const renderWeek = (week, rowIndex) => (
    <div className="d-flex" key={rowIndex}>
      {week.map((day, index) => (
        <div
          key={index}
          className={`${styles.day} ${selectedDate && selectedDate.getTime() === day.getTime() ? styles.selected : ''}`}
          onClick={(e) => handleClick(day, e)}
        >
          <div className='text-end'>{day.getDate()}</div>
          <div className='event-container'>{renderEventsForDate(day)}</div>
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
    <Container fluid className='p-4'>
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

        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',].map((day, index) => (
          <div key={index} className={`${styles['day-in-week']}`}>
            {day}
          </div>
        ))}
      </div>
      <div ref={ref}>
        <div className="d-flex flex-wrap">
          {
            loading ?
            <Loading onReload={getAllNotes}/>
            :
            <>
            {renderCalendar()}
            </>
          }
        </div>
        <EventOverlay
          show={show}
          target={target}
          container={ref}
          setShow={setShow}
          existEvents={existEvents}
          dateClicked={dateClicked}
          onAdd={addNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      </div>
    </Container>
  );
};

export default Calendar;
