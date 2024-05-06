import { useEffect, useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference'
import useLocalStorage from '../../hooks/useLocalStorage'
import Filter from '../../components/Filter/Filter'
import useFilter from '../../hooks/useFilter'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { resultFilter } = useFilter()
  const { postedConferences, getPostedConferences} = usePost()
  const [displayConferences, setdisplayConferences] = useState(postedConferences)
  const {user} = useLocalStorage()
  useEffect(()=> {
    getPostedConferences()
  }, [user])
  
  useEffect(() => {
    if (resultFilter.length > 0) {
      const filterResults = resultFilter.filter(itemFilter => postedConferences.some(itemPosted => itemPosted.id === itemFilter.id));
      setdisplayConferences(filterResults)
    }
    else {
      setdisplayConferences(postedConferences)
    }

  }, [resultFilter, postedConferences, user])
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
          <Filter/>
          <Conference conferences={displayConferences} width={960} />
        </>
        :
        <p>No conferences available.</p>
    }
  </Container>
  )
}

export default YourConf