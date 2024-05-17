import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import useFilter from '../../hooks/useFilter'
import useConference from '../../hooks/useConferences'
import { checkExistValue, getUniqueConferences } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import ResultFilter from '../../components/Filter/ResultFilter'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {appliedFilterResult, optionsSelected, resultFilter} = useFilter()
    const {conferences, total, handleGetList} = useConference()
    const {getListFollowedConferences} = useFollow()
    const [check, setCheck] = useState(false)
    const [resultsFilter, setResultFilter] = useState([])
    const [page, setPage] = useState(0)

   useEffect(()=>{
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    getListFollowedConferences()
    setCheck(isAppliedFilter)
    const {uniqueConferences, count} = {}
    console.log({resultFilter})
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
        <ResultFilter conferencesProp={getUniqueConferences(appliedFilterResult)} width={1260}/>
        :
        <Conference conferencesProp={conferences} width={1260} total={total} onReloadPage={handleGetList}/>}
    </div>
    
  )
}

export default Homepage