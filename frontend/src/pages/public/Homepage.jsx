import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import FetchedResults from '../../components/Filter/FetchedResults'
import useFilter from '../../hooks/useFilter'
import { checkExistValue } from '../../utils/checkFetchedResults'
import SlideConferences from '../../components/SlideConferences'
import useConference from '../../hooks/useConferences'
import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'

const Homepage = () => {
    const {loading} = useAuth()
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {optionsSelected} = useFilter()
    const {conferences, handleGetList} = useConference()
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    useEffect(()=>{
      console.log('homepage')
      handleGetList()
    }, [])
  return (
    <div style={{marginTop: "100px"}}>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
         <Filter
                optionsSelected={optionsSelected}
                statenameOption={'optionsSelected'}
            />
      {isAppliedFilter ? 
        <>
        {
          loading
          ?
          <Loading/>
          :
          <FetchedResults/>
        }
        </>
        :
        <Conference conferences={conferences} width={1260}/>}
    </div>
    
  )
}

export default Homepage