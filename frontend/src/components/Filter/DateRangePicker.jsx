import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Dropdown, Stack, Image, ButtonGroup, Button } from 'react-bootstrap';
import { format } from 'date-fns';

import useFilter from '../../hooks/useFilter';

import dateIcon from '../../assets/imgs/conf_date_light.png'
import arrowIcon from '../../assets/imgs/arrow.png'

const DateRangePicker = ({ label }) => {
  const { addKeywords, addFilterDate } = useFilter()
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);

  const [isChangeDate, setChangeDate] = useState(false)

  const handleSelect = (ranges) => {
    setChangeDate(true)
    setDateRange([ranges.selection]);
  };
  const handleApplyFilter = () => {
    console.log(dateRange[0])
    const keywordFormat = `${label}: from ${format(dateRange[0].startDate, 'mm/dd/yyyy')} to ${format(dateRange[0].endDate, 'mm/dd/yyyy')}`
    const keyword = { from: dateRange[0].startDate, to: dateRange[0].endDate }
    console.log(keyword)
    addFilterDate(keyword)
    addKeywords(keywordFormat)
  };
  return (
    <Dropdown className="w-100">
      <Dropdown.Toggle className="w-100 d-flex justify-content-between align-items-center bg-white border-1 text-color-medium  border-dark-subtle" id="dropdown-autoclose-true">
        <div className='d-flex align-items-center'>
          <Image src={dateIcon} width={18} className="me-2" />
          {
            isChangeDate ?
              <>
                <span className='fs-6'>{format(dateRange[0].startDate, 'MMM dd yy')} </span>
                <Image src={arrowIcon} width={12} height={6} className='mx-1' />
                <span className='fs-6'>{format(dateRange[0].endDate, 'MMM dd yy')} </span>
              </>
              :
              <>mm/dd/yyyy</>
          }
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='px-2'>
        <div className="w-100 px-2">
        <DateRange
        color='#4EB1A4'
          ranges={dateRange}
          onChange={handleSelect}
          months={1}
          direction="horizontal" // Hướng sắp xếp tháng
          
        />
        </div>
        <Dropdown.Divider />
        <ButtonGroup className='top-100 w-100 bg-white px-2 pb-2'>
          <Button
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