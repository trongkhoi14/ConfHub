import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { useLocation, useNavigate } from 'react-router-dom'

import { formatDate, getDateValue } from '../../utils/formatDate'

import UnfollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import TimeIcon from './../../assets/imgs/time.png'
import LocationIcon from './../../assets/imgs/location.png'


import useFilter from '../../hooks/useFilter'
import useConference from '../../hooks/useConferences'
import { getUniqueConferences } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'
import { DropdownSort } from '../DropdownSort'
import { sortConferences } from '../../utils/sortConferences'
import useAuth from '../../hooks/useAuth'
import Loading from '../Loading'

const FetchedResults = () => {
  const { loading } = useAuth()
  const { fetchedResults, optionsSelected } = useFilter()
  const { listFollowed, followConference, unfollowConference, getListFollowedConferences } = useFollow()

  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const itemsPerPage = 5; // Số lượng mục hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedConferences, setDisplayedConferences] = useState([]);
  const [copiedConferences, setcopiedConferences] = useState([])
  const usersPerPage = 5;
  const pagesVisited = page * usersPerPage;

  useEffect(() => {
    const sortedConferenecs = sortConferences('Random', fetchedResults)
      setDisplayedConferences(sortedConferenecs);
      setcopiedConferences([...sortedConferenecs])

  }, [fetchedResults, currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleFollow = (id) => {
    console.log(id)
    followConference(id)
    getListFollowedConferences()
  }

  const handleUnfollow = (id) => {
    unfollowConference(id)
    getListFollowedConferences()
  }

  const chooseConf = (id) => {
    navigate(`/detail/information/${id}`)
  }
  const handleDropdownSelect = (value) => {
    console.log(value)
    if (value === "Random") {
      sortConferences(value, displayedConferences)
      setDisplayedConferences([...copiedConferences])
    }
    else {
      sortConferences(value, displayedConferences)
    }

  };
  return (
    <Container className='d-flex flex-column align-items-center p-0'>
      <div className="my-3 px-4 d-flex align-items-center justify-content-between w-100">
        <div className="h5 fw-bold">
          Conferences
          <span className='fw-normal'> ({displayedConferences.length}) </span>
        </div>
        <DropdownSort
          options={["Random", "Upcoming", "Name A > Z", "Latest"]}
          onSelect={handleDropdownSelect}
        />
      </div>
      {displayedConferences && displayedConferences.length > 0 ? (
        <>
          {displayedConferences
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((conf) => (
              <Card
                className='my-conf-card'
                style={{ width: "1260px" }}
                id={conf.cfp_id} key={conf.cfp_id}>
                <Stack className=' p-0' direction='horizontal'>
                  <div className='bg-white rounded-4 h1 fw-bolder d-flex align-items-center justify-content-center ' style={{ width: '120px', height: "120px" }}>

                    <span className='fw-bold fs-5'>{conf.acronym}</span>

                  </div>
                  <div className=''>

                    <Card.Body className='' onClick={() => chooseConf(conf.cfp_id)}>
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
                          <span>Follwed</span>
                        </Button>
                        :
                        <Button className='icon-follow' onClick={() => handleFollow(conf.cfp_id)} title='Follow'>
                          <Image src={UnfollowIcon} className='me-2 ' style={{ width: '18px' }} />
                          <span>Follow</span>
                        </Button>
                    }

                  </div>

                </Stack>
              </Card>
            ))}
        </>
      ) : (
        <p>No conferences available.</p>
      )}


      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={Math.ceil(displayedConferences.length / usersPerPage)}
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

export default FetchedResults