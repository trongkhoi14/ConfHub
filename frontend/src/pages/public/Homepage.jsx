import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue, getUniqueConferences, mergeConferencesByKeyword } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilterStorage from '../../hooks/useFilterStorage'
import Search from '../../components/Filter/Search'
import { Row } from 'react-bootstrap'
import useFilter from '../../hooks/useFilter'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const {total, optionsSelected, getOptionsFilter} = useSearch()
    const {loading: loadingAll, conferences, totalPages: totalPagesAllConf, totalConferences, handleGetList} = useConference()
    const {getListFollowedConferences} = useFollow()
    const [check, setCheck] = useState(false)
    const [fetchParams, setFetchParams] = useState({ key: '', keyword: '' });
    const {selectOptionFilter, inputFilter, resultInputFilter, searchInput}= useFilter()
    const { dataFilters, loading, clearKeyValues, clearAllKeywords } = useFilterStorage(fetchParams.key, fetchParams.keyword);

    const [displayConferences, setDisplayedConferences] = useState([])
    const [backupDisplayConf, setBackupDisplayConf] = useState([])
   
    useEffect(()=>{
      handleGetList()
    }, [conferences])

   useEffect(()=>{
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    getListFollowedConferences()    
    getOptionsFilter("", [])
    setCheck(isAppliedFilter)


    const displayList = mergeConferencesByKeyword(dataFilters, selectOptionFilter)
    
    

    setDisplayedConferences(displayList)
    setBackupDisplayConf(displayList)
    console.log({displayList, optionsSelected})
    

   },[selectOptionFilter, dataFilters, resultInputFilter])

   
   useEffect(()=>{
    
    const commonConfs = backupDisplayConf.filter(item1 => resultInputFilter.some(item2 => item2.id === item1.id));
    console.log({commonConfs, displayConferences, resultInputFilter, inputFilter})
    setDisplayedConferences(commonConfs)
   }, [resultInputFilter])

    const handleApplyFilter = (key, keyword) => {
        setFetchParams({ key, keyword });
    };


      const displayConf = check ? displayConferences : conferences;
      const totalPagesDisplay = check ? Math.ceil(displayConf.length / 7) : totalPagesAllConf;
      const totalConfDisplay = check ? displayConf.length : totalConferences
      const isLoading = check ? loading : loadingAll

  return (
    <div style={{marginTop: "100px"}}>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
         <Search onApply={handleApplyFilter} onDelete={clearKeyValues} onClearAll={clearAllKeywords}/>
         <Conference conferencesProp={displayConf} onReloadPage={handleGetList} totalPages={totalPagesDisplay} totalConferences={totalConfDisplay} loading={isLoading}/>
    </div>
    
  )
}

export default Homepage