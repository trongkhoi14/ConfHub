import { Stack, Form, InputGroup, Button, Image, Container, Row, Col, Tooltip, Overlay } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

import DateRangePicker from "./DateRangePicker";
import AdvancedFilter from "./AdvancedFilter";

import filterIcon from '../../assets/imgs/filter.png'
import searchIcon from '../../assets/imgs/search.png'
import downIcon from '../../assets/imgs/down.png'
import FilterSelected from "./FilterSelected";
import useFilter from "../../hooks/useFilter";
import Options from "./Options";
import { checkExistValue } from "../../utils/checkFetchedResults";
import { useLocation } from "react-router-dom";

const Filter = () => {
  const {sendFilter, addKeywords, clearKeywords, optionsSelected} = useFilter()
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("")  
  const [isClickSearch, setIsClickSearch] = useState(false)
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(()=>{
    clearKeywords()    
  }, [pathname])

  useEffect(()=>{
    setIsClickSearch(false)
  }, [optionsSelected])
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  useEffect(() => {
    // Mỗi khi danh sách thay đổi, hiển thị tooltip
    if(checkExistValue(optionsSelected).some(value => value === true) ){
      setShowTooltip(true);
    // Sau 3 giây, ẩn tooltip
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
    }
  }, [optionsSelected]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleApplySearch = () => {
    if(searchInput!==''){
      addKeywords("search", [searchInput])
    }
    setIsClickSearch(true)
    sendFilter()
  }
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  }

  return (
    <Container className="bg-white shadow rounded-4 px-5 pb-4 mb-5">
      <div className="d-flex align-items-center mb-2">
        <Image src={filterIcon} width={22} height={22} className="me-2" />
        <h4 className="m-0">Filter</h4>
      </div>
      <Stack>
        <span className="fw-bold text-color-black">What are you looking for?</span>
        <InputGroup className="mt-2 mb-3 border-0 w-50">
          <InputGroup.Text className="border-0 bg-blue-light pe-0">
            <Image src={searchIcon} width={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search for location, conference name, acronym, etc"
            className="border-0 bg-blue-light"
            type="text"
            value={searchInput}
            name="searchInput"
            onChange={handleSearchChange}
            onKeyDown={handleEnterSearch}
          />
          {/*Button Search */}
          
          <Button 
              ref={tooltipRef}
              onClick={handleApplySearch}
              className={
                checkExistValue(optionsSelected).some(value => value === true) 
                ?
                "bg-primary-light text-primary-normal fw-bold border-0"
                 : 
                 "bg-blue-light text-primary-normal fw-bold border-0"
              }
              disabled ={ checkExistValue(optionsSelected).some(value => value === true) ? false : true}
              
              >Search 
              </Button>
              <Overlay 
      target={tooltipRef.current} 
      show={showTooltip} 
      placement="right"
      
    >
      <Tooltip id="button-tooltip">Click to apply filter</Tooltip>
    </Overlay>

        </InputGroup>
      </Stack>

      {/*Filer dropdown */}

      <Row direction="horizontal" gap={3} className="w-100  d-flex justify-content-center">
        <Col>
          <span className="fw-bold text-color-black">Category</span>
          <Options label={"category"}/>
        </Col>
        <Col >
          <span className="fw-bold text-color-black">Location</span>
          <Options label={"location"}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-black">Submission date</span>
          <DateRangePicker label={"submissionDate"}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-blackcolor-black">Conference date</span>
          <DateRangePicker label={"date"}/>
        </Col>
        
      </Row>
      <Button 
      onClick={()=>setShowAdvancedFilter(!showAdvancedFilter)}
      className="bg-white border-0 text-primary-normal p-0 fw-bold my-3">
        Show more advanced filter
        <Image src={downIcon} width={15}
        className={showAdvancedFilter ? "ms-2 rotate-180" : 'ms-2'}/>
      </Button>
      {showAdvancedFilter && <AdvancedFilter/>}
      {optionsSelected && <FilterSelected isClickedSearch={isClickSearch}/>}  
    </Container>
  );
};

export default Filter;