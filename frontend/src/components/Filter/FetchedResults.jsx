import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { useLocation, useNavigate } from 'react-router-dom'

import { formatDate } from '../../utils/formatDate'

import UnfollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import TimeIcon from './../../assets/imgs/time.png'
import LocationIcon from './../../assets/imgs/location.png'


import useFilter from '../../hooks/useFilter'
import useConference from '../../hooks/useConferences'
import { mergeAndCountUniqueValues } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'

const FetchedResults = () => {
  const { fetchedResults } = useFilter()
  const {listFollowed, followConference, unfollowConference, } = useFollow()
  const navigate = useNavigate()
  const location = useLocation()

  const itemsPerPage = 5; // Số lượng mục hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedConferences, setDisplayedConferences] = useState([]);


  useEffect(() => {

  }, [fetchedResults]);

  const results = mergeAndCountUniqueValues(fetchedResults)

  useEffect(() => {
    // Tính toán vị trí bắt đầu và kết thúc của mục hiển thị trên trang hiện tại
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage

    if (results.uniqueValues) {
      // Lấy danh sách hội nghị cho trang hiện tại
      const conferencesForPage = results.uniqueValues.slice(startIndex, endIndex);

      // Cập nhật danh sách hội nghị được hiển thị
      setDisplayedConferences(conferencesForPage);
    }

  }, [fetchedResults, currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const onClickFollow = (_id, isFollow) => {

  }

  const chooseConf = (id) => {
    navigate(`/detail/${id}/information`)
  }

  const maxpage = Math.ceil(results.totalCount / 5);
  return (
    <Container className='d-flex flex-column align-items-center p-0'>
      <div className="my-3 align-self-start">
        <span className="h5 fw-bold">Conferences</span> ({results.totalCount})
      </div>
      {results.uniqueValues && results.uniqueValues.length > 0 ? (
        <>
          {displayedConferences.map((conf) => (
            <Card
              className={location.pathname === "/followed" ? 'my-conf-card-followed' : 'my-conf-card-home'}
              id={conf._id} key={conf._id}
            >
              <Stack className='p-0' direction='horizontal'>
                <div className='bg-white rounded-4 h1 fw-bolder d-flex align-items-center justify-content-center' style={{ width: '120px', height: "120px" }}>
                  <span className='fw-bold fs-5'>{conf.acronym}</span>
                </div>
                <div className=''>
                  <Card.Body onClick={() => chooseConf(conf._id)}>
                    <Card.Title className='text-color-black'>
                      <Stack direction='horizontal'>
                        {conf.isUpcoming &&
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
                        <span className='conf-data'>{formatDate(conf.document[0].submissionDate)}</span>
                      </Card.Text>
                      <Card.Text className='d-flex align-items-center mb-1'>
                        <Image src={TimeIcon} className='me-2' width={20} />
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
  )
}

export default FetchedResults