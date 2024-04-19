import { Stack, Form, InputGroup, Button, Image, Container, Row, Col } from "react-bootstrap";
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

const Filter = ({optionsSelected, statenameOption}) => {
  const {sendFilter, addKeywords, clearKeywords} = useFilter()
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("")  
  
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(()=>{
    clearKeywords()
    
  }, [pathname])


  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleApplySearch = () => {
    addKeywords(statenameOption, "search", [searchInput])
    sendFilter("search", searchInput)
  }
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  }

  return (
    <Container className="bg-white shadow rounded-4 px-5 py-4 my-5">
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
          <InputGroup.Text className='bg-primary-light m-0 border-0 bg-primary-light p-0'>
            <Button 
              onClick={handleApplySearch}
              className="bg-primary-light text-primary-normal fw-bold border-0">Search</Button>
          </InputGroup.Text>
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
      {optionsSelected && <FilterSelected optionsSelected={optionsSelected} statenameOption={statenameOption}/>}  
    </Container>
  );
};

export default Filter;