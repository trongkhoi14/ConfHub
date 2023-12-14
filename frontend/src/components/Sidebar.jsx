import React, { useState } from 'react'
import { Container, Stack, Image, Row } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

import test from './../assets/imgs/location.png'

import avatarIcon from '../assets/imgs/avatar_lg.png'

const sidebar = [
  { path: `/account`, title: 'Account', icon: test },
  { path: '/followed', title: 'Followed Conferences', icon: test },
  { path: '/yourconferences/', title: 'Your conferences', icon: test },
  { path: '/timestamp/', title: 'Timestamp', icon: test },
  { path: '/notifications/', title: 'Notifications', icon: test },
]

const Sidebar = () => {
  const [isActive, setActive] = useState(false)
  const location=useLocation()
  console.log(location.pathname)
  return (
      
        <Row
        id="sticky-sidebar"
          className='bg-primary-dark h-100 mh-100 mx-100 mh-100 flex-column ms-5 me-2 ps-2'
        
          style={{ height: '100vh', width: "310px" }}
          >
            <Row className='pe-0'>
              <div className='text-center mt-5'>
                <Image roundedCircle width={100} height={100} className='mx-auto' src={avatarIcon}/>
              </div>
              <div className='text-center mt-2 text-light'>
                <h3 className='text-light'>Username</h3>
              </div>
              {
                sidebar.map(link => (
        
                    <NavLink
                    key={link.title}
                    to={link.path}
                    activeClassName="active"
                    className={
                      location.pathname === link.path
                      ? 'my-sidebar-navlink ps-2 py-3 fs-6 bg-primary-normal text-light rounded-2'
                      : 'my-sidebar-navlink px-2 py-3 fs-6 '}
                    >
        
                      {link.title}
                    </NavLink>
        
                ))
              }
            </Row>
        </Row>
  )
}

export default Sidebar