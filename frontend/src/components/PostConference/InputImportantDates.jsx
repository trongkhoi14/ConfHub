import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import useFormDataInput from '../../hooks/useFormDataInput';
import daysToWeeks from 'date-fns/fp/daysToWeeks';

const InputImportantDates = ({ formData, onChange, round }) => {

  const [dates, setDates] = useState([
    { date_type: 'Submission date', date_value: '' },
    { date_type: 'Camera ready', date_value: '' },
    { date_type: 'Registration date', date_value: '' },
    { date_type: 'Notification date', date_value: '' },
  ]);

  const handleDateChange = (index, e) => {
    const { name, value } = e.target
    const updatedDates = [...dates];
    updatedDates[index].date_value = value ;
    const newDate = {
      date_type: name,
      date_value: value
    }
    setDates(updatedDates);
    onChange(round, newDate)
  };

  
  return (
    <>
      {dates.map((date, index) => (
        <Form.Group as={Col} key={index} className="mb-3 d-flex align-items-center">
          <Form.Label column sm="3">
            {date.date_type}:
          </Form.Label>
          <Form.Control
            placeholder="Select date..."
            type="date"
            name={date.date_type}
            value={date.date_value}
            onChange={(e) => handleDateChange(index, e)}
            className='border-blue-normal'
          />
        </Form.Group>
      ))}
    </>
  );
};

export default InputImportantDates;
