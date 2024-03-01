import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import FetchedResults from '../../components/Filter/FetchedResults'
import useFilter from '../../hooks/useFilter'
import { checkExistValue } from '../../utils/checkFetchedResults'
import { Container, Stack } from 'react-bootstrap'
import SlideConferences from '../../components/SlideConferences'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {optionsSelected} = useFilter()
    useEffect(()=>{
      
    }, [optionsSelected])
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
 
  return (
    <div>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
        <Filter/>     
      {isAppliedFilter ? <FetchedResults /> : <Conference/>}
    </div>
    
  )
}

export default Homepage