
import { Col, Container, Form, Row } from 'react-bootstrap';
import Calendar from '../../components/Calendar/Calendar';

const Timestamp = () => {
  return (
    <Container
      fluid
      className='pt-5 overflow-hidden' style={{marginLeft: "350px"}}>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='mb-3'>Schedule</h4>
        <Form.Check // prettier-ignore
          reverse
          type="switch"
          id="custom-switch"
          label="Automatically add conference events to the schedule"
        />
      </div>
      <Row>
        <Col xs="9">
          <Calendar/>
        </Col>
        <Col xs="3" className='ps-3'>
          <Row className='align-items-center'>
            <div className="bg-red-normal me-2 my-1 f6" style={{width: "40px", height: "20px"}}></div>
            Submission date
          </Row>
          <Row className='align-items-center'>
            <div className="bg-blue-normal me-2 my-1" style={{width: "40px", height: "20px"}}></div>
            Notification date
          </Row>
          <Row className='align-items-center'>
            <div className="bg-brown-normal me-2 my-1" style={{width: "40px", height: "20px"}}></div>
            Camera ready date
          </Row>
          <Row className='align-items-center'>
            <div className="bg-yellow-normal me-2 my-1" style={{width: "40px", height: "20px"}}></div>
            Conference date
          </Row>
          <Row className='align-items-center'>
            <div className="bg-primary-normal me-2 my-1" style={{width: "40px", height: "20px"}}></div>
            Your note
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Timestamp