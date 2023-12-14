import React, { useState } from 'react'
import { Container, Stack, Image, Navbar, Nav, ButtonGroup, Button } from 'react-bootstrap'


import DateIcon from './../assets/imgs/conf_date_white.png'
import LocationDate from './../assets/imgs/location_white.png'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const testData = {
    conf_name: "ACM SIGMOD-SIGACT-SIGART Conference on Principles of Database Systems",
    submissionDate: "24/05/2024",
    location: " Long Beach, CA, USA",
    form: "Conference",
    acronym: "ACM",
    source: "core2024",
    rank: "A*",
    hold: "offline",
    impact_fact: "2",
    average_rating: "4.5/5",
    field_of_research: ["4605 - Data management and data science", "4611 - Machine learning"],
    callforpaper: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
}

const NavBarDetailPage = () => {
    const [conf, setConf] = useState(testData)
    const location = useLocation()
    
    const [navs, setNav] = useState([
      {event: "1", title: "Information", path: `/detail/1/information`},
      {event: "2", title: "Imoprtant Dates", path: `/detail/1/importantdates`},
      {event: "3", title: "Call For Paper", path: `/detail/1/callforpaper`}
  ])
  return (
    <Container className='m-0 w-100 p-0 mw-100' fluid>
        <Stack className='bg-blue-normal p-5 w-100 mw-100 text-center text-white'>
            <Stack className='w-50 mx-50 d-flex justify-content-center align-items-center align-self-center'>
                <span className='fs-3 fw-bold word-break mw-50'>{conf.conf_name}</span>
                <div className='d-flex align-items-center'>
                    <Image width={35} height={35} src={DateIcon} className='me-1'/>
                    <span className='fs-5'>{conf.submissionDate}</span>
                </div>
                <div className='d-flex align-items-center'>
                    <Image width={25} height={32} src={LocationDate} className='me-1'/>
                    <span className='fs-5'>{conf.location}</span>
                </div>
            </Stack>
        </Stack>

        <Navbar className='bg-white text-black'>
        <Container>
          
          <Nav 
          className="me-auto">
            {navs.map((navlink, index)=>
                <NavLink key={index} to={navlink.path}
                  className={
                    location.pathname.includes(navlink.path)
                    ? "me-1 py-1 px-3 text-blue-normal border-bottom border-1 border-blue-normal"
                    : "me-1 py-1 px-3 "
                  }
                >
                    <span>{navlink.title}</span>
                </NavLink>
            )}
          </Nav>
          <ButtonGroup>
            <Button className='px-4 py-2 fw-bold me-2 bg-brown-normal text-brown-darker border-0 rounded-2'>Update Now</Button>
            <Button className='bg-red-normal border-0 rounded-2 px-4 fw-bold py-2'>Follow</Button>
          </ButtonGroup>
        </Container>
      </Navbar>
      <Outlet/>
    </Container>
    
  )
}

export default NavBarDetailPage