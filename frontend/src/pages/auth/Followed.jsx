import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from './../../components/Conference'
import useFollow from '../../hooks/useFollow'
import useFilter from '../../hooks/useFilter'
import { getUniqueConferences } from '../../utils/checkFetchedResults'
import { filterListbyCondition } from '../../utils/filterAuth'
import useLocalStorage from '../../hooks/useLocalStorage'
import Filter from '../../components/Filter/Filter'

const Followed = () => {
  const { listFollowed } = useFollow()
  const { filterOptionsAuth } = useFilter()
  const [displayConferences, setdisplayConferences] = useState(listFollowed)
  const { user } = useLocalStorage()
  useEffect(() => {
    console.log('follow', getUniqueConferences(filterOptionsAuth))
    if (getUniqueConferences(filterOptionsAuth).length > 0) {
      const filterResults = filterListbyCondition(listFollowed, filterOptionsAuth)
      setdisplayConferences(filterResults)
    }
    else {
      setdisplayConferences(listFollowed)
    }

  }, [filterOptionsAuth, listFollowed, user])

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
          <Filter
            optionsSelected={filterOptionsAuth}
            statenameOption={'filterOptionsAuth'}
          />
        </div>
            <Conference conferences={displayConferences} width={960} />
          </>
          :
          <p>No conferences available.</p>
      }

    </Container>
  )
}

export default Followed