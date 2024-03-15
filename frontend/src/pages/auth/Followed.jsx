import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Image, Stack } from 'react-bootstrap'
import Conference from './../../components/Conference'
import useConference from '../../hooks/useConferences'
import useFollow from '../../hooks/useFollow'
import { useLocation, useNavigate } from 'react-router-dom'

import UnfollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import TimeIcon from './../../assets/imgs/time.png'
import LocationIcon from './../../assets/imgs/location.png'
import { formatDate } from '../../utils/formatDate'
import { isObjectInList } from '../../utils/checkExistInList'
import ReactPaginate from 'react-paginate'
import Filter from '../../components/FilterFollowed/Filter'
import useFilter from '../../hooks/useFilter'
import { mergeAndCountUniqueValues } from '../../utils/checkFetchedResults'
import { filterListbyCondition } from '../../utils/filterFollowed'

const Followed = () => {
  const { maxpage, handleGetList} = useConference()
    const {listFollowed, followConference, unfollowConference} = useFollow()
    const {filterOptionsFollowed} = useFilter()
    const navigate = useNavigate()
    const location = useLocation()
    const [listConfFollowed, setListConfFollowed] = useState(listFollowed)
    const handlePageClick = (event) => {
        handleGetList(event.selected + 1)
    };

    const chooseConf = (id) => {
        navigate(`/detail/${id}/information`)
    }

    useEffect(()=>{
        if(mergeAndCountUniqueValues(filterOptionsFollowed).totalCount > 0) {         
            const filterResults = filterListbyCondition(listFollowed, filterOptionsFollowed)
            setListConfFollowed(filterResults)
        }
        else {
            setListConfFollowed(listFollowed)
        }
        
    },[filterOptionsFollowed])
    
  return (
    <Container
      fluid
      className='py-5 ' style={{marginLeft: "350px"}}>
      <h4 className=''>Followed Conference</h4>
      <h6>Review the list of events you previously saved. Pay attention to the time so you don't miss it.</h6>
      
      {        
      listFollowed && listFollowed.length > 0 &&
      
      <div style={{width: "970px"}}>
        <Filter/>
      </div>
      }
     {
      listFollowed.length > 0 && 
      <Container className='d-flex flex-column ps-2 p-0'>
      <div className="my-3 align-self-start">
          <span className="h5 fw-bold">Conferences</span> ({listConfFollowed.length})
      </div>

     {
      listFollowed && listFollowed.length > 0 
      ?
       
          <>
          {
           listConfFollowed.map((conf)=>(
            <Card                        
                  className={location.pathname === "/followed" ? 'my-conf-card-followed' : 'my-conf-card-home'}
                  id={conf._id} key={conf._id}>
                  <Stack className=' p-0' direction='horizontal'>
                      <div  className='bg-white rounded-4 h1 fw-bolder d-flex align-items-center justify-content-center ' style={{ width: '120px', height: "120px" }}>

                          <span className='fw-bold fs-5'>{conf.acronym}</span>

                      </div>
                      <div className=''>

                          <Card.Body className='' onClick={() => chooseConf(conf._id)}>
                              <Card.Title className='text-color-black'>
                                  <Stack direction='horizontal'>
                                      {conf.isUpcoming
                                          &&
                                          <div className='bg-yellow text-light p-1 rounded-3 me-2 fs-6 fw-bold'>
                                              Upcoming
                                          </div>
                                      }
                                      <span className='fw-bold'>{conf.name}</span>
                                  </Stack>

                              </Card.Title>
                              <Stack direction="horizontal" gap={5}>
                                  <Card.Text className='d-flex align-items-center mb-1'>
                                      <Image src={TimeIcon} className='me-2' width={20}/>
                                      <label className='conf-data-label'>Submission Date: </label>
                                      <span className='conf-data'>{formatDate(conf.document[0].submissionDate)}</span>
                                  </Card.Text>
                                  
                                  <Card.Text className='d-flex align-items-center mb-1'>
                                      <Image src={TimeIcon} className='me-2' width={20}/>
                                      <label className='conf-data-label'>Conference Date: </label>
                                      <span className='conf-data'>{formatDate(conf.date)}</span>
                                  </Card.Text>
                              </Stack>
                              <Card.Text className='d-flex align-items-center'>
                                  <Image src={LocationIcon} className='me-2' style={{ width: '18px' }} />
                                  {conf.location}
                              </Card.Text>
                          </Card.Body>
                          
                          {
                              isObjectInList(conf._id, listFollowed)
                                  ?
                                  <Button className='icon-follow' onClick={()=>unfollowConference(conf._id)}>
                                      <Image src={FollowIcon} className='me-2 ' style={{ width: '18px' }} />
                                      <span>Unfollow</span>
                                  </Button>
                                  :
                                  <Button className='icon-follow' onClick={()=>followConference(conf)}>
                                  <Image src={UnfollowIcon} className='me-2 ' style={{ width: '18px' }} />
                                  <span>Follow</span>
                                  </Button>
                          }

                      </div>

                  </Stack>
              </Card>
        ))
          }
          </>
      :
      <p>No conferences available.</p>
     }
      <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={maxpage}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="justify-content-center pagination"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
      />
  </Container>
     }
    </Container>
  )
}

export default Followed