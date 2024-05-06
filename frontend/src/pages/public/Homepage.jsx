import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import useFilter from '../../hooks/useFilter'
import useConference from '../../hooks/useConferences'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {resultFilter} = useFilter()
    const {conferences} = useConference()
   
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
      {resultFilter.length > 0 ? 
        <Conference conferences={resultFilter} width={1260}/>
        :
        <Conference conferences={conferences} width={1260}/>}
    </div>
    
  )
}

export default Homepage