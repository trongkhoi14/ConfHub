import React from 'react'
import { Container, Image, Button, Row } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'

const YourConf = () => {
  return (
    <Container
      className='pt-5 ps-5'
      style={{}}>
      <div className='d-flex align-items-center justify-content-between pe-5 mb-4'>
        <h4 className='mb-2'>Account</h4>
        <Button className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3'>
          <Image width={20} height={20} className='me-2' src={editIcon}/>
          Add
        </Button>
      </div>
      <h1>Coming soon</h1>

    </Container>
  )
}

export default YourConf