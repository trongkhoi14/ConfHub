import React, { useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const handleClose = () => setShowAddForm(false);
  const handleShow = () => setShowAddForm(true);
  return (
    <Container
      fluid
      className='pt-5 overflow-hidden' style={{marginLeft: "350px"}}>
      <div className='d-flex align-items-center justify-content-between pe-5 mb-4'>
        <h4 className='mb-2'>Your conferences</h4>
        <Button 
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3'
          onClick={handleShow}>
          <Image width={20} height={20} className='me-2' src={editIcon}/>
          Add
        </Button>
      </div>
      <h6>No conferences added yet. Start by creating your first event!</h6>
      <AddConference show={showAddForm} handleClose={handleClose}/>

    </Container>
  )
}

export default YourConf