// EventOverlay.jsx
import React, { useState } from 'react';
import { Overlay, Popover, Form, Button, Row, Col, Carousel, Tabs, Tab, Image } from 'react-bootstrap';
import { formatDate } from '../../utils/formatDate';
import { Link, useNavigate } from 'react-router-dom';

import DateNoteInput from './DateNoteInput';
import UpdateNoteInput from './UpdateNoteInput';

const EventOverlay = ({ show, target, container, setShow, existEvents, dateClicked, onAdd, onUpdate, onDelete }) => {
  
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
          <Tabs defaultActiveKey="conferences" id="tabs" className="mb-3">
            <Tab eventKey="conferences" title="Already">
              {/* Nội dung của mục 'Already notes' */}
              <span className='fw-bold text-color-medium'>Already events:</span>
              <UpdateNoteInput onClose={setShow} existEvents={existEvents} onUpdate={onUpdate} onDelete={onDelete}/>
            </Tab>
            <Tab eventKey="notes" title="Add note">
              {/* Nội dung của mục 'Your Notes' */}
              <DateNoteInput onClose={setShow} dateClicked={dateClicked}/>
            </Tab>
          </Tabs>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};

export default EventOverlay;
