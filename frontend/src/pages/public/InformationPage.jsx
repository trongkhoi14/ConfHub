import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../../components/RedirectButton'
import Feedbacks from '../../components/Feedbacks/Feedbacks'
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
      
      <div className='fs-5 fw-bold mt-2 ps-3'>{conference.information.name}</div>
      <div className='mt-2'>
        <Row className='bg-blue-light py-3 ps-5'>

          <Col xs={4}>Location:</Col>
          <Col className='fw-bold'>{conference.organizations.length >0 ? conference.organizations[0].location : 'N/A'}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Conference date:</Col>
          <Col className='fw-bold'>
          From {conference.organizations.length >0 ? conference.organizations[0].start_date : 'N/A'} 
           {` to`} {conference.organizations.length >0 ? conference.organizations[0].end_date : 'N/A'}
          </Col>         
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Category:</Col>
          <Col className='fw-bold'>Conference</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Acronym:</Col>
          <Col  className='fw-bold'>{conference.information.acronym}</Col>
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Source:</Col>
          <Col className='fw-bold'>{conference.information.source}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rank:</Col>
          <Col className='fw-bold'>{conference.information.rank}
          </Col>         
        </Row>
        <Row className='bg-blue-light py-3 ps-5'>
          <Col xs={4}>Type:</Col>
          <Col className='fw-bold'>
            {
              conference.organizations.length > 0 
              ?
              capitalizeFirstLetter(conference.organizations[0].type)
              :
              'N/A'
            }
          </Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rating:</Col>
          <Col className='fw-bold'>{conference.information.rating ? conference.information.rating : `N/A`}
          </Col>         
        </Row>
        <Row className='py-3 ps-5 bg-blue-light'>
          <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
          <Col  className='fw-bold'>
            {renderFieldOfResearch(conference.information.fieldOfResearch)}
          </Col>
        </Row>
      </div>
      </>
      :
      <span>Currently no information available on this page.</span>}
      
      <Feedbacks/>
      
    </div>
  )
}

export default InformationPage