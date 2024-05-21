import { useEffect, useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference'
import useLocalStorage from '../../hooks/useLocalStorage'

import SuccessfulModal from '../../components/Modals/SuccessModal'
import { checkExistValue, getUniqueConferences } from '../../utils/checkFetchedResults'
import Loading from '../../components/Loading'
import ResultFilter from '../../components/Filter/ResultFilter'
import Search from '../../components/Filter/Search'
import useSearch from '../../hooks/useSearch'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { optionsSelected, appliedFilterResult } = useSearch()
  const { loading, postedConferences, getPostedConferences} = usePost()
  const [displayConferences, setdisplayConferences] = useState(postedConferences)
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const {user} = useLocalStorage()
  useEffect(()=> {
    if(postedConferences){

      getPostedConferences()
    }
  }, [user])
  
  useEffect(() => {
    console.log({postedConferences})
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    if (isAppliedFilter) {
      console.log('ap dung fileter', )
      const followedFilter = getUniqueConferences(appliedFilterResult)
      const filterResults = followedFilter.filter(itemFilter => postedConferences.some(itemPosted => itemPosted.id === itemFilter.id));
      
      setdisplayConferences(filterResults)
    }
    else {
      setdisplayConferences(postedConferences)
    }

  }, [optionsSelected, postedConferences])
  const handleCheckStatus = (status, messageSuccess) => {    
    setMessage(messageSuccess)
    if(status){
      setShowAddForm(false);
      setShowSuccess(true)
    
    }
  }
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
      <AddConference show={showAddForm} handleClose={handleClose} handleCheckStatus={handleCheckStatus} onReloadList={getPostedConferences}/>
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClose={()=>setShowSuccess(false)}/>}
    {
      postedConferences && postedConferences.length > 0
        ?
        <>
          {
            loading ?
            <>
              <Loading onReload={getPostedConferences}/>
            </>
            :
            <>
              <Search/>
              <ResultFilter conferencesProp={displayConferences} width={960} />
            </>
          }
        </>
        :
        <p>No conferences available.</p>
    }
  </Container>
  )
}

export default YourConf