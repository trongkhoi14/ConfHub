import { useEffect, useState } from 'react'
import { Container, Stack, Image, Navbar, Nav, ButtonGroup } from 'react-bootstrap'


import DateIcon from './../assets/imgs/conf_date_white.png'
import LocationDate from './../assets/imgs/location_white.png'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getIdFromPathname } from '../utils/getID'
import useConference from '../hooks/useConferences'
import { formatDate } from '../utils/formatDate'
import UpdateNowButton from './UpdateNowButton'
import FollowButton from './FollowButton'

const NavBarDetailPage = () => {
  const {conference, handleGetOne} = useConference()
  const [fetchCount, setFetchCount] = useState(0);
  const {pathname} = useLocation()
  const [topnavHeight, setTopnavHeight] = useState(0)
  const id = getIdFromPathname(pathname)

  const [navs, setNav] = useState([
    { event: "1", title: "Information", path: `detail/information/${id}` },
    { event: "2", title: "Imoprtant Dates", path: `detail/importantdates/${id}` },
    { event: "3", title: "Call For Paper", path: `detail/callforpaper/${id}` }
  ])
  useEffect(() => {
    // Lấy chiều cao của topnav
    const topnav = document.getElementById('header');
    if (topnav) {
      setTopnavHeight(topnav.offsetHeight);
    }

    // Thêm sự kiện lắng nghe cho scroll
    window.addEventListener('scroll', handleScroll);

    // Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const sticky = navbar.offsetTop;
      // Thêm margin-top cho navbar dựa trên chiều cao của header và vị trí scroll
      if (window.scrollY > sticky) {
        
        navbar.style.marginTop = `${topnavHeight}px`;
        navbar.classList.add("sticky");
      } else {
        navbar.style.marginTop = 0;
        navbar.classList.remove("sticky");
      }
    }
  };

  useEffect(() => {
    console.log({conference})
    if (fetchCount < 5 ) {
      handleGetOne(id)
      // Tăng giá trị fetchCount sau khi fetch
      setFetchCount(fetchCount + 1);
    }
  }, [fetchCount, conference, handleGetOne, id]);
  return (
    <Container className='m-0 w-100 p-0 mw-100 mt-5' fluid>
      <Stack className='bg-blue-normal p-5 w-100 mw-100 text-center text-white'>
        <Stack className='w-50 m-4 d-flex justify-content-center align-items-center align-self-center'>
          {
            conference ?
            <div className='information'>
            <span className='fs-3 fw-bold word-break mw-50'>{conference.name}</span>
          <div className='d-flex align-items-center my-3'>
            <Image width={25} height={25} src={DateIcon} className='me-2' />
            <span className='fs-5'>{conference.organizations[0].conf_date}</span>
          </div>
          <div className='d-flex align-items-center my-3'>
            <Image width={25} height={28} src={LocationDate} className='me-2' />
            <span className='fs-5'>{conference.organizations[0].location}</span>
          </div>
            </div>
            :
            <p className="text-white fs-3">No conference available</p>
          }
        </Stack>
      </Stack>

      <Navbar id="navbar" className='bg-white text-black'>
        <Container>

          <Nav
            className="me-auto">
            {navs.map((navlink, index) =>
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
            <UpdateNowButton path={conference}/>
            <FollowButton conference_id={id} conference={conference}/>
          </ButtonGroup>
        </Container>
      </Navbar>
      <Outlet />
    </Container>

  )
}

export default NavBarDetailPage