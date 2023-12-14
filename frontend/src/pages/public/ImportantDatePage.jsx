import React, { useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap'

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
  const [conf, setConf] = useState(testData)
  const [listdate,setList] = useState(["Round 1: 04/22/2024", "Round 2: 05/22/2024"])
  return (
    <div className='px-5 mx-5 pt-4'>
      <span className='fs-4 fw-bold'>Imoprtant dates</span>
      <div className='mt-2'>
        <Row className='bg-light p-2 ps-5'>
          <Col xs={4}>Confernce date:</Col>
          <Col>{conf.submissionDate}</Col>
        </Row>
        <Row className='p-2 ps-5'>
          <Col xs={4}>Submission date:</Col>
          <Col>
          {listdate.map((round)=>(
            <div>{round}</div>
          ))}
          </Col>         
        </Row>
        <Row className='bg-light p-2 ps-5'>
          <Col xs={4}>Notification date:</Col>
          <Col>{conf.submissionDate}</Col>
        </Row>
        <Row className='p-2 ps-5'>
          <Col xs={4}>Camera date:</Col>
          <Col>{conf.submissionDate}</Col>
        </Row>
      </div>
    </div>
  )
}

export default ImportantDatePage