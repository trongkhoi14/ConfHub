
import { Container, Stack, Image} from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

import test from '../../assets/imgs/location.png'

import avatarIcon from '../../assets/imgs/avatar_lg.png'
import useAuth from '../../hooks/useAuth'


const sidebar = [
  { path: `/admin/dashboard`, title: 'Dashboard', icon: test },
  { path: '/admin/usersmanagement', title: 'Users', icon: test },
  { path: '/admin/admin_account', title: 'Admin Account', icon: test },
  { path: '/admin/callforpapers', title: 'Pending CFPs', icon: test },
]

const Sidebar = () => {
  const {user} = useAuth()
  const location=useLocation()
  return (
    <Container fluid className="my-sidebar">
      <Stack>
        {/* Sidebar */}
        <div className='text-center mt-5 pt-5'>
                <Image roundedCircle width={80} height={80} className='mx-auto' src={avatarIcon}/>
              </div>
              <div className='text-center mt-2 text-light'>
                <h3 className='text-light'>{}</h3>
              </div>
        <Stack md={3} className="fixed-left">
        {
                sidebar.map(link => (
                    <NavLink
                    key={link.title}
                    to={link.path}
                    activeClassName="active"
                    className={
                      location.pathname === link.path
                      ? 'my-sidebar-navlink ps-2 py-3 fs-6 bg-primary-normal text-color-darker rounded-2'
                      : 'my-sidebar-navlink px-2 py-3 fs-6 '}
                    >
        
                      <Image src={link.icon} width={18} height={20} className='me-2'/>
                      {link.title}
                    </NavLink>
        
                ))
              }
        </Stack>

      </Stack>
    </Container>
  )
}

export default Sidebar