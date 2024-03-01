// EventOverlay.jsx
import React from 'react';
import { Overlay, Popover, Form, Button, Row, Col } from 'react-bootstrap';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';


const EventOverlay = ({ show, target, container, setShow, selectedDate, eventDescription, setEventDescription, handleSaveEvent, existEvents }) => {
  console.log(existEvents)
  return (
    <Overlay
      show={show}
      target={target}
      placement="bottom"
      container={container}
      containerPadding={10}
    >
      <Popover id="popover-contained">
        <Popover.Header className="d-flex justify-content-between align-items-center bg-white">
          <span className='text-primary-normal'>Add Event</span>
          <Button variant="outline-secondary border border-0" size="sm" onClick={() => setShow(false)}>
            &times;
          </Button>
        </Popover.Header>
        <Popover.Body>
          <span className='fw-bold text-color-medium'>Already events:</span>
          {existEvents.length > 0 ?
                <>
                  {existEvents.map((event, index)=>(
                    <Link
                      key={index}
                      to={`/detail/${event._id}/importantdates`}
                      className='d-flex justify-content-between border border-info rounded mt-1 mb-2 px-2 text-primary'
                      style={{fontSize: "16px"}}
                    >
                    {event.description}
                    
                    <span>{`${`->`}`}</span>
                  </Link>
                  ))}
                </>
                : <span>k</span>
            }
          <Form>
            <div className='fw-bold text-color-medium mt-2 mb-1'>Add your note:</div>
            <Form.Control
              type="text"
              placeholder={formatDate(selectedDate)}
              aria-label="Disabled input example"
              disabled
              readOnly
            />
            <Form.Control
              as="textarea" 
              rows={4}
              type="text"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder='Description...'
              className='mt-3'
            />
            <Row className="align-items-center justify-content-end mt-3">
              <Col xs="auto" >
                <Button variant="primary rounded-0 border-0 px-3 py-1 bg-primary-dark" onClick={handleSaveEvent}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};

export default EventOverlay;
