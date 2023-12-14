import React, { useState } from 'react'
import { Navbar, Container, NavDropdown, Nav, Image, Button, Dropdown, Tooltip } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import './../assets/styles/custom.css'
import { useNavigate } from 'react-router-dom'
import getNotifications from '../hooks/getNotifications'
import { useAppContext } from '../context/authContext'

import NotiIcon from './../assets/imgs/noti.png'
import avatarIcon from '../assets/imgs/avatar.png'

const Header = () => {
  const {state} = useAppContext()
  const {notifications, handleGetList} = getNotifications()
  const navigate = useNavigate()


  return (
    <Navbar expand="md" 
    className="bg-body-tertiary d-flex justify-content-between my-header  w-100 sticky-top"
    
    >
      <Container fluid className='d-flex justify-content-between shadow-sm px-5'>
        <Navbar.Brand href="/home" className='my-header-brand'>DOANTOTNGHIEP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Link to='/' className='mx-4 text-body-emphasis text-color-black fs-6' title='Homepage'>
              Home
            </Link>
            <Dropdown>
              <Dropdown.Toggle className='bg-transparent text-color-black border-0 fs-6'>
                Dropdown Button
              </Dropdown.Toggle>
        
              <Dropdown.Menu>
                <Dropdown.Item className='fs-6'>Followed Conferences</Dropdown.Item>
                <Dropdown.Item className='fs-6'>Your Conferences</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            

            <Link to='/timestamp' className='mx-4 text-body-emphasis text-color-black fs-6' title='Timestamp'>
              Timestamp
            </Link>

            <Dropdown>

              <Dropdown.Toggle
                className='noti rounded-pill p-1 my-header-bg-icon mx-4 border-0'
                style={{}}
                title='Notification'
              >
                <Image src={NotiIcon} width={20} height={24} className=' text-center m-auto' />
              </Dropdown.Toggle>


              <Dropdown.Menu className='shadow'
              >
                <div style={{ width: "200px", maxHeight: "200px" }} className='overflow-auto'>
                  {
                    notifications.map(noti =>
                      <Dropdown.Item className='text-wrap fs-6 px-4 mx-0 d-inline-block text-truncate text-overflow-elli[sis' >
                        <Link to='/detail/1' className='fs-6 text-color-black'>
                          <strong>{noti.noti_message}</strong>
                          {noti.content}
                        </Link>
                      </Dropdown.Item>
                    )
                  }
                </div>
                
            <Dropdown.Divider />
                <Link to='/notifications' className='fs-6 fw-normal m-2 pt-3 text-color-darker'>View all notifications {"   >"}</Link>
              </Dropdown.Menu>
            </Dropdown>


            {
              state.user ?
                <Link to='/account' className='rounded-pill p-1 ' title='Login / Signup'>
                  <Image src={avatarIcon} width={40}/>
                </Link>
                :
                <Button className='bg-red-normal border-0 px-4 rounded-5 fw-bold' onClick={() => navigate('/login')}>LOG IN</Button>
            }

          </Nav>

        </Navbar.Collapse>        
      </Container>
     
    </Navbar>
  )
}

export default Header