import React, { useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap'
import Comments from '../../components/Comments'

const testData = {
  conf_name: "ACM SIGMOD-SIGACT-SIGART Conference on Principles of Database Systems",
  conf_date: "10/10/2024",
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
const InformationPage = () => {
  const [conf, setConf] = useState(testData)
  const [listdate,setList] = useState(["Round 1: 04/22/2024", "Round 2: 05/22/2024"])
  return (
    <div className='px-5 mx-5 pt-4'>
      <div className='fs-4 fw-bold'>Conference information</div>
      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
      <div className='fs-5 fw-bold mt-2 ps-3'>{conf.conf_name}</div>
      <div className='mt-2'>
        <Row className='bg-light py-3 ps-5'>

          <Col xs={4}>Location:</Col>
          <Col className='fw-bold'>{conf.location}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Conference date:</Col>
          <Col className='fw-bold'>{conf.conf_date}</Col>         
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Form:</Col>
          <Col className='fw-bold'>{conf.form}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Acronym:</Col>
          <Col  className='fw-bold'>{conf.acronym}</Col>
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Source:</Col>
          <Col className='fw-bold'>{conf.source}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rank:</Col>
          <Col className='fw-bold'>{conf.rank}
          </Col>         
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Hold:</Col>
          <Col className='fw-bold'>{conf.hold}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Impact factor:</Col>
          <Col  className='fw-bold'>{conf.impact_fact}</Col>
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Average rating:</Col>
          <Col className='fw-bold'>{conf.average_rating}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Field of research:</Col>
          <Col  className='fw-bold'>
          {listdate.map((round)=>(
            <div>{round}</div>
          ))}
          </Col>
        </Row>
      </div>
      <Comments/>
    </div>
  )
}

export default InformationPage