import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from './../../components/Conference'
import useFollow from '../../hooks/useFollow'
import useSearch from '../../hooks/useSearch'

import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'
import { checkExistValue, getUniqueConferences } from '../../utils/checkFetchedResults'
import ResultFilter from '../../components/Filter/ResultFilter'
import Search from '../../components/Filter/Search'

const Followed = () => {
  const { listFollowed, getListFollowedConferences } = useFollow()
  const { appliedFilterResult, optionsSelected } = useSearch()
  const [displayConferences, setdisplayConferences] = useState([])
  const { user } = useLocalStorage()
  useEffect(()=>{
    getListFollowedConferences()
  },[user])
  
  useEffect(() => {
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    if (isAppliedFilter) {
      console.log('ap dung fileter', )
      const followedFilter = getUniqueConferences(appliedFilterResult)
      const filterResults = followedFilter.filter(itemFilter => listFollowed.some(itemPosted => itemPosted.id === itemFilter.id));
      console.log({followedFilter, listFollowed, filterResults})
      setdisplayConferences(filterResults)
    }
    else {
      setdisplayConferences(listFollowed)
    }

  }, [optionsSelected, listFollowed])

 
  return (
    <Container  
      fluid
      className='py-5 ' style={{ marginLeft: "350px", marginTop: "60px" }}>
      <h4 className=''>Followed Conference</h4>
      <h6>{`Review the list of events you previously saved. Pay attention to the time so you don't miss it.`}</h6>

      {
        listFollowed && listFollowed.length > 0
          ?
          <>
          <div style={{ width: "1000px" }}>
          <Search/>
        </div>
            <ResultFilter conferencesProp={displayConferences} width={960} />
          </>
          :
          <p>{`You haven't followed any conferences yet. `}</p>
      }

    </Container>
  )
}

export default Followed