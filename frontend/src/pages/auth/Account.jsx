import React, { useState } from 'react'
import { Container, InputGroup, ButtonGroup, Button, Image, Form, Row, Col } from 'react-bootstrap'

import useAuth from '../../hooks/useAuth'

import lockIcon from '../../assets/imgs/lock.png'
import editIcon from '../../assets/imgs/edit.png'
const test = {
  email: "example@gamil.com",
  password: "********",
  name: "testname",
  phone: "123456789",
  address: "KTX Khu B, Di An, Binh Duong",
  nationality: "Vietnam"
}
const Account = () => {
  const {user, updateProfile, changePassword} = useAuth()
  const [updateData, setUpdateData] = useState({
    password: '',
    name: '',
    phone: '',
    address: '',
    nation: ''
  })
  //profile 
  const [profile, setProfile] = useState([
    { title: "Username", value: user.name, placeholder: 'your name'},
  { title: "Phone", value: user.phone, placeholder: 'phone number'},
  { title: "Address", value: user.address, placeholder: 'your address'},
  { title: "Nationality", value: user.nationality, placeholder: 'your nationality' },
  ])
  const [isChangePassword, setChangePassord] = useState(false)
  const [isUpdate, setIsUpdate] = useState(true)

  const handleChangePassword = () => {
    changePassword(updateData.password)
  }
  const handleUpdateProfile = () => {
    updateProfile(updateData)
  }
  console.log(profile)
  return (
    <Container
      className='pt-5 ps-5 h-100'
      style={{ }}>
      <h4 className='mb-5'>Account</h4>
      <InputGroup className="mb-3 ms-4">
        <div className='me-5 pe-5 border-0 bg-transparent'>Email</div>
        {
        user.email === null 
        ? <Form.Control className='border-1 w-100'/>
        : <div id="basic-addon1" className='ms-5'>{user.email}</div>
         }
        
      </InputGroup>
      <InputGroup className="mx-3 mt-4">
        <div className='me-5 pe-5 border-0 bg-transparent'>Password</div>
        <input
              placeholder='*********'
              className='border-1 rounded-2 ms-4 p-1 text-center'
              style={{width: '200px', border: "1px solid mediumseagreen"}}
            />
      </InputGroup>

        
        <Button className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
        <Image width={18} height={20} className='me-2' src={lockIcon}/>
          Change password
        </Button>
        <h4 className='my-5'>Personal Data</h4>

        {
          profile.map(data=>(
        <Row className="mb-3 d-flex">
        
          <Col xs={2}>
          <label>{data.title}</label>
          
          </Col>
          <Col xs={5} className='ms-3'>
            {
              data === null || data === undefined
              ?
              <p  className='h6'>{data.value}</p>
              :
              <Form.Control className= 'border-1' type="text" placeholder={`Enter ${data.placeholder}`} autoFocus={true} />
            }
          </Col>
      </Row>
            ))
            
        }
        <Button className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
        <Image width={20} height={20} className='me-2' src={editIcon}/>
          Update changes
        </Button>

    </Container>
  )
}

export default Account