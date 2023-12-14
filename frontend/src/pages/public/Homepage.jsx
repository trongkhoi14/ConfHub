import React, {useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'

import Filter from '../../components/Filter/Filter'
import FilterSelected from '../../components/Filter/FilterSelected'
import Result from '../../components/Result'
const Homepage = () => {
    const [showResult, setShowResult] = useState(false);
    const [showSlideShow, setShowSlideShow] = useState(true)
    const [selectedFilters, setSelectedFilters] = useState([]);
  return (
    <div>        
        {showSlideShow && <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>}
        <Filter
        showResult={showResult}
        setShowResult={setShowResult}
        setSelectedFilters={setSelectedFilters}
      />
      {showResult && (
        <FilterSelected
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      )}

      {showResult ? <Conference/> : <Conference />}
    </div>
    
  )
}

export default Homepage