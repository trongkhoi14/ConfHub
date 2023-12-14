import React from 'react'
import { Container } from 'react-bootstrap'
import Conference from './../../components/Conference'

const Followed = () => {
  return (
    <Container
      className='pt-5 ps-5'
      style={{}}>
      <h4 className=''>Account</h4>
      <h6>Review the list of events you previously saved. Pay attention to the time so you don't miss it.</h6>
      <Conference />
    </Container>
  )
}

export default Followed