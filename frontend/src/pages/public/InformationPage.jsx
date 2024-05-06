import { Col, Row } from 'react-bootstrap'
import Comments from '../../components/Comments'

import useConference from '../../hooks/useConferences'
import { formatDate } from '../../utils/formatDate'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../../components/RedirectButton'
import { useEffect } from 'react'
const InformationPage = () => {
  const {conference} = useConference()
  const renderFieldOfResearch = (fieldOfResearch) => {
    if (Array.isArray(fieldOfResearch)) {
      // Trường là một danh sách
      return fieldOfResearch.map((item, index) => (
        <div key={index} className='my-1'>{item}</div>
      ));
    } else {
      // Trường là một giá trị đơn
      return <div>{fieldOfResearch}</div>;
    }
  };
  
  return (
    <div className='px-5 mx-5 pt-4 content' >
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span>Conference information</span>
        <RedirectButton conference={conference}/>
      </div>
      {conference ? 
      <>
      
      <div className='fs-5 fw-bold mt-2 ps-3'>{conference.infomation.name}</div>
      <div className='mt-2'>
        <Row className='bg-blue-light py-3 ps-5'>

          <Col xs={4}>Location:</Col>
          <Col className='fw-bold'>{conference.organizations[0].location}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Conference date:</Col>
          <Col className='fw-bold'>
           From {conference.organizations[0].start_date} to {conference.organizations[0].end_date}
          </Col>         
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Category:</Col>
          <Col className='fw-bold'>Conference</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Acronym:</Col>
          <Col  className='fw-bold'>{conference.infomation.acronym}</Col>
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Source:</Col>
          <Col className='fw-bold'>{conference.infomation.source}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rank:</Col>
          <Col className='fw-bold'>{conference.infomation.rank}
          </Col>         
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Type:</Col>
          <Col className='fw-bold'>{capitalizeFirstLetter(conference.organizations[0].type)}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rating:</Col>
          <Col className='fw-bold'>{conference.infomation.rating ? conference.infomation.rating : `N/A`}
          </Col>         
        </Row>
        <Row className='py-3 ps-5 bg-blue-light'>
          <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
          <Col  className='fw-bold'>
            {renderFieldOfResearch(conference.infomation.fieldOfResearch)}
          </Col>
        </Row>
      </div>
      </>
      :
      <span>Currently no information available on this page.</span>}
      
      <Comments/>
    </div>
  )
}

export default InformationPage