import React, { useEffect, useState } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import ArrowIcon from './../../assets/imgs/arrow.png'
import useFormDataInput from '../../hooks/useFormDataInput'
import useAccordionDates from '../../hooks/useAccordionDates'
const ImportantDatePage = () => {
  const { conference } = useConference()
  const { separateDatesByRound } = useAccordionDates()
  const [dates, setDates] = useState({})
  const displayFields = ['submissionDate', 'notificationDate', 'cameraReady'];

  useEffect(() => {

    // Tạo một object để chứa các mảng dựa trên giá trị của date_type

    console.log(conference)
    if (conference && conference.importantDates.length > 0) {

      const listDates = separateDatesByRound(conference.importantDates)


      setDates(listDates);

    }
  }, [conference])

  return (
    <div className='p-5 mx-5'>
      <span className='fs-4 fw-bold'>Imoprtant dates</span>
      <div className='mt-2'>
        {conference ?
          <>
            {
              Object.keys(dates).map((round, index) => (
                <>

                  {dates[round].map((date, index) => (
                    <Row className={index % 2 === 0 ? 'bg-blue-light p-2 ps-5' : 'p-2 ps-5'} key={round}>
                      {Object.keys(dates).length > 1 &&
                        <Col xs={2} className='d-flex align-items-center'>
                          {round}
                        </Col>
                      }
                      <Col xs={3} className='d-flex align-items-center'>
                        {capitalizeFirstLetter(date.date_type)}
                      </Col>
                      <Col className='fw-bold'>
                        {
                          date.date_value_old ?
                            <>
                              <span className='text-danger text-decoration-line-through'>{date.date_value_old}</span>
                              <Image src={ArrowIcon} width={20} className='mx-2' />
                              {date.date_value}
                            </>
                            :
                            <>{date.date_value}</>
                        }
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

              ))
            }
          </>
          :
          <span>Currently no information available on this page.</span>}
      </div>
    </div>
  )
}

export default ImportantDatePage