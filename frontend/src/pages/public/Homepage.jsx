import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import useFilter from '../../hooks/useFilter'
import useConference from '../../hooks/useConferences'
import { checkExistValue, getUniqueConferences } from '../../utils/checkFetchedResults'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {appliedFilterResult, optionsSelected} = useFilter()
    const {conferences, handleGetList} = useConference()
    const [check, setCheck] = useState(false)
   useEffect(()=>{
    const fetchData = async () => {
      //await handleGetList()
    }
    fetchData()
   }, [])
   useEffect(()=>{
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    setCheck(isAppliedFilter)
   },[optionsSelected])
  return (
    <div style={{marginTop: "100px"}}>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
         <Filter/>
      {check? 
        <Conference conferencesProp={getUniqueConferences(appliedFilterResult)} width={1260}/>
        :
        <Conference conferencesProp={conferences} width={1260}/>}
    </div>
    
  )
}

export default Homepage