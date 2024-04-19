import React, { useEffect, useState } from 'react'
import useConference from '../../hooks/useConferences'
import { getIdFromPathname } from '../../utils/getID';
import { useLocation } from 'react-router-dom';

const CallforpaperPage = () => {
  const {conference, handleGetOne} = useConference()  
  const [fetchCount, setFetchCount] = useState(0);  
  const {pathname} = useLocation()
  const id = getIdFromPathname(pathname)
  useEffect(() => {
    if (fetchCount < 5 ) {
      handleGetOne(id)
      // Tăng giá trị fetchCount sau khi fetch
      setFetchCount(fetchCount + 1);
    }
  }, [fetchCount, conference, handleGetOne, id]);
  return (
    <div className='px-5 mx-5 pt-4'>
      <span className='fs-4 fw-bold'>Call for paper</span>
      {
        conference
        ?
        <>
        <div style={{textAlign: "justify", textJustify: "inter-word"}}>{conference.name}</div>
      <div style={{textAlign: "justify", textJustify: "inter-word"}} className='text-danger'>{conference.cfp_content}</div>
        </>
        :
        <span>Please refresh page.</span>
      }
    </div>
  )
}

export default CallforpaperPage