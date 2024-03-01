import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { formatLabel } from '../../utils/formatWord'
import { formatDate } from '../../utils/formatDate'

const testData = {
  conf_name: "ACM SIGMOD-SIGACT-SIGART Conference on Principles of Database Systems",
  submissionDate: "24/05/2024",
  location: " Long Beach, CA, USA",
  form: "Conference",
  acronym: "ACM",
  source: "core2024",
  rank: "A*",
  hold: "offline",
  impact_fact: "2",
  average_rating: "4.5/5",
  field_of_research: ["4605 - Data management and data science", "4611 - Machine learning"],
  callforpaper: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}
const ImportantDatePage = () => {
  const {conference} = useConference()
  const displayFields = ['submissionDate', 'notificationDate', 'cameraReady'];
  return (
    <div className='px-5 mx-5 pt-4'>
      <span className='fs-4 fw-bold'>Imoprtant dates</span>
      <div className='mt-2'>
        {conference ?
        <>
        {conference.document.map((item, index)=>(
          <Row className={index % 2 === 0 ? 'bg-light p-2 ps-5' : 'p-2 ps-5'} key={index}>
            <Col xs={4} className='d-flex align-items-center'>{item.documentName}</Col>
            <Col>
              {displayFields.map((field)=>(
                <div key={field} className='my-1'>{formatLabel(field)}</div>
              ))}
            </Col>
            <Col>
              {displayFields.map((field)=>(
                <div
                 key={field} className='my-1'>{formatDate(item[field])}</div>
              ))}
            </Col>
        </Row>
        ))}
        </>
        :
        <span>Currently no information available on this page.</span>}
      </div>
    </div>
  )
}

export default ImportantDatePage