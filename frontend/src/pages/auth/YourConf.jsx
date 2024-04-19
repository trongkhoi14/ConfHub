import { useEffect, useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference'
import useSessionToken from '../../hooks/useToken'
import useLocalStorage from '../../hooks/useLocalStorage'
import Filter from '../../components/Filter/Filter'
import { getUniqueConferences } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import { filterListbyCondition } from '../../utils/filterAuth'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { filterOptionsAuth } = useFilter()
  const { postedConferences, getPostedConferences} = usePost()
  const [displayConferences, setdisplayConferences] = useState(postedConferences)
  const {token} = useSessionToken()
  const {user} = useLocalStorage()
  useEffect(()=> {
    getPostedConferences()
  }, [user])
  useEffect(() => {
    console.log('follow', getUniqueConferences(filterOptionsAuth))
    if (getUniqueConferences(filterOptionsAuth).length > 0) {
      const filterResults = filterListbyCondition(postedConferences, filterOptionsAuth)
      setdisplayConferences(filterResults)
    }
    else {
      setdisplayConferences(postedConferences)
    }

  }, [filterOptionsAuth, postedConferences, user])
  const handleClose = () => setShowAddForm(false);
  const handleShow = () => setShowAddForm(true);
  return (
    <Container
    fluid
    className='py-5 ' style={{ marginLeft: "350px", marginTop: "60px" }}>
    
    <div className='d-flex align-items-center justify-content-between pe-5 mb-4'>
        <h4 className='mb-2'>Your conferences</h4>
        <Button 
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3'
          onClick={handleShow}>
          <Image width={20} height={20} className='me-2' src={editIcon}/>
          Add
        </Button>
      </div>
      <AddConference show={showAddForm} handleClose={handleClose}/>
    {
      postedConferences && postedConferences.length > 0
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

export default YourConf