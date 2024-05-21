import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../RedirectButton'
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
    <div className='px-5 m-5 ' >
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span className='text-teal-dark'>Conference information</span>
        <RedirectButton conference={conference}/>
      </div>
      {conference ? 
      <>
      
      <div className='fs-5 fw-bold mt-2 py-3'>{conference.information.name}</div>
      <div className='mt-2'>
        <Row className='bg-teal-light py-3 ps-5'>

          <Col xs={4}>Location:</Col>
          <Col className='fw-bold'>
          {conference.organizations.length > 0 ? (
        // Nếu location không null, hiển thị giá trị của nó
        <>{conference.organizations[0].location || <span className='text-secondary'>Updating...</span>}</>
      ) : (
        // Nếu location null, hiển thị 'updating'
        <>Updating</>
      )}
          </Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Conference date:</Col>
          <Col className='fw-bold'>
          
            From {conference.organizations.length >0 ? conference.organizations[0].start_date : <span className='text-secondary'>Updating...</span>}
             {` to`} {conference.organizations.length >0 ? conference.organizations[0].end_date : <span className='text-secondary'>Updating...</span>}
         
          </Col>         
        </Row>
        <Row className='bg-teal-light py-3 ps-5'>
          <Col xs={4}>Category:</Col>
          <Col className='fw-bold'>Conference</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Acronym:</Col>
          <Col  className='fw-bold'>{conference.information.acronym}</Col>
        </Row>
        <Row className='bg-teal-light py-3 ps-5'>
          <Col xs={4}>Source:</Col>
          <Col className='fw-bold'>{conference.information.source}</Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rank:</Col>
          <Col className='fw-bold'>{conference.information.rank}
          </Col>         
        </Row>
        <Row className='bg-teal-light py-3 ps-5'>
          <Col xs={4}>Type:</Col>
          <Col className='fw-bold'>
            {
              conference.organizations.length > 0 
              ?
              capitalizeFirstLetter(conference.organizations[0].type)
              :
              'Updating...'
            }
          </Col>
        </Row>
        <Row className='py-3 ps-5'>
          <Col xs={4}>Rating:</Col>
          <Col className='fw-bold'>{conference.information.rating ? conference.information.rating : `Updating...`}
          </Col>         
        </Row>
        <Row className='py-3 ps-5 bg-teal-light'>
          <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
          <Col  className='fw-bold'>
            {renderFieldOfResearch(conference.information.fieldOfResearch)}
          </Col>
        </Row>
      </div>
      </>
      :
      <span>Currently no information available on this page.</span>}
      
    </div>
  )
}

export default InformationPage