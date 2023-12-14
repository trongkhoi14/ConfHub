import React, { useState } from "react";

import { Button, Image } from 'react-bootstrap'

import deleteIcon from "../../assets/imgs/del.png";
import RedDeleteIcon from "../../assets/imgs/redDel.png";
import useFilter from "../../hooks/useFilter";

const FilterSelected = () => {
  const { keywordFilter, deleteKeyword, clearKeywords } = useFilter()
  return (
    <>
      {
        keywordFilter.length !== 0
          ?
          <div className="d-flex flex-wrap border-1 border border-light-subtle p-3 my-3 rounded-3">
            {keywordFilter.map((filter, index) => (
              <div
                key={index}
                className="fs-6 py-1 px-2 fw-bold border border-secondary rounded-pill d me-3 mb-3  d-flex align-items-center">
                {filter}
                <Button
                  onClick={() => { deleteKeyword(filter) }}
                  className="border-0 p-0  bg-transparent  d-flex align-items-center">
                  <Image width={20} src={deleteIcon} alt="" className="ms-1" />
                </Button>
              </div>
              ))}

            <Button
              onClick={() => {
                clearKeywords();
              }}
              className="fs-6 py-1 px-2 fw-bold border border-danger bg-white text-red-normal rounded-pill d me-3 mb-3  d-flex align-items-center">

              Reset All
              <Image width={20} src={RedDeleteIcon} alt="" className="ms-1" />
            </Button>
          </div>
          :
          <></>

      }
    </>

  );
};

export default FilterSelected;