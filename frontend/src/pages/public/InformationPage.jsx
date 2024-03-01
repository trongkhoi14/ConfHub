import { Col, Row } from 'react-bootstrap'
import Comments from '../../components/Comments'

import useConference from '../../hooks/useConferences'
import { formatDate } from '../../utils/formatDate'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../../components/RedirectButton'

const InformationPage = () => {
  const {conference, handleGetOne} = useConference()
  
  const renderFieldOfResearch = (fieldOfResearch) => {
    if (Array.isArray(fieldOfResearch)) {
      // Trường là một danh sách
      return fieldOfResearch.map((item, index) => (
        <div key={index}>{item}</div>
      ));
    } else {
      // Trường là một giá trị đơn
      return <div>{fieldOfResearch}</div>;
    }
  };
  
  return (
    <div className='px-5 mx-5 pt-4'>
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span>Conference information</span>
        <RedirectButton/>
      </div>
      {conference ? 
      <>
      
      <div className='fs-5 fw-bold mt-2 ps-3'>{conference.name}</div>
      <div className='mt-2'>
        <Row className='bg-light py-3 ps-5'>

          <Col xs={4}>Location:</Col>
          <Col className='fw-bold'>{conference.location}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Conference date:</Col>
          <Col className='fw-bold'>{formatDate(conference.date)}</Col>         
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Category:</Col>
          <Col className='fw-bold'>{capitalizeFirstLetter(conference.category)}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Acronym:</Col>
          <Col  className='fw-bold'>{conference.acronym}</Col>
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Source:</Col>
          <Col className='fw-bold'>{conference.source}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rank:</Col>
          <Col className='fw-bold'>{conference.rank}
          </Col>         
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4}>Type:</Col>
          <Col className='fw-bold'>{capitalizeFirstLetter(conference.type)}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Impact factor:</Col>
          <Col  className='fw-bold'>{conference.impactFactor}</Col>
        </Row>
        <Row className='bg-light py-3 ps-5'>
          <Col xs={4} className='d-flex align-items-center'>Average rating:</Col>
          <Col className='fw-bold'>
          {Object.entries(conference.rating).map(([key, value]) => (
          <div key={key}>
            <span>{capitalizeFirstLetter(key)}: </span>{value}
          </div>
        ))}
          </Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
          <Col  className='fw-bold'>
            {renderFieldOfResearch(conference.fieldOfResearch)}
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