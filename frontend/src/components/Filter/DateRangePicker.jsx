import React, { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Dropdown, Image, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useFilter from '../../hooks/useFilter';

import dateIcon from '../../assets/imgs/conf_date_light.png'
import { formatDate } from '../../utils/formatDate';
import { formatLabel } from '../../utils/formatWord';
import { useLocation } from 'react-router-dom';
const DateRangePicker = ({ label }) => {
  const { sendFilterDate, addKeywords, getQuantity } = useFilter()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleApplyFilter = async () => {
    
    handleToggleClick()
    const keywordFormat = `${formatLabel(label)}: from ${formatDate(startDate)} to ${formatDate(endDate)}`        
    const listConference = await sendFilterDate(startDate, endDate, label, [keywordFormat])
    const quantity = getQuantity(listConference)
    const keyword = `${keywordFormat} (${quantity})`
    console.log({keywordFormat, keyword})
    addKeywords(label, [keyword])
  };
  return (
    <Dropdown className="w-100" show={showDropdown} onHide={() => setShowDropdown(false)}>
      <Dropdown.Toggle 
        onClick={handleToggleClick}
        className="w-100 d-flex justify-content-between align-items-center bg-white border-1 text-color-medium border-primary-normal" 
        id="dropdown-autoclose-true">
        <div className='d-flex align-items-center'>
          <Image src={dateIcon} width={18} className="me-2" />
          <span className="f5">mm/dd/yyyy</span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='px-2'>
        <div className="w-100 px-2 container">
          <Row>
            <Col xs={6}>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                className='w-100'
              />
            </Col>
            <Col xs={6}>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                className='w-100'
              />
            </Col>
          </Row>
        </div>
        <Dropdown.Divider />
        <ButtonGroup className='top-100 w-100 bg-white px-2 pb-2'>
          <Button
            onClick={() => setShowDropdown(false)}
            className='w-50 me-2 rounded-2 border-0 bg-secondary'>
            Cancel
          </Button>
          <Button className='w-50 rounded-2 border-0 bg-primary-normal' onClick={handleApplyFilter}>
            Apply
          </Button>
        </ButtonGroup>
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default DateRangePicker;