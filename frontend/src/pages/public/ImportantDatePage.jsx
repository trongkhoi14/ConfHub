import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { formatLabel } from '../../utils/formatWord'
import { formatDate } from '../../utils/formatDate'

const ImportantDatePage = () => {
  const { conference } = useConference()
  const displayFields = ['submissionDate', 'notificationDate', 'cameraReady'];
  return (
    <div className='px-5 mx-5 pt-4'>
      <span className='fs-4 fw-bold'>Imoprtant dates</span>
      <div className='mt-2'>
        {conference ?
          <>
            {conference.importantDates.map((date, index) => (
              <Row className={index % 2 === 0 ? 'bg-blue-light p-2 ps-5' : 'p-2 ps-5'} key={index}>
                <Col xs={4} className='d-flex align-items-center'>
                  {date.date_type === 'sub' && 'Submission Date:'}
                  {date.date_type === 'cmr' && 'Camera Ready Date:'}
                  {date.date_type === 'reg' && 'Registration Date:'}
                  {date.date_type === 'noti' && 'Notification Date:'}
                </Col>
                <Col>
                  {displayFields.map((field) => (
                    <div key={field} className='my-1'>{date.date_value}</div>
                  ))}
                </Col>
                <Col>
                  {displayFields.map((field) => (
                    <div
                      key={field} className='my-1'></div>
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