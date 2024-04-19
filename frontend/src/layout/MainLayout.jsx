
import { useLocation, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import NavBarDetailPage from '../components/NavBarDetailPage'
import { useEffect } from 'react'

const MainLayout = () => {
    const location = useLocation()
    useEffect(()=>{
console.log('main layout')
    },[])
  return (
    <>
        {
            location.pathname === '/login' || location.pathname === '/signup'
            ?
            null
            :
              <Header/>
            
        }
        {location.pathname.includes("/detail")&&<NavBarDetailPage/>}
        <Outlet/>

    </>
  )
}

export default MainLayout