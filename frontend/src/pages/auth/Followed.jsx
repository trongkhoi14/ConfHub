import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from './../../components/Conference'
import useFollow from '../../hooks/useFollow'
import useFilter from '../../hooks/useFilter'

import useLocalStorage from '../../hooks/useLocalStorage'
import Filter from '../../components/Filter/Filter'
import Loading from '../../components/Loading'

const Followed = () => {
  const { listFollowed, getListFollowedConferences } = useFollow()
  const { optionsSelected, resultFilter } = useFilter()
  const [displayConferences, setdisplayConferences] = useState([])
  const { user } = useLocalStorage()
  useEffect(()=>{
    getListFollowedConferences()
  },[user])
  useEffect(() => {
    if (resultFilter.length > 0) {
      const filterResults = resultFilter.filter(itemFilter => listFollowed.some(itemPosted => itemPosted.id === itemFilter.id));
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
          <Filter/>
        </div>
            <Conference conferences={displayConferences} width={960} />
          </>
          :
          <p>{`You haven't followed any conferences yet. `}</p>
      }

    </Container>
  )
}

export default Followed