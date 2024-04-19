import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import {getDateValue } from '../utils/formatDate'

import UnfollowIcon from './../assets/imgs/unfollow.png'
import FollowIcon from './../assets/imgs/follow.png'
import TimeIcon from './../assets/imgs/time.png'
import LocationIcon from './../assets/imgs/location.png'
import { useLocation, useNavigate } from 'react-router-dom'
import useConference from '../hooks/useConferences'
import useFollow from '../hooks/useFollow'
import { isObjectInList } from '../utils/checkExistInList'

import useFilter from '../hooks/useFilter'
import { DropdownSort } from './DropdownSort'
import { isUpcoming, sortConferences } from '../utils/sortConferences'
import Filter from './Filter/Filter'

const Conference = ({conferences, width}) => {
    const { filterOptions, handleGetList } = useConference()
    const { listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()
    const { getOptionsFilter } = useFilter()
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [fetchCount, setFetchCount] = useState(0);
    const [selectOptionSort, setSelectOptionSort] = useState('')
    const [copiedConferences, setcopiedConferences] = useState([])
    const [displayConferences, setDisplayedConferences] = useState([])
    const usersPerPage = 5;
    const pagesVisited = page * usersPerPage;
    useEffect(() => {
        if (fetchCount < 2) {
            getListFollowedConferences()
            getOptionsFilter("", [])
            setFetchCount(fetchCount + 1);
        }
        setDisplayedConferences([...conferences])
        setcopiedConferences([...conferences])
    }, [fetchCount, conferences, page, filterOptions, listFollowed]);
    
   
    const handlePageClick = (event) => {
        handleGetList(event.selected)
    };

    const chooseConf = (id) => {
        navigate(`/detail/information/${id}`)
    }

    const handleFollow = (id) => {
        followConference(id)
        getListFollowedConferences()
    }

    const handleUnfollow = (id) => {
        unfollowConference(id)
        getListFollowedConferences()
    }

    const handleDropdownSelect = (value) => {
        console.log('conference', value  )
        setSelectOptionSort(value);
        if(value === "Random"){          
            setDisplayedConferences([...copiedConferences])
        }
        else {
            const sortedConferences = sortConferences(value, displayConferences)
            setDisplayedConferences(sortedConferences)
        }
        console.log('display after sorted', displayConferences)
        
      };
    return (
        <Container className='d-flex flex-column align-items-center p-0'>
           
           <div className="my-3 px-4 d-flex align-items-center justify-content-between w-100">
    <div className="h5 fw-bold">
        Conferences
        <span className='fw-normal'> ({displayConferences.length}) </span>
    </div> 
    <DropdownSort
        options={["Random", "Upcoming", "Name A > Z", "Latest"]}
        onSelect={handleDropdownSelect}
    />
</div>


            {
                displayConferences && displayConferences.length > 0
                    ?

                    (displayConferences
                        .slice(pagesVisited, pagesVisited + usersPerPage)
                        .map(conf => (
                        <Card
                            className='my-conf-card'
                            style={{ width: `${width}px` }}
                            id={conf.cfp_id} key={conf.cfp_id}>
                            <Stack className=' p-0' direction='horizontal'>
                                <div className='bg-white rounded-4 h1 fw-bolder d-flex align-items-center justify-content-center ' style={{ width: '120px', height: "120px" }}>

                                    <span className='fw-bold fs-5'>{conf.acronym}</span>

                                </div>
                                <div className=''>

                                    <Card.Body className='' onClick={() => chooseConf(conf.cfp_id)}>
                                        <Card.Title className='text-color-black'>
                                            <Stack direction='horizontal'>
                                                {isUpcoming(conf.organizations[0].conf_date)
                                                    &&
                                                    <div className='bg-yellow-normal text-light p-2 rounded-2 me-2 fs-6 fw-bold'>
                                                        Upcoming
                                                    </div>
                                                }
                                                <span className='fw-bold'>{conf.name}</span>
                                            </Stack>

                                        </Card.Title>
                                        <Stack direction="horizontal" gap={5}>
                                            <Card.Text className='d-flex align-items-center mb-1'>
                                                <Image src={TimeIcon} className='me-2' width={20} />
                                                <label className='conf-data-label'>Submission Date: </label>
                                                <span className='conf-data'>{getDateValue("sub", conf.importantDates)}</span>
                                            </Card.Text>

                                            <Card.Text className='d-flex align-items-center mb-1'>
                                                <Image src={TimeIcon} className='me-2' width={20} />
                                                <label className='conf-data-label'>Conference Date: </label>
                                                <span className='conf-data'>{conf.organizations[0].conf_date}</span>
                                            </Card.Text>
                                        </Stack>
                                        <Card.Text className='d-flex align-items-center'>
                                            <Image src={LocationIcon} className='me-2' style={{ width: '18px' }} />
                                            {conf.organizations[0].location}
                                        </Card.Text>
                                    </Card.Body>

                                    {
                                        isObjectInList(conf.cfp_id, listFollowed)
                                            ?
                                            <Button className='icon-follow' onClick={() => handleUnfollow(conf.cfp_id)} title='Unfollow'>
                                                <Image src={FollowIcon} className='me-2' style={{ width: '18px' }} />
                                                <span>Unfollow</span>
                                            </Button>
                                            :
                                            <Button className='icon-follow' onClick={() => handleFollow(conf.cfp_id)}>
                                                <Image src={UnfollowIcon} className='me-2 ' style={{ width: '18px' }} />
                                                <span>Follow</span>
                                            </Button>
                                    }

                                </div>

                            </Stack>
                        </Card>
                    ))
                    )
                    :
                    <p>No conferences available.</p>
            }
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(displayConferences.length / usersPerPage)}
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
    )
}

export default Conference